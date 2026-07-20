import Link from "next/link";

import { RecommendButton } from "@/components/RecommendButton";
import { LinkedPostImage } from "@/components/PostImage";
import { ShareButtons } from "@/components/ShareButtons";
import { getPostAuthor } from "@/lib/author";
import { getSiteUrl } from "@/lib/site";
import type { WpPost } from "@/lib/types";
import {
  categoryPath,
  displayTitleForPost,
  formatPakistanDate,
  getDisplayExcerpt,
  getPostCategories,
  getPostImage,
  isMeaningfullyUpdated,
  postPath,
  stripHtml,
} from "@/lib/utils";

export function LeadStory({
  post,
  headingLevel = "h1",
}: {
  post: WpPost;
  headingLevel?: "h1" | "h2";
}) {
  const title = displayTitleForPost(post);
  const excerpt = getDisplayExcerpt(
    stripHtml(post.excerpt?.rendered || ""),
    "auto",
    210,
  );
  const href = postPath(post.slug);
  const shareUrl = `${getSiteUrl()}${href}`;
  const image = getPostImage(post);
  const categories = getPostCategories(post).filter(
    (category) => category.slug !== "uncategorized",
  );
  const author = getPostAuthor(post);
  const HeadingTag = headingLevel;

  return (
    <section className="lead-story" aria-labelledby="lead-story-title">
      <div className="lead-story-media">
        <LinkedPostImage
          href={href}
          image={image}
          title={title.text}
          priority
          className="lead-story-image"
          sizes="(max-width: 900px) 100vw, 48vw"
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

        <HeadingTag id="lead-story-title" className="lead-title">
          <Link
            href={href}
            dir={title.dir}
            lang={title.lang}
            title={title.fullText}
          >
            {title.text}
          </Link>
        </HeadingTag>

        <span className="sr-only">{title.fullText}</span>

        <p className="lead-excerpt" dir={excerpt.dir} lang={excerpt.lang}>
          {excerpt.text}
        </p>

        <div className="lead-meta">
          {author?.name ? <span>By {author.name}</span> : null}
          <time dateTime={post.date}>{formatPakistanDate(post.date)}</time>
          {isMeaningfullyUpdated(post.date, post.modified) ? (
            <span>
              · Updated{" "}
              <time dateTime={post.modified}>
                {formatPakistanDate(post.modified)}
              </time>
            </span>
          ) : null}
        </div>

        <div className="lead-actions">
          <Link href={href} className="btn-primary">
            Read Full Story →
          </Link>
          <ShareButtons url={shareUrl} title={title.text} variant="compact" />
          <RecommendButton postId={post.id} />
        </div>
      </div>
    </section>
  );
}
