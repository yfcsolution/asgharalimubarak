import Link from "next/link";

import { LinkedPostImage } from "@/components/PostImage";
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

type ArticleCardProps = {
  post: WpPost;
  featured?: boolean;
  priority?: boolean;
};

export function ArticleCard({
  post,
  featured = false,
  priority = false,
}: ArticleCardProps) {
  const title = displayTitleForPost(post);
  const excerpt = getDisplayExcerpt(
    stripHtml(post.excerpt?.rendered || ""),
    "auto",
    featured ? 180 : 120,
  );
  const href = postPath(post.slug);
  const image = getPostImage(post);
  const categories = getPostCategories(post).filter(
    (category) => category.slug !== "uncategorized",
  );

  return (
    <article className={featured ? "article-card article-card-featured" : "article-card"}>
      <LinkedPostImage
        href={href}
        image={image}
        title={title.text}
        priority={priority}
        className={featured ? "article-card-media featured" : "article-card-media"}
        sizes={
          featured
            ? "(max-width: 900px) 100vw, 50vw"
            : "(max-width: 768px) 100vw, 33vw"
        }
      />

      <div className="article-card-body">
        {categories.length > 0 ? (
          <ul className="meta-pills" aria-label="Categories">
            {categories.slice(0, 2).map((category) => (
              <li key={category.id}>
                <Link href={categoryPath(category.slug)} className="meta-pill">
                  <span dir="auto">{category.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="meta-pill static-label">News</p>
        )}

        <h2 className="article-card-title">
          <Link
            href={href}
            dir={title.dir}
            lang={title.lang}
            title={title.fullText}
          >
            {title.text}
          </Link>
        </h2>

        <p
          className="article-card-excerpt"
          dir={excerpt.dir}
          lang={excerpt.lang}
        >
          {excerpt.text}
        </p>

        <time className="article-card-date" dateTime={post.date}>
          {formatDate(post.date)}
        </time>
      </div>
    </article>
  );
}
