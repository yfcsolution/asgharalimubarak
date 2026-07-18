import Image from "next/image";
import Link from "next/link";

import { getSiteAuthor, resolveAuthorPhoto } from "@/lib/author";
import { SITE_NAME } from "@/lib/site";
import type { WpCategory, WpPost, WpTag } from "@/lib/types";
import {
  categoryPath,
  displayTitleForPost,
  formatCompactDate,
  getPostImage,
  postPath,
} from "@/lib/utils";

type NewsSidebarProps = {
  latest: WpPost[];
  categories: WpCategory[];
  tags?: WpTag[];
  picks: WpPost[];
};

export async function NewsSidebar({
  latest,
  categories,
  tags = [],
  picks,
}: NewsSidebarProps) {
  const author = await getSiteAuthor();
  const photo = resolveAuthorPhoto(author);

  return (
    <aside className="news-sidebar" aria-label="Sidebar">
      <section className="sidebar-block">
        <h2 className="sidebar-heading">Latest News</h2>
        <ul className="sidebar-list">
          {latest.map((post) => {
            const title = displayTitleForPost(post);
            const image = getPostImage(post);
            return (
              <li key={post.id} className="sidebar-item">
                <Link href={postPath(post.slug)} className="sidebar-thumb-link">
                  {image ? (
                    <span className="sidebar-thumb">
                      <Image
                        src={image.src}
                        alt={image.alt || title.text}
                        width={72}
                        height={54}
                        className="object-cover"
                      />
                    </span>
                  ) : (
                    <span className="sidebar-thumb sidebar-thumb-fallback" aria-hidden="true">
                      AAM
                    </span>
                  )}
                </Link>
                <div className="sidebar-item-copy">
                  <Link
                    href={postPath(post.slug)}
                    className="sidebar-item-title"
                    dir={title.dir}
                    lang={title.lang}
                    title={title.fullText}
                  >
                    {title.text}
                  </Link>
                  <time dateTime={post.date}>{formatCompactDate(post.date)}</time>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {categories.length > 0 ? (
        <section className="sidebar-block">
          <h2 className="sidebar-heading">Categories</h2>
          <ul className="sidebar-categories">
            {categories.map((category) => (
              <li key={category.id}>
                <Link href={categoryPath(category.slug)} dir="auto">
                  <span>{category.name}</span>
                  <span>{category.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : tags.length > 0 ? (
        <section className="sidebar-block">
          <h2 className="sidebar-heading">Topics</h2>
          <ul className="sidebar-categories">
            {tags.slice(0, 10).map((tag) => (
              <li key={tag.id}>
                <Link href={`/search?q=${encodeURIComponent(tag.name)}`} dir="auto">
                  <span>{tag.name}</span>
                  <span>{tag.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="sidebar-block">
        <h2 className="sidebar-heading">Editor&apos;s Picks</h2>
        <ul className="sidebar-list">
          {picks.map((post) => {
            const title = displayTitleForPost(post);
            return (
              <li key={post.id} className="sidebar-pick">
                <Link
                  href={postPath(post.slug)}
                  dir={title.dir}
                  lang={title.lang}
                  title={title.fullText}
                >
                  {title.text}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="sidebar-block about-author-card">
        <h2 className="sidebar-heading">About the Author</h2>
        <div className="about-author-body">
          {photo ? (
            <Image
              src={photo.src}
              alt={photo.alt}
              width={64}
              height={64}
              className="author-photo author-photo-sm"
            />
          ) : null}
          <div>
            <p className="about-author-name">{author.name || SITE_NAME}</p>
            <p className="about-author-bio">{author.shortBio}</p>
            <Link href="/about" className="section-link">
              Read full profile
            </Link>
          </div>
        </div>
      </section>
    </aside>
  );
}
