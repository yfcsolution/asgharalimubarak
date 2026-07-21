import { ArticleCard } from "@/components/ArticleCard";
import { SectionHeading } from "@/components/SectionHeading";
import type { WpCategory, WpPost } from "@/lib/types";
import { categoryPath, decodeHtml } from "@/lib/utils";

type CategoryNewsSectionProps = {
  category: WpCategory;
  posts: WpPost[];
};

export function CategoryNewsSection({ category, posts }: CategoryNewsSectionProps) {
  if (posts.length === 0) return null;

  const name = decodeHtml(category.name);

  return (
    <section className="section category-section" aria-labelledby={`category-${category.id}-heading`}>
      <SectionHeading
        title={name}
        titleId={`category-${category.id}-heading`}
        description={`Latest coverage in ${name}.`}
        href={categoryPath(category.slug)}
      />
      <div className="article-grid three-col">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
