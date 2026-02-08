import { allArticles } from "contentlayer/generated";
import { Feed } from "feed";
import { FEED_CONFIG, getArticleUrl } from "@/lib/feed-config";
import { markdownToHtml } from "@/lib/markdown-to-html";

export async function GET() {
  try {
    const feed = new Feed(FEED_CONFIG);

    const publishedArticles = allArticles
      .filter((article) => article.published)
      .sort((a, b) => {
        if (a.date && b.date) {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return 0;
      })
      .slice(0, 20);

    for (const article of publishedArticles) {
      const articleUrl = getArticleUrl(article.slug);

      const htmlContent = await markdownToHtml(article.body.raw);

      const contentWithAbsoluteImages = htmlContent.replace(
        /src="\/([^"]+)"/g,
        `src="${FEED_CONFIG.link}/$1"`,
      );

      feed.addItem({
        title: article.title,
        id: articleUrl,
        link: articleUrl,
        description: article.description,
        content: contentWithAbsoluteImages,
        author: [
          {
            name: FEED_CONFIG.author.name,
            email: FEED_CONFIG.author.email,
            link: FEED_CONFIG.author.link,
          },
        ],
        contributor: [],
        date: article.date ? new Date(article.date) : new Date(),
        category: [
          {
            name: article.topic,
            term: article.topic,
          },
        ],
      });
    }

    const jsonFeed = feed.json1();

    return new Response(jsonFeed, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "s-maxage=1800, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("JSON feed generation failed:", error);
    return new Response("JSON feed generation failed", { status: 500 });
  }
}
