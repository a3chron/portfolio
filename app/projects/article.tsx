import type { Project } from "contentlayer/generated";
import Link from "next/link";
import Image from "next/image";
import { CircleDotIcon, GitForkIcon, StarIcon } from "lucide-react";

type Props = {
  project: Project;
};

export const Article: React.FC<Props> = ({ project }) => {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="hover:no-underline w-full min-h-52 bg-mantle text-text border border-teal/20 hover:border-teal/40 duration-500 group overflow-hidden"
    >
      <article className="flex justify-between h-full">
        <div className="flex flex-col w-full">
          <div className="flex justify-between gap-2 items-center p-2 px-4 md:px-8 border-b border-b-teal/20 text-xs text-text">
            {project.date ? (
              <time dateTime={new Date(project.date).toISOString()}>
                {Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
                  new Date(project.date),
                )}
              </time>
            ) : (
              <span>PLANNED</span>
            )}
            {project.archived && (
              <time
                dateTime={new Date(project.archived).toISOString()}
                className="text-accent"
              >
                archived on{" "}
                {Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
                  new Date(project.archived),
                )}
              </time>
            )}
            {project.active && <span className="text-teal">active</span>}
          </div>
          <div className="p-4 md:px-8">
            {project.appLogo ? (
              <div className="flex flex-row items-center justify-between gap-0">
                <div className="flex flex-row items-center justify-start w-full gap-4">
                  <h2 className="z-20 text-xl font-medium duration-300 lg:text-3xl no-wrap min-w-max text-hover font-display">
                    {project.title}
                  </h2>
                  <div className="h-[2px] w-0 bg-linear-to-r from-teal/0 to-transparent group-hover:w-full group-hover:to-teal/20 duration-700" />
                </div>
                <div className="rounded-full h-fit w-fit ring-2 ring-mantle group-hover:ring-teal/20 shadow-md shadow-crust group-hover:shadow-teal/20 duration-150 delay-150 ring-offset-2 ring-offset-crust">
                  <Image
                    width={36}
                    height={36}
                    alt={`${project.title} logo`}
                    src={project.appLogo}
                    className="rounded-full object-scale-down"
                  />
                </div>
              </div>
            ) : (
              <h2 className="z-20 text-xl font-medium duration-300 lg:text-3xl text-hover font-display">
                {project.title}
              </h2>
            )}
            <p className="z-20 mt-4 text-sm duration-300 text-text group-hover:text-hover">
              {project.description}
            </p>
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
  );
};
