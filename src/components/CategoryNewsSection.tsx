import Link from "next/link";

import { ArticleCard } from "@/components/ArticleCard";
import { LinkedPostImage } from "@/components/PostImage";
import { SectionHeading } from "@/components/SectionHeading";
import type { WpCategory, WpPost } from "@/lib/types";
import {
  categoryPath,
  decodeHtml,
  displayTitleForPost,
  formatPakistanCompactDate,
  getDisplayExcerpt,
  getPostImage,
  postPath,
  stripHtml,
} from "@/lib/utils";

type CategoryNewsSectionProps = {
  category: WpCategory;
  posts: WpPost[];
  /** Lead + supporting layout (used for Defence during campaign) */
  variant?: "grid" | "featured";
  linkLabel?: string;
};

export function CategoryNewsSection({
  category,
  posts,
  variant = "grid",
  linkLabel,
}: CategoryNewsSectionProps) {
  if (posts.length === 0) return null;

  const name = decodeHtml(category.name);
  const href = categoryPath(category.slug);

  if (variant === "featured") {
    const [lead, ...supporting] = posts;
    const title = displayTitleForPost(lead);
    const leadHref = postPath(lead.slug);
    const image = getPostImage(lead);
    const excerpt = getDisplayExcerpt(
      stripHtml(lead.excerpt?.rendered || ""),
      "auto",
      160,
    );

    return (
      <section
        className="section category-section category-section--featured"
        aria-labelledby={`category-${category.id}-heading`}
      >
        <SectionHeading
          title={name}
          titleId={`category-${category.id}-heading`}
          description={`Latest coverage in ${name}.`}
          href={href}
          linkLabel={linkLabel ?? `View all ${name} news`}
        />
        <div className="category-featured-layout">
          <article className="category-featured-lead">
            <LinkedPostImage
              href={leadHref}
              image={image}
              title={title.text}
              className="category-featured-media"
              sizes="(max-width: 900px) 100vw, 55vw"
            />
            <div className="category-featured-body">
              <h3 className="category-featured-title">
                <Link href={leadHref} dir={title.dir} lang={title.lang}>
                  {title.text}
                </Link>
              </h3>
              {excerpt.text ? (
                <p className="category-featured-excerpt" dir={excerpt.dir} lang={excerpt.lang}>
                  {excerpt.text}
                </p>
              ) : null}
              <time dateTime={lead.date}>{formatPakistanCompactDate(lead.date)}</time>
            </div>
          </article>
          {supporting.length > 0 ? (
            <div className="category-featured-support">
              {supporting.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="section category-section" aria-labelledby={`category-${category.id}-heading`}>
      <SectionHeading
        title={name}
        titleId={`category-${category.id}-heading`}
        description={`Latest coverage in ${name}.`}
        href={href}
        linkLabel={linkLabel}
      />
      <div className="article-grid three-col">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
