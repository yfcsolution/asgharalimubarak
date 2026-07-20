import Link from "next/link";

import { ArticleCard } from "@/components/ArticleCard";
import type { WpCategory, WpPost } from "@/lib/types";
import { categoryPath } from "@/lib/utils";

type CategoryNewsSectionProps = {
  category: WpCategory;
  posts: WpPost[];
};

export function CategoryNewsSection({ category, posts }: CategoryNewsSectionProps) {
  if (posts.length === 0) return null;

  return (
    <section className="section" aria-labelledby={`category-${category.id}-heading`}>
      <div className="section-heading">
        <div>
          <h2 id={`category-${category.id}-heading`} dir="auto">
            {category.name}
          </h2>
          <p>Latest coverage in {category.name}.</p>
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
