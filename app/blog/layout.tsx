import type { Metadata } from "next";
import Navigation from "@/components/navigation";
import RSSLinks from "@/components/rss-links";

export const metadata: Metadata = {
  title: {
    template: "%s | Blog",
    default: "Blog",
  },
  description:
    "Read my latest thoughts on Ubuntu Customization and AI - technical articles, tutorials, and insights",
  openGraph: {
    title: "Blog | A3chron",
    description: "Read my latest thoughts on Ubuntu Customization and AI",
    url: "https://a3chron.dev/blog",
  },
  // Replaces the root layout's `alternates` wholesale, so the canonical has
  // to be repeated here.
  alternates: {
    canonical: "./",
    types: {
      "application/rss+xml": "https://a3chron.dev/feed.xml",
      "application/atom+xml": "https://a3chron.dev/atom.xml",
      "application/feed+json": "https://a3chron.dev/feed.json",
    },
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full h-full max-h-dvh overflow-hidden bg-bg">
      <RSSLinks />
      <div className="h-full overflow-y-auto">
        <Navigation />
        {children}
      </div>
    </div>
  );
}
