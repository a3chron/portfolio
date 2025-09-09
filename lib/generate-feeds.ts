import { Feed } from "feed";
import { allArticles } from "contentlayer/generated";
import { FEED_CONFIG, getArticleUrl } from "./feed-config";

export function generateFeeds() {
  const feed = new Feed(FEED_CONFIG);

  // Filter and sort published articles
  const publishedArticles = allArticles
    .filter((article) => article.published)
    .sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    })
    .slice(0, 20);

  // Add articles to feed
  publishedArticles.forEach((article) => {
    const articleUrl = getArticleUrl(article.slug);

    feed.addItem({
      title: article.title,
      id: articleUrl,
      link: articleUrl,
      description: article.description,
      content: article.body.raw,
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
  });

  return feed;
}
