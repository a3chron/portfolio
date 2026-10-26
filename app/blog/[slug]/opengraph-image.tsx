import { allArticles } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { OG_CONTENT_TYPE, OG_SIZE, renderArticleOgImage } from "@/lib/og-image";

export const alt = "a3chron blog article";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = allArticles.find((article) => article.slug === slug);
  if (!article) notFound();

  return renderArticleOgImage({
    title: article.title,
    description: article.description,
    topic: article.topic,
    date: article.date,
  });
}

// Rendered at build time, like the articles themselves.
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return allArticles
    .filter((article) => article.published)
    .map((article) => ({ slug: article.slug }));
}
