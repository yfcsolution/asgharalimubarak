import he from "he";

import type { FeaturedImageData, WpPost } from "@/lib/types";

export function decodeHtml(value: string): string {
  return he.decode(value.replace(/<[^>]*>/g, "").trim());
}

export function stripHtml(value: string): string {
  return decodeHtml(value);
}

export function normalizeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export function postPath(slug: string): string {
  return `/article/${encodeURIComponent(normalizeSlug(slug))}`;
}

export function categoryPath(slug: string): string {
  return `/category/${encodeURIComponent(normalizeSlug(slug))}`;
}

export function formatDate(date: string, locale: string = "en-PK"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function getPostCategories(post: WpPost) {
  const terms = post._embedded?.["wp:term"] ?? [];
  return terms.flat().filter((term) => term.taxonomy === "category");
}

export function getFeaturedImage(post: WpPost): FeaturedImageData | null {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (media?.source_url) {
    const large = media.media_details?.sizes?.large;
    return {
      src: large?.source_url ?? media.source_url,
      alt: media.alt_text || decodeHtml(post.title.rendered),
      width: large?.width ?? media.media_details?.width,
      height: large?.height ?? media.media_details?.height,
    };
  }

  if (post.jetpack_featured_media_url) {
    return {
      src: post.jetpack_featured_media_url,
      alt: decodeHtml(post.title.rendered),
    };
  }

  const contentMatch = post.content?.rendered?.match(
    /<img[^>]+src=["']([^"']+)["']/i,
  );
  if (contentMatch?.[1]) {
    return {
      src: contentMatch[1],
      alt: decodeHtml(post.title.rendered),
    };
  }

  return null;
}

export function excerptText(post: WpPost, maxLength = 180): string {
  const text = stripHtml(post.excerpt?.rendered || post.content?.rendered || "");
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
