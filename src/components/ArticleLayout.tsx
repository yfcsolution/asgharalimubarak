import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { PostImage } from "@/components/PostImage";
import { WordPressContent } from "@/components/WordPressContent";
import {
  authorFromEmbedded,
  getPostAuthor,
  getSiteAuthor,
  resolveAuthorPhoto,
} from "@/lib/author";
import { getSiteUrl, SITE_NAME, SOCIAL_LINKS } from "@/lib/site";
import type { WpPost } from "@/lib/types";
import {
  categoryPath,
  displayTitleForPost,
  formatPakistanDate,
  getPostCategories,
  getPostImage,
  getPostTags,
  isMeaningfullyUpdated,
  postPath,
  readingTimeMinutes,
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
  const shareUrl = `${getSiteUrl()}${postPath(post.slug)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: display.text,
    alternativeHeadline:
      display.fullText !== display.text ? display.fullText : undefined,
    datePublished: post.date,
    dateModified: post.modified || post.date,
    author: {
      "@type": "Person",
      name: author?.name || SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${getSiteUrl()}/images/asghar-ali-mubarak.jpg`,
      },
    },
    image: image?.src
      ? [image.src]
      : [`${getSiteUrl()}/images/asghar-ali-mubarak.jpg`],
    mainEntityOfPage: shareUrl,
    inLanguage: display.lang === "ur" ? "ur" : "en",
  };

  return (
    <div className="content-with-sidebar article-page-shell">
      <article className="article-layout">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/latest">News</Link>
            </li>
            {categories[0] ? (
              <li>
                <Link href={categoryPath(categories[0].slug)} dir="auto">
                  {categories[0].name}
                </Link>
              </li>
            ) : null}
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

          <h1 className="article-title" dir={display.dir} lang={display.lang}>
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
              {author?.name ? <p className="byline-author">By {author.name}</p> : null}
              <p className="byline-dates">
                <span>
                  Published{" "}
                  <time dateTime={post.date}>{formatPakistanDate(post.date)}</time>
                </span>
                {showUpdated ? (
                  <span>
                    {" · Updated "}
                    <time dateTime={post.modified}>
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

        <WordPressContent html={post.content?.rendered ?? ""} />

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
          <ul className="share-links">
            <li>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(display.text)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                X
              </a>
            </li>
            <li>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a href={SOCIAL_LINKS[0].href} target="_blank" rel="noopener noreferrer">
                YouTube
              </a>
            </li>
          </ul>
        </section>

        {related}
      </article>

      {sidebar}
    </div>
  );
}
