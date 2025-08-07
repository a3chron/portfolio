import { allArticles } from "contentlayer/generated";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://a3chron.vercel.app";

  const staticPages = [
    {
      url: baseUrl,
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];

  const blogPosts = allArticles
    .filter((article) => article.published !== false)
    .map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  // TODO: generate projects too
  const projects = [
    "next-js-auth-template",
    "portfolio",
    "userstyles",
    "gith",
  ].map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...blogPosts, ...projects];
}
