import type { Article as ArticleType } from "contentlayer/generated";
import Link from "next/link";
import readingTime from "reading-time";
import { HoverItalic } from "@/components/hover-italic";
import { formatDate } from "@/lib/format-date";

type Props = {
  article: ArticleType;
};

// One full-width row: title and description on the left, date and reading
// time on the right (below on small screens).
export const Article: React.FC<Props> = ({ article }) => {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group w-full bg-mantle text-text rounded-xl px-7 py-5 hover:no-underline"
    >
      <article className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
        <div>
          <h2 className="text-2xl font-medium font-fraunces">
            <HoverItalic>{article.title}</HoverItalic>
          </h2>
          <p className="mt-1 text-lg font-[350] font-fraunces text-subtext">
            {article.description}
          </p>
        </div>
        <div className="shrink-0 flex gap-x-3 text-xs text-subtext sm:flex-col sm:items-end sm:gap-y-1 sm:pt-2">
          {article.date ? (
            <time dateTime={article.date.slice(0, 10)}>
              {formatDate(article.date)}
            </time>
          ) : (
            <span>soon</span>
          )}
          <span>{readingTime(`${article.body.code}`).text}</span>
        </div>
      </article>
    </Link>
  );
};
