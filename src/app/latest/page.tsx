import type { Metadata } from "next";

import { ArticleCard } from "@/components/ArticleCard";
import { Pagination } from "@/components/Pagination";
import { getPosts } from "@/lib/wordpress";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Latest News",
  description:
    "The latest English and Urdu reports published by Asghar Ali Mubarak.",
};

type LatestPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function LatestPage({ searchParams }: LatestPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { posts, totalPages } = await getPosts({ page });

  return (
    <div className="page-wrap section">
      <header className="page-hero">
        <h1>Latest News</h1>
        <p lang="ur" dir="rtl">
          تازہ ترین انگریزی و اردو خبریں
        </p>
        <p>Every published report from the newsroom, newest first.</p>
      </header>

      <div className="article-grid three-col">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} basePath="/latest" />
    </div>
  );
}
