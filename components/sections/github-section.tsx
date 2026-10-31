"use client";

import { BookMarked, GitFork, Star, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HoverItalic } from "@/components/hover-italic";
import { Section } from "./section";

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
    repos: 27,
    stars: 12,
    forks: 0,
    followers: 8,
    topLanguages: 7,
  });
  const [featuredRepos, setFeaturedRepos] = useState<RepoData[]>([
    {
      name: "Gith",
      description: "A Terminal UI git helper",
      html_url: "https://github.com/a3chron/gith",
      stargazers_count: 11,
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
    <Section title="GitHub">
      <p className="text-2xl md:text-4xl font-medium font-fraunces">
        Find me on{" "}
        <Link
          href="https://github.com/a3chron"
          target="_blank"
          className="underline inline-flex"
        >
          GitHub
        </Link>
      </p>
      <p className="text-xl md:text-2xl font-semibold mt-12">
        Most of my projects are public on GitHub, feel free to take a look.
      </p>
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
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
      <h3 className="text-2xl font-medium font-fraunces mt-12 mb-4">
        Featured Repositories
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </Section>
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
    <div className="bg-mantle text-text p-3 py-6 rounded-xl flex flex-col items-center justify-center">
      <div className="mb-2">{icon}</div>
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
      className="group bg-mantle hover:no-underline p-6 rounded-xl text-text"
    >
      <h4 className="text-xl font-medium font-fraunces">
        <HoverItalic>{name}</HoverItalic>
      </h4>
      <p className="text-subtext mt-2">{description}</p>
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
