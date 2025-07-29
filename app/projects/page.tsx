import Link from "next/link";
import Image from "next/image";
import React from "react";
import { allProjects } from "contentlayer/generated";
import { Article } from "./article";

export const revalidate = 60;
export default async function ProjectsPage() {
  const featured = allProjects.find((project) => project.slug === "gith")!;
  const top2 = allProjects.find(
    (project) => project.slug === "nextjs-auth-template",
  )!;
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
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime(),
    );

  return (
    <div className="relative w-full h-full max-h-full p-6 max-w-384 mx-auto">
      <div className="space-y-8 md:space-y-16 pr-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:mt-8">
          <Link
            href={`/projects/${featured.slug}`}
            className="hover:no-underline group bg-mantle text-text border-2 border-teal rounded-2xl"
          >
            <div className="relative w-full h-full p-4 md:p-8">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs duration-300 text-text">
                  {featured.date ? (
                    <time dateTime={new Date(featured.date).toISOString()}>
                      {Intl.DateTimeFormat(undefined, {
                        dateStyle: "medium",
                      }).format(new Date(featured.date))}
                    </time>
                  ) : (
                    <span>SOON</span>
                  )}
                </div>
              </div>

              {featured.appLogo ? (
                <div className="flex flex-row items-center justify-between gap-0 mt-4">
                  <div className="flex flex-row items-center justify-start w-full gap-4">
                    <h2
                      id="featured-post"
                      className="text-3xl duration-300 font-bold text-hover sm:text-4xl font-plex text-nowrap w-fit"
                    >
                      {featured.title}
                    </h2>
                    <div className="h-[2px] w-0 bg-linear-to-r from-teal/0 to-transparent group-hover:w-full group-hover:to-teal duration-700" />
                  </div>
                  <div className="rounded-full ring-2 ring-mantle shrink-0 group-hover:ring-teal shadow-md shadow-crust group-hover:shadow-text duration-150 delay-300 ring-offset-2 ring-offset-crust">
                    <Image
                      width={44}
                      height={44}
                      alt={`${featured.title} logo`}
                      src={featured.appLogo}
                      className="rounded-full object-cover w-12 h-12"
                    />
                  </div>
                </div>
              ) : (
                <h2
                  id="featured-post"
                  className="mt-4 text-3xl duration-300 font-bold text-hover sm:text-4xl font-plex"
                >
                  {featured.title}
                </h2>
              )}
              <p className="mt-4 leading-8 duration-300 font-bold font-plex text-text group-hover:text-hover">
                {featured.description}
              </p>
              <div className="absolute bottom-4 md:bottom-8">
                <p className="hidden text-violet duration-300 lg:block">
                  Read more <span aria-hidden="true">&rarr;</span>
                </p>
              </div>
            </div>
          </Link>

          <div className="flex flex-col w-full gap-8 mx-auto lg:mx-0">
            {[top2, top3].map((project) => (
              <Article key={project.slug} project={project} />
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-linear-to-l from-black/0 via-black to-black/0" />

        <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
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
