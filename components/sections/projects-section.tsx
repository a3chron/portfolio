import { allProjects } from "contentlayer/generated";
import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { Section } from "./section";

const ProjectsSection = () => {
  const featuredProjects = ["kaeru-kitchen", "stellar", "portfolio"]
    .map((slug) => allProjects.find((project) => project.slug === slug))
    .filter((project) => project !== undefined);

  return (
    <Section title="Projects">
      <p className="text-2xl md:text-4xl font-medium font-fraunces">
        Check out my{" "}
        <Link href="/projects" className="underline">
          Projects
        </Link>
      </p>
      <p className="text-xl md:text-2xl font-semibold mt-12">
        I have several little projects, few of which are not work in progress,
        but nevertheless worth a look:
      </p>
      <div className="mt-12 flex flex-col gap-6">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <Link
          href="/projects"
          className="bg-text text-bg py-3 px-8 rounded-xl font-bold hover:no-underline"
        >
          View All Projects
        </Link>
      </div>
    </Section>
  );
};

export default ProjectsSection;
