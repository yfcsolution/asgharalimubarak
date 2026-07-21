import Image from "next/image";
import Link from "next/link";

import { SidebarAd } from "@/components/ads/SidebarAd";
import { SidebarSecondaryAd } from "@/components/ads/SidebarSecondaryAd";
import { getSiteAuthor, resolveAuthorPhoto } from "@/lib/author";
import {
  MAX_SIDEBAR_CATEGORIES,
  sortCategoriesEditorially,
} from "@/lib/category-config";
import { SITE_NAME } from "@/lib/site";
import type { WpCategory, WpPost, WpTag } from "@/lib/types";
import {
  categoryPath,
  decodeHtml,
  displayTitleForPost,
  formatCompactDate,
  getPostCategories,
  getPostImage,
  postPath,
} from "@/lib/utils";

type NewsSidebarProps = {
  latest: WpPost[];
  categories: WpCategory[];
  tags?: WpTag[];
  picks: WpPost[];
  activeCategorySlug?: string;
};

export async function NewsSidebar({
  latest,
  categories,
  tags = [],
  picks,
  activeCategorySlug,
}: NewsSidebarProps) {
  const author = await getSiteAuthor();
  const photo = resolveAuthorPhoto(author);
  const orderedCategories = sortCategoriesEditorially(categories);
  const visibleCategories = orderedCategories.slice(0, MAX_SIDEBAR_CATEGORIES);
  const hasMoreCategories = orderedCategories.length > visibleCategories.length;

  return (
    <aside className="news-sidebar" aria-label="Sidebar">
      <SidebarAd />
      <SidebarSecondaryAd />

      <section className="sidebar-block">
        <h2 className="sidebar-heading">Latest News</h2>
        <ul className="sidebar-list">
          {latest.map((post) => {
            const title = displayTitleForPost(post);
            const image = getPostImage(post);
            const postCategories = getPostCategories(post).filter(
              (category) => category.slug !== "uncategorized",
            );
            const sourceLabel = postCategories[0]
              ? decodeHtml(postCategories[0].name)
              : null;

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
                        loading="lazy"
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
                  <p className="sidebar-item-meta">
                    <time dateTime={post.date}>{formatCompactDate(post.date)}</time>
                    {sourceLabel ? (
                      <>
                        {" · "}
                        <span dir="auto">{sourceLabel}</span>
                      </>
                    ) : null}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {visibleCategories.length > 0 ? (
        <section className="sidebar-block">
          <h2 className="sidebar-heading">Categories</h2>
          <ul className="sidebar-categories">
            {visibleCategories.map((category) => {
              const active = activeCategorySlug === category.slug;
              return (
                <li key={category.id}>
                  <Link
                    href={categoryPath(category.slug)}
                    dir="auto"
                    className={active ? "is-active" : undefined}
                    aria-current={active ? "page" : undefined}
                  >
                    <span>{decodeHtml(category.name)}</span>
                    <span>{category.count}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {hasMoreCategories ? (
            <Link href="/latest" className="section-link sidebar-view-all">
              View all sections
            </Link>
          ) : null}
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
              loading="lazy"
            />
          ) : null}
          <div>
            <p className="about-author-name">{author.name || SITE_NAME}</p>
            <p className="about-author-bio">{author.shortBio}</p>
            <Link href="/about" className="section-link">
              About &amp; Contact
            </Link>
          </div>
        </div>
      </section>
    </aside>
  );
}
