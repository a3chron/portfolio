"use client";

import { BookMarked, GitFork, Star, Users, Zap } from "lucide-react";
import { Block } from "../block";
import Link from "next/link";
import { useEffect, useState } from "react";

interface GitHubStats {
  repos: number;
  stars: number;
  forks: number;
  followers: number;
  topLanguages: number;
}

interface RepoData {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
}

const GithubSection = () => {
  const [stats, setStats] = useState<GitHubStats>({
    repos: 20,
    stars: 6,
    forks: 0,
    followers: 8,
    topLanguages: 5,
  });
  const [featuredRepos, setFeaturedRepos] = useState<RepoData[]>([
    {
      name: "Gith",
      description: "A Terminal UI git helper",
      html_url: "https://github.com/a3chron/gith",
      stargazers_count: 6,
      forks_count: 0,
    },
    {
      name: "NextJS Auth Template",
      description: "A Template for NextJS projects using Auth.js",
      html_url: "https://github.com/a3chron/nextjs-auth-template",
      stargazers_count: 0,
      forks_count: 0,
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setFeaturedRepos(data.featuredRepos);
      })
      .catch((error) => {
        console.error("Failed to load GitHub data:", error);
        // Keep fallback data
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Block className="bg-blue selection:text-blue">
      <div className="w-dvw 2xl:w-384 h-fit min-h-dvh p-4 md:py-12 md:px-24 flex flex-col item-center justify-center">
        <h1 className="uppercase text-4xl md:text-6xl text-blue bg-crust my-6 md:mb-16 w-fit p-1 px-2">
          #2 GitHub
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="col-span-2">
            <h1 className="text-2xl md:text-4xl font-bold">
              Find me on{" "}
              <Link
                href="https://github.com/a3chron"
                target="_blank"
                className="underline text-crust inline-flex"
              >
                GitHub
              </Link>
            </h1>
            <p className="text-xl md:text-2xl font-semibold mt-12 w-full md:w-2/3">
              Most of my projects are public on GitHub, feel free to take a
              look.
            </p>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
              <StatCard
                icon={<BookMarked />}
                value={stats.repos}
                label="Repositories"
                loading={loading}
              />
              <StatCard
                icon={<Star />}
                value={stats.stars}
                label="Stars"
                loading={loading}
              />
              <StatCard
                icon={<Zap />}
                value={stats.topLanguages}
                label="Languages"
                loading={loading}
              />
              <StatCard
                icon={<Users />}
                value={stats.followers}
                label="Followers"
                loading={loading}
              />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Featured Repositories</h2>
            <div className="grid grid-rows-2 gap-6">
              {featuredRepos.map((repo) => (
                <RepoCard
                  key={repo.name}
                  name={repo.name}
                  description={repo.description}
                  href={repo.html_url}
                  stars={repo.stargazers_count}
                  forks={repo.forks_count}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Block>
  );
};

function StatCard({
  icon,
  value,
  label,
  loading,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  loading: boolean;
}) {
  return (
    <div className="bg-bg text-text p-3 py-6 rounded-lg flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-shadow">
      <div className="text-blue mb-2">{icon}</div>
      <div className="text-3xl font-bold">
        {loading ? (
          <div className="animate-pulse bg-subtext rounded w-8 h-8" />
        ) : (
          value
        )}
      </div>
      <div className="text-subtext text-xs sm:text-base max-w-full break-all">
        {label}
      </div>
    </div>
  );
}

function RepoCard({
  name,
  description,
  stars,
  forks,
  href,
}: {
  name: string;
  description: string;
  stars: number;
  forks: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      className="group/repo-card border border-bg hover:no-underline p-6 rounded-lg transition-colors text-crust"
    >
      <h3 className="text-xl font-bold group-hover/repo-card:underline">
        {name}
      </h3>
      <p className="text-gray-700 mt-2">{description}</p>
      <div className="flex gap-4 mt-4">
        <div className="flex items-center gap-1">
          <Star size={16} />
          <span>{stars}</span>
        </div>
        <div className="flex items-center gap-1">
          <GitFork size={16} />
          <span>{forks}</span>
        </div>
      </div>
    </Link>
  );
}

export default GithubSection;
