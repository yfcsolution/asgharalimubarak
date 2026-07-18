import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/ArticleCard";
import { NewsSidebar } from "@/components/news-sidebar";
import { Pagination } from "@/components/Pagination";
import { decodeHtml } from "@/lib/utils";
import {
  getCategoryBySlug,
  getNavCategories,
  getPosts,
  getTags,
} from "@/lib/wordpress";

export const revalidate = 60;

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateStaticParams() {
  const categories = await getNavCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category not found" };
  }

  const name = decodeHtml(category.name);
  return {
    title: `${name} news`,
    description:
      category.description ||
      `Latest published reports in the ${name} category.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const page = Math.max(1, Number(pageParam) || 1);
  const [{ posts, totalPages }, categories, tags, sidebarLatest] =
    await Promise.all([
      getPosts({ page, categories: category.id }),
      getNavCategories(),
      getTags(10),
      getPosts({ page: 1, perPage: 5 }),
    ]);
  const name = decodeHtml(category.name);

  return (
    <div className="page-shell content-with-sidebar">
      <div className="main-column">
        <header className="page-hero">
          <h1 dir="auto">{name}</h1>
          <p dir="auto">
            {category.description || `Published stories filed under ${name}.`}
          </p>
        </header>

        {posts.length > 0 ? (
          <div className="article-grid three-col">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p>No published posts in this category yet.</p>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath={`/category/${encodeURIComponent(slug)}`}
        />
      </div>

      <NewsSidebar
        latest={sidebarLatest.posts}
        categories={categories}
        tags={tags}
        picks={posts.slice(0, 5)}
      />
    </div>
  );
}
