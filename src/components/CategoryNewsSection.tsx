import Link from "next/link";

import { ArticleCard } from "@/components/ArticleCard";
import { getCategoryAccent } from "@/lib/category-config";
import type { WpCategory, WpPost } from "@/lib/types";
import { categoryPath, decodeHtml } from "@/lib/utils";

type CategoryNewsSectionProps = {
  category: WpCategory;
  posts: WpPost[];
};

export function CategoryNewsSection({ category, posts }: CategoryNewsSectionProps) {
  if (posts.length === 0) return null;

  const name = decodeHtml(category.name);
  const accent = getCategoryAccent(category);

  return (
    <section
      className={`section category-section category-accent-${accent}`}
      aria-labelledby={`category-${category.id}-heading`}
    >
      <div className="section-heading">
        <div>
          <p className="category-section-label">Section</p>
          <h2 id={`category-${category.id}-heading`} dir="auto">
            {name}
          </h2>
          <p>Latest coverage in {name}.</p>
        </div>
        <Link href={categoryPath(category.slug)} className="section-link" dir="auto">
          View all
        </Link>
      </div>
      <div className="article-grid three-col">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
