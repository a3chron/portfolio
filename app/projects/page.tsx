import { allProjects } from "contentlayer/generated";
import { ProjectCard } from "@/components/project-card";
import { getRepoStars, starsFor } from "@/lib/github-stars";

export const revalidate = 60;

const FEATURED = ["stellar", "kaeru-kitchen", "portfolio"];

export default async function ProjectsPage() {
  const stars = await getRepoStars();
  const published = allProjects.filter((p) => p.published);
  const featured = FEATURED.map((slug) =>
    published.find((p) => p.slug === slug),
  ).filter((p) => p !== undefined);
  // Newest first; undated (planned) projects go last.
  const rest = published
    .filter((p) => !FEATURED.includes(p.slug))
    .sort(
      (a, b) =>
        new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
    );

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12 md:px-12">
      <div className="flex flex-col gap-6">
        {featured.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            stars={starsFor(stars, project.repo)}
          />
        ))}
      </div>
      <div className="my-12 h-px bg-text/20" />
      <div className="flex flex-col gap-6">
        {rest.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            stars={starsFor(stars, project.repo)}
          />
        ))}
      </div>
    </div>
  );
}
