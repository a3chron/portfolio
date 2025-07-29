import { BookMarked, Code, GitFork, Star, Users } from "lucide-react";
import { Block } from "../block";
import Link from "next/link";

const stats = {
  // TODO get by github API
  repos: 26,
  stars: 2,
  forks: 2,
  contributions: 2,
  followers: 8,
};

const GithubSection = () => {
  return (
    <Block className="bg-blue selection:text-blue">
      <div className="w-dvw 2xl:w-384 h-fit min-h-dvh p-24 flex flex-col item-center justify-center">
        <h1 className="uppercase text-6xl text-blue bg-crust mb-24 w-fit p-1 px-2">
          #2 GitHub
        </h1>

        <div className="grid grid-cols-3 gap-12">
          <div className="col-span-2">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              Find me on{" "}
              <Link
                href="https://github.com/a3chron"
                target="_blank"
                className="underline text-crust"
              >
                GitHub
              </Link>
            </h1>

            <p className="text-2xl font-semibold mt-12 w-2/3">
              I have most of my projects on github, feel free to take a look.
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              <StatCard
                icon={<BookMarked />}
                value={stats.repos}
                label="Repositories"
              />
              <StatCard icon={<Star />} value={stats.stars} label="Stars" />
              <StatCard icon={<GitFork />} value={stats.forks} label="Forks" />
              <StatCard
                icon={<Code />}
                value={stats.contributions}
                label="Contributions"
              />
              <StatCard
                icon={<Users />}
                value={stats.followers}
                label="Followers"
              />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Featured Repositories</h2>
            <div className="grid grid-rows-2 gap-6">
              <RepoCard
                name="Portfolio"
                description="My portfolio website "
                href="https://github.com/a3chron/portfolio"
                stars={1}
                forks={0}
              />
              <RepoCard
                name="NextJS Auth Template"
                description="A Template for NextJS projects using Auth.js"
                href="https://github.com/a3chron/nextjs-auth-template"
                stars={0}
                forks={0}
              />
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
}: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="bg-base text-text p-6 rounded-lg flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-shadow">
      <div className="text-blue mb-2">{icon}</div>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-subtext">{label}</div>
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
      className="group/repo-card border border-base hover:no-underline p-6 rounded-lg transition-colors text-crust"
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
