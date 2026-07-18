import type { Metadata } from "next";

import { ArticleCard } from "@/components/ArticleCard";
import { NewsSidebar } from "@/components/news-sidebar";
import { getNavCategories, getPosts, getTags } from "@/lib/wordpress";

export const revalidate = 60;

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim();
  return {
    title: query ? `Search: ${query}` : "Search",
    description: "Search published English and Urdu news reports.",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const [{ posts }, categories, tags, sidebarLatest] = await Promise.all([
    query
      ? getPosts({ page: 1, perPage: 12, search: query })
      : Promise.resolve({ posts: [], total: 0, totalPages: 0, page: 1, perPage: 12 }),
    getNavCategories(),
    getTags(10),
    getPosts({ page: 1, perPage: 5 }),
  ]);

  return (
    <div className="page-shell content-with-sidebar">
      <div className="main-column">
        <header className="page-hero">
          <h1>Search</h1>
          <p>
            {query
              ? `Results for “${query}”.`
              : "Enter a keyword to search published reports."}
          </p>
          <form className="masthead-search page-search" action="/search" method="get">
            <label className="sr-only" htmlFor="search-page-q">
              Search articles
            </label>
            <input
              id="search-page-q"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Search news"
            />
            <button type="submit">Search</button>
          </form>
        </header>

        {query && posts.length === 0 ? (
          <p>No published posts matched that search.</p>
        ) : null}

        {posts.length > 0 ? (
          <div className="article-grid three-col">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        ) : null}
      </div>

      <NewsSidebar
        latest={sidebarLatest.posts}
        categories={categories}
        tags={tags}
        picks={sidebarLatest.posts}
      />
    </div>
  );
}
