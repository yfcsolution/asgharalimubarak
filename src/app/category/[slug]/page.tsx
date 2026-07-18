import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/ArticleCard";
import { Pagination } from "@/components/Pagination";
import { decodeHtml } from "@/lib/utils";
import { getCategories, getCategoryBySlug, getPosts } from "@/lib/wordpress";

export const revalidate = 60;

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateStaticParams() {
  const categories = await getCategories();
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
  const { posts, totalPages } = await getPosts({
    page,
    categories: category.id,
  });
  const name = decodeHtml(category.name);

  return (
    <div className="page-wrap section">
      <header className="page-hero">
        <h1 dir="auto">{name}</h1>
        <p dir="auto">
          {category.description ||
            `Published stories filed under ${name}.`}
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
  );
}
