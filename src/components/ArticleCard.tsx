import Link from "next/link";

import { LinkedPostImage } from "@/components/PostImage";
import type { WpPost } from "@/lib/types";
import {
  categoryPath,
  decodeHtml,
  excerptText,
  formatDate,
  getFeaturedImage,
  getPostCategories,
  postPath,
} from "@/lib/utils";

type ArticleCardProps = {
  post: WpPost;
  featured?: boolean;
};

export function ArticleCard({ post, featured = false }: ArticleCardProps) {
  const title = decodeHtml(post.title.rendered);
  const href = postPath(post.slug);
  const image = getFeaturedImage(post);
  const categories = getPostCategories(post);

  return (
    <article className={featured ? "article-card article-card-featured" : "article-card"}>
      <LinkedPostImage
        href={href}
        image={image}
        title={title}
        className={featured ? "article-card-media featured" : "article-card-media"}
        sizes={
          featured
            ? "(max-width: 768px) 100vw, 60vw"
            : "(max-width: 768px) 100vw, 33vw"
        }
      />

      <div className="article-card-body">
        {categories.length > 0 ? (
          <ul className="meta-pills" aria-label="Categories">
            {categories.slice(0, 2).map((category) => (
              <li key={category.id}>
                <Link href={categoryPath(category.slug)} className="meta-pill">
                  <span dir="auto">{decodeHtml(category.name)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        <h2 className="article-card-title">
          <Link href={href} dir="auto">
            {title}
          </Link>
        </h2>

        <p className="article-card-excerpt" dir="auto">
          {excerptText(post, featured ? 220 : 140)}
        </p>

        <time className="article-card-date" dateTime={post.date}>
          {formatDate(post.date)}
        </time>
      </div>
    </article>
  );
}
