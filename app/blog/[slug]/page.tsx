import { notFound } from "next/navigation";
import { allArticles } from "contentlayer/generated";
import { Mdx } from "@/components/mdx";
import "@/style/mdx.css";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FullScreenSwitch from "@/components/fullscreen-switch";
import ThumbsUpDown from "@/components/thumbs-up-down";
import { Metadata } from "next";

export const revalidate = 60;

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = allArticles.find((article) => article.slug === slug);

  if (!article) {
    return {};
  }

  return {
    title: article.title,
    description: article.description,
    keywords: [...article.topic.split(" "), "blog", "article"],
    authors: [{ name: "Kurt Schambach" }],
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      url: `https://a3chron.vercel.app/blog/${article.slug}`,
      publishedTime: article.date,
      authors: ["Kurt Schambach"],
      section: article.topic,
      images: [
        {
          url: "/https://a3chron.vercel.app/a3chron.png",
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
  };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return allArticles
    .filter((p) => p.published)
    .map((p) => ({
      slug: p.slug,
    }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = allArticles.find((article) => article.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="w-full h-[calc(100dvh-6rem)] bg-bg flex flex-col">
      <div className="sticky top-0 z-10 w-full h-16 flex flex-row items-center justify-start gap-4 md:gap-8 bg-crust text-text text-xl font-bold px-8">
        <Link
          href="/blog"
          className="flex flex-row gap-2 items-center justify-center text-text hover:text-hover duration-500"
        >
          <ArrowLeft />
          Blog
        </Link>
        <span className="hidden sm:block cursor-default text-text">
          {article.title}
        </span>
      </div>
      <div className="h-full w-full overflow-y-scroll p-4 bg-mantle relative">
        <div className="group w-[85dvw] max-w-5xl ml-auto md:mx-auto h-full">
          <div className="lg:absolute top-16 right-6 sm:pl-4">
            <FullScreenSwitch />
          </div>
          <article
            className={
              "sm:px-4 py-12 mx-auto text-text text-lg font-bold bg-inherit prose sm:prose-quoteless selection:text-black selection:bg-sapphire"
            }
          >
            {!article.published && (
              <div className="bg-warning/10 border-2 border-warning text-warning selection:bg-warning w-full h-fit p-6 flex flex-col items-center justify-center rounded-lg text-center mb-12">
                <h3 className="text-warning mt-0">
                  This article is not yet published
                </h3>
                <span className="text-sm">
                  It may be incomplete, contain an inhumane amount of spelling
                  mistakes, and pottentially wrong information. Use at own risk.
                </span>
              </div>
            )}
            <Mdx code={article.body.code} page="blog" />
          </article>
          <div className="h-24 w-full bg-transparent flex flex-col items-center justify-center">
            <ThumbsUpDown articleSlug={article.slug} />
          </div>
        </div>
      </div>
    </div>
  );
}
