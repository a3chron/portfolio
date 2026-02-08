import type { Article } from "contentlayer/generated";

export function getSortedArticlesbyDate(articles: Article[]) {
  const sortedArticles = articles.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (a.date && !b.date) {
      return -1;
    } else if (!a.date && b.date) {
      return 1;
    } else {
      return 0;
    }
  });
  return sortedArticles;
}

export function cn(...inputs: (string | undefined)[]): string {
  return inputs.filter(Boolean).join(" ");
}
