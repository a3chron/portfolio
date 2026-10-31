import { type Article, allArticles } from "contentlayer/generated";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { HoverItalic } from "@/components/hover-italic";
import { formatDate } from "@/lib/format-date";
import { getSortedArticlesbyDate } from "@/util/utils";
import { Section } from "./section";

function getTwoLatestArticles(articles: Article[]): Article[] {
  const sortedArticles = getSortedArticlesbyDate(articles);
  return sortedArticles.slice(0, 2);
}

const BlogSection = () => {
  const latestArticles = getTwoLatestArticles(
    allArticles.filter((art) => art.published),
  );

  const categoriesRaw = new Map<string, number>();

  allArticles
    .filter((article) => article.published)
    .forEach((article) => {
      if (
        categoriesRaw.has(article.topic) ||
        categoriesRaw.get(article.topic) !== undefined
      ) {
        categoriesRaw.set(article.topic, categoriesRaw.get(article.topic) ?? 2); // TODO: not working
      } else {
        categoriesRaw.set(article.topic, 1);
      }
    });

  const categories: { name: string; count: number }[] = [];

  Array.from(categoriesRaw.entries()).forEach((category) => {
    categories.push({ name: category[0], count: category[1] });
  });

  return (
    <Section title="Blog">
      <p className="text-2xl md:text-4xl font-medium font-fraunces">
        Have a look on my{" "}
        <Link href="/blog" className="underline inline">
          Blog
        </Link>
      </p>
      <p className="text-xl md:text-2xl font-semibold mt-12">
        A few of my learnings regarding frameworks or programming languages I
        try out, updates to my setup, or other surely interesting topics in a
        more or less readable format.
      </p>
      <div className="mt-12 flex flex-col gap-6">
        {latestArticles.map((article) => (
          <ArticleCard
            key={article.slug}
            title={article.title}
            description={
              article.description || "Read more about this topic on my blog"
            }
            date={article.date}
            slug={article.slug}
          />
        ))}
      </div>
      <div className="hidden mt-12">
        {" "}
        {/**TODO: do sth with this, finish or remove */}
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <div className="flex flex-col gap-4">
          {categories.map((category) => (
            <CategoryTag
              key={category.name}
              name={category.name}
              count={category.count}
            />
          ))}
        </div>
      </div>
      <div className="mt-12 flex justify-center">
        <Link
          href="/blog"
          className="bg-text text-bg py-3 px-8 rounded-xl font-bold hover:no-underline"
        >
          View All Articles
        </Link>
      </div>
    </Section>
  );
};

function ArticleCard({
  title,
  description,
  date,
  slug,
}: {
  title: string;
  description: string;
  date?: string;
  slug: string;
}) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="group bg-mantle text-text p-6 rounded-xl hover:no-underline"
    >
      <h3 className="text-2xl font-medium font-fraunces">
        <HoverItalic>{title}</HoverItalic>
      </h3>
      <p className="text-subtext mt-2 line-clamp-2">{description}</p>
      {date && (
        <div className="flex items-center gap-2 mt-4 text-sm text-subtext">
          <Calendar size={14} />
          <span>{formatDate(date)}</span>
        </div>
      )}
    </Link>
  );
}

function CategoryTag({ name, count }: { name: string; count: number }) {
  return (
    <div className="flex items-center justify-between bg-mantle text-text rounded-xl p-px h-10">
      <span className="font-semibold p-2 text-sapphire">{name}</span>
      <span className="bg-sapphire text-crust w-fit px-3 h-full text-sm rounded-r-md flex items-center justify-center">
        {count}
      </span>
    </div>
  );
}

export default BlogSection;
