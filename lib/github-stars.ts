const GITHUB_USERNAME = "a3chron";

/** "repo" or "owner/repo" from a project's frontmatter -> "owner/repo". */
export const fullRepoName = (repo: string) =>
  repo.includes("/") ? repo : `${GITHUB_USERNAME}/${repo}`;

/** Stars of a project's repo from getRepoStars(), if it has any. */
export const starsFor = (stars: Map<string, number>, repo?: string) =>
  repo ? stars.get(fullRepoName(repo).toLowerCase()) : undefined;

/**
 * Star counts of a3chron's public repos, keyed by lowercase "owner/repo".
 * One cached request (hourly) instead of one per project; on any failure the
 * map is empty and cards simply show no stars.
 */
export async function getRepoStars(): Promise<Map<string, number>> {
  const stars = new Map<string, number>();
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`,
      {
        headers: { Accept: "application/vnd.github.v3+json" },
        next: { revalidate: 3600 },
      },
    );
    if (!response.ok) return stars;
    const repos: { full_name: string; stargazers_count: number }[] =
      await response.json();
    for (const repo of repos) {
      stars.set(repo.full_name.toLowerCase(), repo.stargazers_count);
    }
  } catch {
    // Offline or rate-limited: no stars rather than a broken page.
  }
  return stars;
}
