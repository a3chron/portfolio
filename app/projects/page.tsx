import Link from "next/link";
import Image from "next/image";
import React from "react";
import { allProjects } from "contentlayer/generated";
import { Article } from "./article";
import { StarIcon, GitForkIcon, CircleDotIcon } from "lucide-react";

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
          <Link
            href={`/projects/${featured.slug}`}
            className="relative hover:no-underline w-full min-h-52 bg-mantle text-text border border-teal/20 hover:border-teal/40 duration-500 group overflow-hidden"
          >
            <article className="flex justify-between h-full">
              <div className="flex flex-col w-full">
                <div className="flex justify-between gap-2 items-center p-2 px-4 md:px-8 border-b border-b-teal/20 text-xs text-text">
                  {featured.date ? (
                    <time dateTime={new Date(featured.date).toISOString()}>
                      {Intl.DateTimeFormat(undefined, {
                        dateStyle: "medium",
                      }).format(new Date(featured.date))}
                    </time>
                  ) : (
                    <span>PLANNED</span>
                  )}
                  {featured.archived && (
                    <time
                      dateTime={new Date(featured.archived).toISOString()}
                      className="text-accent"
                    >
                      archived on{" "}
                      {Intl.DateTimeFormat(undefined, {
                        dateStyle: "medium",
                      }).format(new Date(featured.archived))}
                    </time>
                  )}
                  {featured.active && <span className="text-teal">active</span>}
                </div>
                <div className="p-4 md:px-8">
                  {featured.appLogo ? (
                    <div className="flex flex-row items-center justify-between gap-0">
                      <div className="flex flex-row items-center justify-start w-full gap-4">
                        <h2 className="z-20 text-xl font-medium duration-300 lg:text-3xl no-wrap min-w-max text-hover font-display">
                          {featured.title}
                        </h2>
                        <div className="h-[2px] w-0 bg-linear-to-r from-teal/0 to-transparent group-hover:w-full group-hover:to-teal/20 duration-700" />
                      </div>
                      <div className="rounded-full h-fit w-fit ring-2 ring-mantle group-hover:ring-teal/20 shadow-md shadow-crust group-hover:shadow-teal/20 duration-150 delay-150 ring-offset-2 ring-offset-crust">
                        <Image
                          width={36}
                          height={36}
                          alt={`${featured.title} logo`}
                          src={featured.appLogo}
                          className="rounded-full object-scale-down"
                        />
                      </div>
                    </div>
                  ) : (
                    <h2 className="z-20 text-xl font-medium duration-300 lg:text-3xl text-hover font-display">
                      {featured.title}
                    </h2>
                  )}
                  <p className="z-20 mt-4 text-sm duration-300 text-text group-hover:text-hover">
                    {featured.description}
                  </p>
                  <div className="absolute bottom-4 md:bottom-8">
                    <p className="hidden text-violet duration-300 lg:block">
                      Read more <span aria-hidden="true">&rarr;</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start justify-start p-2 px-6 border-l border-l-teal/20 h-full text-sm gap-2">
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <div
                    className="text-xs bg-blue text-black font-bold p-0.5 mt-0.5"
                    style={{
                      fontSize: "8px",
                      lineHeight: "0.6rem",
                    }}
                  >
                    TS
                  </div>
                  React
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <StarIcon size={16} />
                  11
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <GitForkIcon size={16} />2
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <CircleDotIcon size={16} />6
                </div>
              </div>
            </article>
          </Link>

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
