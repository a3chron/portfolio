import type { Article as ArticleType } from "contentlayer/generated";
import Link from "next/link";

type Props = {
  article: ArticleType;
};

import readingTime from "reading-time";

const ColorHeader: React.FC<{ children: React.ReactNode; topic: string }> = ({
  children,
  topic,
}) => {
  switch (topic) {
    case "Customization": {
      return (
        <div className="flex flex-row items-center justify-between h-14 w-full bg-crust text-text border-b-2 border-sapphire rounded-t-xl px-8">
          {children}
        </div>
      );
    }
    case "AI": {
      return (
        <div className="flex flex-row items-center justify-between h-14 w-full bg-crust text-text border-b-2 border-overlay rounded-t-xl px-4 md:px-8">
          {children}
        </div>
      );
    }
    default: {
      return (
        <div className="flex flex-row items-center justify-between h-14 w-full bg-crust text-text border-b-2 border-subtext rounded-t-xl px-8">
          {children}
        </div>
      );
    }
  }
};

export const Article: React.FC<Props> = ({ article }) => {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group w-full sm:w-[396px] h-fit sm:h-72 bg-mantle rounded-2xl hover:no-underline"
    >
      <article className="h-fit sm:h-72 w-full">
        <ColorHeader topic={article.topic}>
          <span className="text-xs duration-300 text-inherit">
            {article.date ? (
              <time dateTime={new Date(article.date).toISOString()}>
                {Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
                  new Date(article.date),
                )}
              </time>
            ) : (
              <span>SOON</span>
            )}
          </span>
          <span className="hidden sm:block text-xs duration-300 group-hover:bg-sapphire group-hover:text-black rounded-md p-1 px-3">
            {readingTime(`${article.body.code}`).text}
          </span>
          <span className="block sm:hidden text-xs duration-300 group-hover:bg-sapphire group-hover:text-black rounded-md p-1 px-3">
            {readingTime(`${article.body.code}`).minutes}m
          </span>
        </ColorHeader>
        <div className="p-8 border-2 border-t-0 border-mantle h-fit sm:h-56 rounded-b-2xl">
          <h2 className="z-20 text-xl font-medium duration-300 lg:text-3xl text-text font-display">
            {article.title}
          </h2>
          <p className="z-20 mt-4 font-bold duration-300 text-subtext block">
            {article.description}
          </p>
        </div>
      </article>
    </Link>
  );
};
