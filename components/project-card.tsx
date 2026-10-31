import type { Project } from "contentlayer/generated";
import { ExternalLink, Github, Star } from "lucide-react";
import Link from "next/link";
import { HoverItalic } from "@/components/hover-italic";
import { formatDate } from "@/lib/format-date";
import { fullRepoName } from "@/lib/github-stars";

const repoUrl = (repo: string) => `https://github.com/${fullRepoName(repo)}`;

// The one project card, shared by the landing page and /projects: title,
// date, status, description, links and - when passed and above zero - the
// repo's GitHub stars.
export const ProjectCard = ({
  project,
  stars,
}: {
  project: Project;
  stars?: number;
}) => {
  return (
    <article className="group relative bg-mantle text-text rounded-xl p-6">
      <div className="flex items-start justify-between gap-4 text-xs text-subtext">
        <div className="flex flex-wrap items-center gap-x-3">
          {project.date ? (
            <time dateTime={project.date.slice(0, 10)}>
              {formatDate(project.date)}
            </time>
          ) : (
            <span>planned</span>
          )}
          {project.active && <span>· active</span>}
          {project.archived && (
            <span>
              · archived{" "}
              {/* Either a full date or just a year ("2024"). */}
              {project.archived.length === 10
                ? formatDate(project.archived)
                : project.archived}
            </span>
          )}
        </div>
        {stars !== undefined && stars > 0 && (
          <span
            className="flex items-center gap-1 shrink-0"
            title={`${stars} GitHub star${stars === 1 ? "" : "s"}`}
          >
            <Star size={14} />
            {stars}
          </span>
        )}
      </div>
      <h3 className="mt-2 text-2xl font-medium font-fraunces">
        {/* The ::after overlay makes the whole card the link to the page,
            while the repo/live links below stay separately clickable. */}
        <Link
          href={`/projects/${project.slug}`}
          className="after:absolute after:inset-0 hover:no-underline"
        >
          <HoverItalic>{project.title}</HoverItalic>
        </Link>
      </h3>
      <p className="mt-1 text-lg font-[350] font-fraunces text-subtext">
        {project.description}
      </p>
      {(project.repo || project.url) && (
        <div className="relative mt-4 flex gap-4 text-sm">
          {project.repo && (
            <Link
              href={repoUrl(project.repo)}
              target="_blank"
              className="flex items-center gap-1 hover:underline"
            >
              <Github size={16} />
              Repo
            </Link>
          )}
          {project.url && (
            <Link
              href={project.url}
              target="_blank"
              className="flex items-center gap-1 hover:underline"
            >
              <ExternalLink size={16} />
              Live
            </Link>
          )}
        </div>
      )}
    </article>
  );
};
