import { Article, allArticles } from "contentlayer/generated";
import Link from "next/link";
import { Block } from "../block";
import { getSortedArticlesbyDate } from "@/util/utils";
import { Calendar } from "lucide-react";

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
    <Block className="bg-sapphire selection:text-sapphire">
      <div className="w-dvw 2xl:w-384 h-fit min-h-dvh p-4 md:py-12 md:px-24 flex flex-col item-center justify-center">
        <h1 className="uppercase text-4xl md:text-6xl text-sapphire bg-crust my-6 md:mb-16 w-fit p-1 px-2">
          #3 Blog
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="col-span-2">
            <h1 className="text-2xl md:text-4xl font-bold gap-3">
              Have a look on my{" "}
              <Link href="/blog" className="underline text-crust inline">
                Blog
              </Link>
            </h1>
            <p className="text-xl md:text-2xl font-semibold mt-12 w-full md:w-2/3">
              As I am exploring nerdy stuff, I collect some of my journey in a
              more or less readable format here. <br />I also write about Gnome
              customization, feel free to check that out.
            </p>
            <div className="mt-12 flex flex-col gap-6 max-w-4xl">
              {latestArticles.map((article) => (
                <ArticleCard
                  key={article.slug}
                  title={article.title}
                  description={
                    article.description ||
                    "Read more about this topic on my blog"
                  }
                  date={article.date}
                  slug={article.slug}
                />
              ))}
            </div>
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
            <Link
              href="/blog"
              className="mt-8 inline-block bg-crust text-sapphire py-3 px-6 rounded-lg font-bold hover:bg-opacity-90 transition-colors"
            >
              View All Articles
            </Link>
          </div>
        </div>
      </div>
    </Block>
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
      className="bg-crust p-6 rounded-lg hover:shadow-lg transition-all"
    >
      <h3 className="text-xl font-bold text-sapphire">{title}</h3>
      <p className="text-subtext mt-2 line-clamp-2">{description}</p>
      {date && (
        <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
          <Calendar size={14} />
          <span>{new Date(date).toLocaleDateString()}</span>
        </div>
      )}
    </Link>
  );
}

function CategoryTag({ name, count }: { name: string; count: number }) {
  return (
    <div className="flex items-center justify-between bg-bg text-text rounded-lg p-px h-10">
      <span className="font-semibold p-2 text-sapphire">{name}</span>
      <span className="bg-sapphire text-crust w-fit px-3 h-full text-sm rounded-r-md flex items-center justify-center">
        {count}
      </span>
    </div>
  );
}

export default BlogSection;
