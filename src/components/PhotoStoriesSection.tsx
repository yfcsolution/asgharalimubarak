import Link from "next/link";

import { LinkedPostImage } from "@/components/PostImage";
import { SectionHeading } from "@/components/SectionHeading";
import type { WpPost } from "@/lib/types";
import {
  categoryPath,
  displayTitleForPost,
  formatPakistanCompactDate,
  getPostCategories,
  getPostImage,
  postPath,
} from "@/lib/utils";

type PhotoStoriesSectionProps = {
  posts: WpPost[];
  categorySlug?: string;
  categoryHref?: string;
};

function PhotoStoryCard({
  post,
  variant,
  priority = false,
}: {
  post: WpPost;
  variant: "feature" | "stack" | "grid";
  priority?: boolean;
}) {
  const title = displayTitleForPost(post);
  const href = postPath(post.slug);
  const image = getPostImage(post);
  const categories = getPostCategories(post).filter(
    (category) => category.slug !== "uncategorized",
  );
  const category = categories[0];

  return (
    <article className={`photo-story-card photo-story-card--${variant}`}>
      <LinkedPostImage
        href={href}
        image={image}
        title={title.text}
        priority={priority}
        className="photo-story-media"
        sizes={
          variant === "feature"
            ? "(max-width: 900px) 100vw, 50vw"
            : variant === "stack"
              ? "(max-width: 900px) 100vw, 25vw"
              : "(max-width: 900px) 100vw, 25vw"
        }
      />
      <div className="photo-story-body">
        {category ? (
          <Link href={categoryPath(category.slug)} className="photo-story-kicker">
            <span dir="auto">{category.name}</span>
          </Link>
        ) : (
          <span className="photo-story-kicker">Photo Stories</span>
        )}
        <h3 className="photo-story-title">
          <Link href={href} dir={title.dir} lang={title.lang} title={title.fullText}>
            {title.text}
          </Link>
        </h3>
        <time className="photo-story-date" dateTime={post.date}>
          {formatPakistanCompactDate(post.date)}
        </time>
      </div>
    </article>
  );
}

/**
 * Visual-led Photo Stories mosaic for the homepage.
 * Uses real WordPress photography only (via getPostImage).
 */
export function PhotoStoriesSection({
  posts,
  categorySlug = "photo-stories",
  categoryHref,
}: PhotoStoriesSectionProps) {
  const withImages = posts.filter((post) => Boolean(getPostImage(post)));
  if (withImages.length === 0) return null;

  const [feature, second, third, ...rest] = withImages;
  const stack = [second, third].filter(Boolean) as WpPost[];
  const grid = rest.slice(0, 4);
  const href = categoryHref ?? categoryPath(categorySlug);

  return (
    <section className="section photo-stories-section" aria-labelledby="photo-stories-heading">
      <SectionHeading
        title="Photo Stories"
        titleId="photo-stories-heading"
        description="تصویری خبریں — visual reporting from the newsroom."
        href={href}
        linkLabel="View all photo stories"
      />

      <div className="photo-stories-layout">
        {feature ? (
          <div className="photo-stories-feature">
            <PhotoStoryCard post={feature} variant="feature" priority={false} />
          </div>
        ) : null}

        {stack.length > 0 ? (
          <div className="photo-stories-stack">
            {stack.map((post) => (
              <PhotoStoryCard key={post.id} post={post} variant="stack" />
            ))}
          </div>
        ) : null}
      </div>

      {grid.length > 0 ? (
        <div className="photo-stories-grid">
          {grid.map((post) => (
            <PhotoStoryCard key={post.id} post={post} variant="grid" />
          ))}
        </div>
      ) : null}
    </section>
  );
}
