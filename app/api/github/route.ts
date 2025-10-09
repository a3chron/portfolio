import { NextResponse } from "next/server";

const GITHUB_USERNAME = "a3chron";
const GITHUB_API_BASE = "https://api.github.com";

interface GitHubUser {
  public_repos: number;
  followers: number;
}

interface GitHubRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  language: string | null;
  updated_at: string;
  fork: boolean;
}

interface GitHubStats {
  repos: number;
  stars: number;
  forks: number;
  followers: number;
  topLanguages: number;
}

async function fetchGitHubUser(): Promise<GitHubUser> {
  const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      // Add token if you have one: 'Authorization': `token ${process.env.GITHUB_TOKEN}`,
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user data: ${response.statusText}`);
  }
  return response.json();
}

async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?page=${page}&per_page=${perPage}&sort=updated`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          // Add token if you have one: 'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        },
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch repos: ${response.statusText}`);
    }

    const pageRepos: GitHubRepo[] = await response.json();

    if (pageRepos.length === 0) break;

    repos.push(...pageRepos);
    page++;
  }

  return repos;
}

async function getGitHubStats(): Promise<GitHubStats> {
  const [user, repos] = await Promise.all([
    fetchGitHubUser(),
    fetchGitHubRepos(),
  ]);

  const totalStars = repos.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0,
  );
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

  const languages = new Set(
    repos
      .filter((repo) => repo.language !== null && !repo.fork)
      .map((repo) => repo.language!),
  );

  return {
    repos: user.public_repos,
    stars: totalStars,
    forks: totalForks,
    followers: user.followers,
    topLanguages: languages.size,
  };
}

async function getFeaturedRepos(limit: number = 2): Promise<GitHubRepo[]> {
  const repos = await fetchGitHubRepos();

  const ownRepos = repos.filter((repo) => !repo.fork);

  return ownRepos
    .sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    })
    .slice(0, limit);
}

// API Route Handler
export async function GET() {
  try {
    const [stats, featuredRepos] = await Promise.all([
      getGitHubStats(),
      getFeaturedRepos(2),
    ]);

    return NextResponse.json({
      stats,
      featuredRepos,
    });
  } catch (error) {
    console.error("Error fetching GitHub data:", error);

    // Return fallback data
    return NextResponse.json({
      stats: {
        repos: 23,
        stars: 9,
        forks: 0,
        followers: 8,
        topLanguages: 5,
      },
      featuredRepos: [
        {
          name: "Gith",
          description: "A Terminal UI git helper",
          html_url: "https://github.com/a3chron/gith",
          stargazers_count: 8,
          forks_count: 0,
          language: "Go",
        },
        {
          name: "NextJS Auth Template",
          description: "A Template for NextJS projects using Auth.js",
          html_url: "https://github.com/a3chron/nextjs-auth-template",
          stargazers_count: 0,
          forks_count: 0,
          language: "TypeScript",
        },
      ],
    });
  }
}
