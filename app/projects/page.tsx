import { allProjects } from "contentlayer/generated";
import React from "react";
import { Article } from "./article";

export const revalidate = 60;
export default async function ProjectsPage() {
  const featured = allProjects.find((project) => project.slug === "n-recipe")!;
  const top2 = allProjects.find((project) => project.slug === "gith")!;
  const top3 = allProjects.find((project) => project.slug === "portfolio")!;
  const sorted = allProjects
    .filter((p) => p.published)
    .filter(
      (project) =>
        project.slug !== featured.slug &&
        project.slug !== top2.slug &&
        project.slug !== top3.slug,
    )
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
    );

  return (
    <div className="relative w-full h-full max-h-full p-6 max-w-384 mx-auto">
      <div className="space-y-8 md:space-y-16 pr-4 pb-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:mt-8">
          <Article key={featured.slug} project={featured} />

          <div className="flex flex-col w-full gap-8 mx-auto lg:mx-0">
            {[top2, top3].map((project) => (
              <Article key={project.slug} project={project} />
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-linear-to-l from-black/0 via-black to-black/0" />

        <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3 pb-6">
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 0)
              .map((project) => (
                <Article key={project.slug} project={project} />
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 1)
              .map((project) => (
                <Article key={project.slug} project={project} />
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 2)
              .map((project) => (
                <Article key={project.slug} project={project} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
