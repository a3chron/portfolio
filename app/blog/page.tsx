import { allArticles } from "contentlayer/generated";
import Link from "next/link";
import { Article } from "./article";

export const revalidate = 60;

export default async function Blog() {
  const sorted = allArticles
    .filter((article) => article.published)
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
    );

  if (sorted.length !== 0) {
    return (
      <div className="w-full h-full overflow-y-scroll px-2">
        <div className="w-full h-fit">
          <div className="w-full h-full flex flex-col items-center justify-center pt-16 pb-24 md:pt-24">
            <div className="flex flex-col gap-8 w-full max-w-4xl px-4 h-full">
              {sorted.map((article) => (
                <Article key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-full overflow-y-scroll px-2">
      <div className="bg-mantle rounded-3xl w-full h-fit">
        <Link
          href="/blog"
          className="sticky w-full h-16 flex flex-col items-start justify-center bg-mantle text-text text-xl font-bold border-2 border-text cursor-pointer px-8 rounded-t-3xl"
        >
          Blog
        </Link>
        <div className="p-4 sm:p-10">
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-text text-3xl">Nothing there yet...</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
