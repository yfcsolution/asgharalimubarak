import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { ArticleBody } from "@/components/ArticleBody";
import { PostImage } from "@/components/PostImage";
import { RecommendButton } from "@/components/RecommendButton";
import { ShareButtons } from "@/components/ShareButtons";
import {
  authorFromEmbedded,
  getPostAuthor,
  getSiteAuthor,
  resolveAuthorPhoto,
} from "@/lib/author";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  organizationJsonLd,
  personJsonLd,
  PUBLISHER_LOGO_PATH,
  PUBLISHER_NAME,
  toJsonLdGraph,
  truncateMetaDescription,
} from "@/lib/seo";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/site";
import type { WpPost } from "@/lib/types";
import {
  categoryPath,
  displayTitleForPost,
  formatPakistanDate,
  getDisplayExcerpt,
  getPostCategories,
  getPostImage,
  getPostTags,
  isMeaningfullyUpdated,
  postPath,
  readingTimeMinutes,
  stripHtml,
} from "@/lib/utils";

type ArticleLayoutProps = {
  post: WpPost;
  related?: ReactNode;
  sidebar?: ReactNode;
};

export async function ArticleLayout({
  post,
  related,
  sidebar,
}: ArticleLayoutProps) {
  const display = displayTitleForPost(post);
  const image = getPostImage(post);
  const categories = getPostCategories(post);
  const tags = getPostTags(post);
  const author = getPostAuthor(post);
  const siteAuthor = await getSiteAuthor();
  const authorProfile = authorFromEmbedded(author);
  const photo = resolveAuthorPhoto({
    ...(authorProfile ?? {
      id: siteAuthor.id,
      name: siteAuthor.name,
      description: siteAuthor.description,
      shortBio: siteAuthor.shortBio,
      avatarUrl: siteAuthor.avatarUrl,
    }),
    localPhotoAvailable: siteAuthor.localPhotoAvailable,
  });
  const minutes = readingTimeMinutes(post.content?.rendered || "");
  const showUpdated = isMeaningfullyUpdated(post.date, post.modified);
  const shareUrl = absoluteUrl(postPath(post.slug));
  const primaryCategory = categories.find(
    (category) => category.slug !== "uncategorized",
  );
  const description = truncateMetaDescription(
    getDisplayExcerpt(
      stripHtml(post.excerpt?.rendered || post.content?.rendered || ""),
      "auto",
      160,
    ).text,
  );
  const authorName = author?.name || SITE_NAME;
  const siteUrl = absoluteUrl();

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    ...(primaryCategory
      ? [
          {
            name: primaryCategory.name,
            path: categoryPath(primaryCategory.slug),
          },
        ]
      : [{ name: "Latest", path: "/latest" }]),
    { name: display.text, path: postPath(post.slug) },
  ];

  const newsArticle = {
    "@type": "NewsArticle",
    "@id": `${shareUrl}#article`,
    headline: display.text,
    description,
    image: image?.src
      ? [image.src]
      : [absoluteUrl(DEFAULT_OG_IMAGE)],
    datePublished: post.date,
    dateModified: post.modified || post.date,
    author: {
      ...personJsonLd(),
      name: authorName,
      url: absoluteUrl("/about-contact"),
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      "@id": `${siteUrl}/#organization`,
      name: PUBLISHER_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(PUBLISHER_LOGO_PATH),
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": shareUrl,
    },
    articleSection: primaryCategory?.name,
    inLanguage: display.lang === "ur" ? "ur" : "en",
    isAccessibleForFree: true,
  };

  const jsonLd = toJsonLdGraph([
    organizationJsonLd(),
    breadcrumbJsonLd(breadcrumbItems),
    newsArticle,
  ]);

  return (
    <div className="content-with-sidebar article-page-shell">
      <article className="article-layout" itemScope itemType="https://schema.org/NewsArticle">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            {primaryCategory ? (
              <li>
                <Link href={categoryPath(primaryCategory.slug)} dir="auto">
                  {primaryCategory.name}
                </Link>
              </li>
            ) : (
              <li>
                <Link href="/latest">Latest</Link>
              </li>
            )}
            <li aria-current="page">
              <span dir={display.dir} lang={display.lang}>
                {display.text}
              </span>
            </li>
          </ol>
        </nav>

        <header className="article-header">
          {categories.length > 0 ? (
            <ul className="meta-pills" aria-label="Categories">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link href={categoryPath(category.slug)} className="meta-pill">
                    <span dir="auto">{category.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}

          <h1
            className="article-title"
            dir={display.dir}
            lang={display.lang}
            itemProp="headline"
          >
            {display.text}
          </h1>

          {display.fullText !== display.text ? (
            <p className="article-original-title" dir="auto" title={display.fullText}>
              {display.fullText}
            </p>
          ) : null}

          <div className="article-byline">
            {photo ? (
              <Image
                src={photo.src}
                alt={photo.alt}
                width={40}
                height={40}
                className="author-photo author-photo-sm"
              />
            ) : null}
            <div>
              {authorName ? (
                <p className="byline-author" itemProp="author">
                  By {authorName}
                </p>
              ) : null}
              <p className="byline-dates">
                <span>
                  Published{" "}
                  <time dateTime={post.date} itemProp="datePublished">
                    {formatPakistanDate(post.date)}
                  </time>
                </span>
                {showUpdated ? (
                  <span>
                    {" · Updated "}
                    <time dateTime={post.modified} itemProp="dateModified">
                      {formatPakistanDate(post.modified)}
                    </time>
                  </span>
                ) : null}
                <span>
                  {" · "}
                  {minutes} min read
                </span>
              </p>
            </div>
          </div>
        </header>

        <figure className="article-hero-media">
          <PostImage
            image={image}
            title={display.text}
            priority
            className="article-hero-image"
            sizes="(max-width: 900px) 100vw, 760px"
          />
          {image?.caption ? (
            <figcaption dir="auto">{image.caption}</figcaption>
          ) : null}
        </figure>

        <ArticleBody html={post.content?.rendered ?? ""} />

        <div className="article-actions">
          <RecommendButton postId={post.id} />
        </div>

        {tags.length > 0 ? (
          <section className="article-tags" aria-label="Tags">
            <h2 className="sidebar-heading">Tags</h2>
            <ul className="meta-pills">
              {tags.map((tag) => (
                <li key={tag.id}>
                  <Link
                    href={`/search?q=${encodeURIComponent(tag.name)}`}
                    className="meta-pill"
                    dir="auto"
                  >
                    {tag.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="share-block" aria-label="Share">
          <h2 className="sidebar-heading">Share</h2>
          <ShareButtons url={shareUrl} title={display.text} variant="full" />
        </section>

        {related}
      </article>

      {sidebar}
    </div>
  );
}
