"use client";

import type { Project } from "contentlayer/generated";
import { Calendar, CircleDot, GitCommit, GitFork, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  project: Project;
};

interface GithubStats {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  // Additional useful stats for small projects
  size: number; // KB
  created_at: string;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
  // Calculated metrics
  days_since_update?: number;
  commits_count?: number;
}

const getCacheKey = (repo: string) => `github_a3chron_${repo}`;

// Cache duration: 1 hour (in milliseconds)
const CACHE_DURATION = 60 * 60 * 1000;

const formatTimeAgo = (days: number): string => {
  if (days === 0) return "today";
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  const years = Math.floor(days / 365);
  return `${years}y ago`;
};

const getCachedData = (key: string): GithubStats | null => {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_DURATION;

    if (isExpired) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch {
    return null;
  }
};

// Set cache data
const setCachedData = (key: string, data: GithubStats): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      }),
    );
  } catch (error) {
    console.warn("Failed to cache GitHub data:", error);
  }
};

export const Article: React.FC<Props> = ({ project }) => {
  const [githubStats, setGithubStats] = useState<GithubStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!project.repo) {
      setLoading(false);
      return;
    }

    const cacheKey = getCacheKey(project.repo);

    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      setGithubStats(cachedData);
      setLoading(false);
      return;
    }

    const fetchGithubData = async () => {
      try {
        // Fetch basic repo stats
        const repoResponse = await fetch(
          `https://api.github.com/repos/a3chron/${project.repo}`,
        );
        const repoData = await repoResponse.json();

        // Fetch commit count
        const commitsResponse = await fetch(
          `https://api.github.com/repos/a3chron/${project.repo}/commits?per_page=1`,
        );
        const linkHeader = commitsResponse.headers.get("Link");
        let commits_count = 0;

        if (linkHeader) {
          const match = linkHeader.match(/page=(\d+)>; rel="last"/);
          commits_count = match ? parseInt(match[1]) : 1;
        } else {
          commits_count = 1; // At least one commit exists
        }

        const daysSinceUpdate = Math.floor(
          (Date.now() - new Date(repoData.pushed_at).getTime()) /
            (1000 * 60 * 60 * 24),
        );

        const stats: GithubStats = {
          stargazers_count: repoData.stargazers_count,
          forks_count: repoData.forks_count,
          open_issues_count: repoData.open_issues_count,
          language: repoData.language,
          size: repoData.size,
          created_at: repoData.created_at,
          updated_at: repoData.updated_at,
          pushed_at: repoData.pushed_at,
          default_branch: repoData.default_branch,
          days_since_update: daysSinceUpdate,
          commits_count,
        };

        // Cache the result
        setCachedData(cacheKey, stats);
        setGithubStats(stats);
      } catch (error) {
        console.error("Failed to load GitHub data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGithubData();
  }, [project.repo]);

  const getLanguageIcon = (language: string | null) => {
    const icons: Record<string, string> = {
      TypeScript:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      JavaScript:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      Go: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg",
      Python:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      Java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
      Rust: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg",
      CSS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
      Shell: "/languages/bash.svg",
      Nix: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nixos/nixos-original.svg",
      MDX: "/languages/mdx.svg",
    };
    return icons[language || ""];
  };

  const getLanguageColor = (language: string | null) => {
    const colors: Record<string, string> = {
      TypeScript: "bg-blue",
      JavaScript: "bg-yellow",
      Go: "bg-sky-400",
      Java: "bg-red-500",
      Python: "bg-blue-500",
      Rust: "bg-orange-600",
      C: "bg-gray-600",
      "C++": "bg-pink-500",
      Ruby: "bg-red-600",
      PHP: "bg-indigo-500",
    };
    return colors[language || ""] || "bg-gray-500";
  };

  const getLanguageShort = (language: string | null) => {
    const shorts: Record<string, string> = {
      TypeScript: "TS",
      JavaScript: "JS",
      Go: "GO",
      Java: "JV",
      Python: "PY",
      Rust: "RS",
      "C++": "C++",
    };
    return (
      shorts[language || ""] || language?.substring(0, 2).toUpperCase() || "??"
    );
  };

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="hover:no-underline w-full min-h-52 bg-mantle text-text border border-teal/20 hover:border-teal/40 duration-500 group overflow-hidden"
    >
      <article className="flex justify-between h-full">
        <div className="flex flex-col w-full">
          <div className="flex justify-between gap-2 items-center p-2 px-4 md:px-8 border-b border-b-teal/20 text-xs text-text">
            {project.date ? (
              <time dateTime={new Date(project.date).toISOString()}>
                {Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
                  new Date(project.date),
                )}
              </time>
            ) : (
              <span>PLANNED</span>
            )}
            {project.archived && (
              <time
                dateTime={new Date(project.archived).toISOString()}
                className="text-accent"
              >
                archived on{" "}
                {Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
                  new Date(project.archived),
                )}
              </time>
            )}
            {project.active && <span className="text-teal">active</span>}
          </div>
          <div className="p-4 md:px-8">
            {project.appLogo ? (
              <div className="flex flex-row items-center justify-between gap-0">
                <div className="flex flex-row items-center justify-start w-full gap-4">
                  <h2 className="z-20 text-xl font-medium duration-300 lg:text-3xl no-wrap min-w-max text-hover font-display">
                    {project.title}
                  </h2>
                  <div className="h-[2px] w-0 bg-linear-to-r from-teal/0 to-transparent group-hover:w-full group-hover:to-teal/20 duration-700" />
                </div>
                <div className="rounded-full h-fit w-fit ring-2 ring-mantle group-hover:ring-teal/20 shadow-md shadow-crust group-hover:shadow-teal/20 duration-150 delay-150 ring-offset-2 ring-offset-crust">
                  <Image
                    width={36}
                    height={36}
                    alt={`${project.title} logo`}
                    src={project.appLogo}
                    className="rounded-full object-scale-down"
                  />
                </div>
              </div>
            ) : (
              <h2 className="z-20 text-xl font-medium duration-300 lg:text-3xl text-hover font-display">
                {project.title}
              </h2>
            )}
            <p className="z-20 mt-4 text-sm duration-300 text-text group-hover:text-hover">
              {project.description}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start p-2 px-6 pr-10 border-l border-l-teal/20 h-full text-sm gap-2">
          {loading ? (
            <div className="text-xs text-text/50">Loading...</div>
          ) : githubStats ? (
            <>
              {/* Language */}
              {githubStats.language && (
                <div className="flex items-center justify-start gap-1.5 mb-2 text-xs">
                  {getLanguageIcon(githubStats.language) ? (
                    <img
                      src={getLanguageIcon(githubStats.language)}
                      alt={githubStats.language}
                      className="h-4 w-auto"
                    />
                  ) : (
                    <div
                      className={`text-xs ${getLanguageColor(githubStats.language)} text-black font-bold p-0.5 mt-0.5`}
                      style={{
                        fontSize: "8px",
                        lineHeight: "0.6rem",
                      }}
                    >
                      {getLanguageShort(githubStats.language)}
                    </div>
                  )}
                  {githubStats.language}
                </div>
              )}

              {/* Stars */}
              {githubStats.stargazers_count > 0 && (
                <div className="flex items-center justify-center gap-1.5">
                  <Star size={16} />
                  {githubStats.stargazers_count}
                </div>
              )}

              {/* Forks */}
              {githubStats.forks_count > 0 && (
                <div className="flex items-center justify-center gap-1.5">
                  <GitFork size={16} />
                  {githubStats.forks_count}
                </div>
              )}

              {/* Issues */}
              {githubStats.open_issues_count > 0 && (
                <div className="flex items-center justify-center gap-1.5">
                  <CircleDot size={16} />
                  {githubStats.open_issues_count}
                </div>
              )}

              {/* Commits - especially useful for projects with 0 stars */}
              <div className="flex items-center justify-center gap-1.5">
                <GitCommit size={16} />
                {githubStats.commits_count}
              </div>

              {/* Last updated - shows activity */}
              {githubStats.days_since_update !== undefined && (
                <div className="flex items-center justify-center gap-1.5 text-xs mt-1 whitespace-nowrap">
                  <Calendar size={14} />
                  {formatTimeAgo(githubStats.days_since_update)}
                </div>
              )}
            </>
          ) : (
            <div className="text-xs text-text/50">No public repo</div>
          )}
        </div>
      </article>
    </Link>
  );
};
