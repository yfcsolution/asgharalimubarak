import Link from "next/link";
import type { ReactNode } from "react";

import { PostImage } from "@/components/PostImage";
import { WordPressContent } from "@/components/WordPressContent";
import type { WpPost } from "@/lib/types";
import {
  categoryPath,
  decodeHtml,
  formatDate,
  getFeaturedImage,
  getPostCategories,
} from "@/lib/utils";

type ArticleLayoutProps = {
  post: WpPost;
  related?: ReactNode;
};

export function ArticleLayout({ post, related }: ArticleLayoutProps) {
  const title = decodeHtml(post.title.rendered);
  const image = getFeaturedImage(post);
  const categories = getPostCategories(post);
  const author = post._embedded?.author?.[0]?.name;

  return (
    <article className="article-layout">
      <header className="article-header">
        {categories.length > 0 ? (
          <ul className="meta-pills" aria-label="Categories">
            {categories.map((category) => (
              <li key={category.id}>
                <Link href={categoryPath(category.slug)} className="meta-pill">
                  <span dir="auto">{decodeHtml(category.name)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        <h1 className="article-title animate-fade-up" dir="auto">
          {title}
        </h1>

        <div className="article-byline animate-fade-up delay-1">
          {author ? <span>By {author}</span> : null}
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
      </header>

      <div className="article-hero-media animate-fade-up delay-2">
        <PostImage
          image={image}
          title={title}
          priority
          className="article-hero-image"
          sizes="(max-width: 900px) 100vw, 900px"
        />
      </div>

      <WordPressContent html={post.content.rendered} />

      {related}
    </article>
  );
}
