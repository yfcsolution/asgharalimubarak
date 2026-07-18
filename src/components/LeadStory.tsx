import Link from "next/link";

import { LinkedPostImage } from "@/components/PostImage";
import { getPostAuthor } from "@/lib/author";
import type { WpPost } from "@/lib/types";
import {
  categoryPath,
  displayTitleForPost,
  formatDate,
  getDisplayExcerpt,
  getPostCategories,
  getPostImage,
  postPath,
  stripHtml,
} from "@/lib/utils";

export function LeadStory({ post }: { post: WpPost }) {
  const title = displayTitleForPost(post);
  const excerpt = getDisplayExcerpt(
    stripHtml(post.excerpt?.rendered || ""),
    "auto",
    210,
  );
  const href = postPath(post.slug);
  const image = getPostImage(post);
  const categories = getPostCategories(post).filter(
    (category) => category.slug !== "uncategorized",
  );
  const author = getPostAuthor(post);

  return (
    <section className="lead-story" aria-labelledby="lead-story-title">
      <div className="lead-story-media">
        <LinkedPostImage
          href={href}
          image={image}
          title={title.text}
          priority
          className="lead-story-image"
          sizes="(max-width: 900px) 100vw, 60vw"
        />
      </div>

      <div className="lead-story-content">
        <p className="lead-kicker">
          {categories[0] ? (
            <Link href={categoryPath(categories[0].slug)} dir="auto">
              {categories[0].name}
            </Link>
          ) : (
            <span>Top Story</span>
          )}
        </p>

        <h1 id="lead-story-title" className="lead-title">
          <Link
            href={href}
            dir={title.dir}
            lang={title.lang}
            title={title.fullText}
          >
            {title.text}
          </Link>
        </h1>

        <span className="sr-only">{title.fullText}</span>

        <p className="lead-excerpt" dir={excerpt.dir} lang={excerpt.lang}>
          {excerpt.text}
        </p>

        <div className="lead-meta">
          {author?.name ? <span>By {author.name}</span> : null}
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>

        <Link href={href} className="btn-primary">
          Read full story
        </Link>
      </div>
    </section>
  );
}
