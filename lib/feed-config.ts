export const FEED_CONFIG = {
  title: "a3chron's Blog",
  description: "Latest articles from a3chron",
  id: "https://a3chron.vercel.app/",
  link: "https://a3chron.vercel.app/",
  language: "en",
  image: "https://a3chron.vercel.app/favicon.ico",
  favicon: "https://a3chron.vercel.app/favicon.ico",
  copyright: `All rights reserved ${new Date().getFullYear()}, Kurt Schambach`,
  updated: new Date(),
  generator: "Next.js using Feed for Node.js",
  feedLinks: {
    rss2: "https://a3chron.vercel.app/feed.xml",
    atom1: "https://a3chron.vercel.app/atom.xml",
    json1: "https://a3chron.vercel.app/feed.json",
  },
  author: {
    name: "Kurt Schambach",
    email: "kurt.schambach@gmail.com",
    link: "https://a3chron.vercel.app/",
  },
} as const;

// Helper function to get the full URL for an article
export function getArticleUrl(slug: string): string {
  return `https://a3chron.vercel.app/blog/${slug}`;
}
