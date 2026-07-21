import type { Metadata } from "next";

import { ArticleCard } from "@/components/ArticleCard";
import { NewsSidebar } from "@/components/news-sidebar";
import { Pagination } from "@/components/Pagination";
import { SnapshotNotice } from "@/components/SnapshotNotice";
import { getPosts, getNavCategories, getTags } from "@/lib/wordpress";

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

  const [{ posts, totalPages, fromSnapshot, snapshotMessage }, categories, tags, sidebarLatest] =
    await Promise.all([
      getPosts({ page, mode: "light" }),
      getNavCategories(),
      getTags(10),
      getPosts({ page: 1, perPage: 5, mode: "light" }),
    ]);

  return (
    <div className="page-shell content-with-sidebar">
      <div className="main-column">
        <header className="page-hero">
          <h1>Latest News</h1>
          <p lang="ur" dir="rtl">
            تازہ ترین انگریزی و اردو خبریں
          </p>
          <p>Every published report from the newsroom, newest first.</p>
        </header>

        {fromSnapshot ? <SnapshotNotice message={snapshotMessage} /> : null}

        {posts.length > 0 ? (
          <div className="article-grid three-col">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="empty-state">No published posts are available right now.</p>
        )}

        <Pagination currentPage={page} totalPages={totalPages} basePath="/latest" />
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
