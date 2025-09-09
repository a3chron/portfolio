import { generateFeeds } from "@/lib/generate-feeds";

export async function GET() {
  const feed = generateFeeds();

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
