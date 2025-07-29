import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";
import { Mdx } from "@/components/mdx";
import "@/style/mdx.css";
import type { Metadata } from "next";
import { Header } from "./header";
export const revalidate = 60;

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;

  const project = allProjects.find((project) => project.slug === slug);

  if (project) {
    return {
      title: project.title,
    };
  }
  return {
    title: "Untitled", // should not happen
  };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return allProjects
    .filter((p) => p.published)
    .map((p) => ({
      slug: p.slug,
    }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const project = allProjects.find((project) => project.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-base text-text">
      <Header project={project} />

      <div className="group w-[80dvw] max-w-5xl h-full bg-base mx-auto mt-4">
        <article
          className={
            "px-4 py-12 md:pb-24 mx-auto text-text hover:text-hover duration-1000 text-lg font-bold prose prose-quoteless selection:text-black selection:bg-teal"
          }
        >
          <Mdx code={project.body.code} page="project" />
        </article>
      </div>
    </div>
  );
}
