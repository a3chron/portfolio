import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  project: {
    title: string;
    description: string;
    repo?: string;
    url?: string;
    image?: string;
  };
};

export const Header: React.FC<Props> = ({ project }) => {
  const links: { label: "Repo" | "Live"; href: string }[] = [];
  if (project.repo) {
    const repoLink = project.repo.includes("/")
      ? `https://github.com/${project.repo}`
      : `https://github.com/a3chron/${project.repo}`;
    links.push({
      label: "Repo",
      href: repoLink,
    });
  }
  if (project.url) {
    links.push({
      label: "Live",
      href: project.url,
    });
  }

  return (
    <div className="bg-mantle/80 w-full h-full">
      <div className="container mx-auto relative isolate overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="text-4xl font-bold tracking-tight h-fit sm:text-6xl text-hover">
              {project.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-subtext">
              {project.description}
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-y-6 gap-x-8 text-subtext text-sm leading-7 sm:grid-cols-2 md:flex lg:gap-x-10">
              {links.map((link) => (
                <Link
                  target="_blank"
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-1.5 hover:underline"
                >
                  {link.label === "Repo" ? (
                    <Github size={16} />
                  ) : (
                    <ExternalLink size={16} />
                  )}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
