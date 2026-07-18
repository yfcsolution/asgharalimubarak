import he from "he";

import {
  formatPakistanCompactDate,
  formatPakistanDate,
  formatPakistanDateTime,
  getLatestContentTimestamp,
  isMeaningfullyUpdated,
} from "@/lib/datetime";
import { getFeaturedImage, getPostImage } from "@/lib/images";
import {
  detectPrimaryScript,
  getDisplayExcerpt,
  getDisplayTitle,
  readingTimeMinutes,
} from "@/lib/language";
import type { WpPost } from "@/lib/types";

export {
  getFeaturedImage,
  getPostImage,
  detectPrimaryScript,
  getDisplayExcerpt,
  getDisplayTitle,
  readingTimeMinutes,
  formatPakistanDate,
  formatPakistanDateTime,
  formatPakistanCompactDate,
  isMeaningfullyUpdated,
  getLatestContentTimestamp,
};

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

/** @deprecated Prefer formatPakistanDate */
export function formatDate(date: string, locale: string = "en-PK"): string {
  return formatPakistanDate(date, undefined, locale);
}

/** @deprecated Prefer formatPakistanCompactDate */
export function formatCompactDate(date: string, locale: string = "en-PK"): string {
  void locale;
  return formatPakistanCompactDate(date);
}

export function getPostCategories(post: WpPost) {
  const terms = post._embedded?.["wp:term"] ?? [];
  return terms.flat().filter((term) => term.taxonomy === "category");
}

export function getPostTags(post: WpPost) {
  const terms = post._embedded?.["wp:term"] ?? [];
  return terms.flat().filter((term) => term.taxonomy === "post_tag");
}

export function excerptText(post: WpPost, maxLength = 180): string {
  return getDisplayExcerpt(
    stripHtml(post.excerpt?.rendered || post.content?.rendered || ""),
    "auto",
    maxLength,
  ).text;
}

export function displayTitleForPost(post: WpPost) {
  return getDisplayTitle(decodeHtml(post.title.rendered), "auto");
}

export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
