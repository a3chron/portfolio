import { Metadata } from "next";
import Navigation from "@/components/navigation";

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
    url: "https://a3chron.vercel.app/blog",
  },
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "RSS Feed" }],
      "application/atom+xml": [{ url: "/atom.xml", title: "Atom Feed" }],
      "application/json": [{ url: "/feed.json", title: "Json Feed" }],
    },
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full h-full max-h-dvh overflow-hidden bg-sapphire">
      <Navigation className="bg-sapphire" />
      <div className="h-[cal(100dvh-6rem)] overflow-y-auto">{children}</div>
    </div>
  );
}
