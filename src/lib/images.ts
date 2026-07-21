import type { FeaturedImageData, WpFeaturedMedia, WpPost } from "@/lib/types";
import { decodeHtml } from "@/lib/utils";

const MIN_DIMENSION = 250;

const EXCLUDED_SRC_PATTERNS = [
  /gravatar\.com/i,
  /\/avatar/i,
  /emoji/i,
  /smilies/i,
  /wp-includes\/images/i,
  /pixel/i,
  /1x1/i,
  /spacer/i,
  /tracking/i,
  /facebook\.com\/tr/i,
  /doubleclick/i,
  /^data:/i,
];

type Candidate = {
  src: string;
  width?: number;
  height?: number;
  score: number;
};

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isExcludedSrc(src: string): boolean {
  return EXCLUDED_SRC_PATTERNS.some((pattern) => pattern.test(src));
}

function normalizeImageUrl(raw: string): string | null {
  const cleaned = raw.trim().replace(/&amp;/g, "&");
  if (!cleaned || cleaned.startsWith("data:") || !isValidHttpUrl(cleaned)) {
    return null;
  }
  if (isExcludedSrc(cleaned)) {
    return null;
  }
  return cleaned;
}

function dimensionScore(width?: number, height?: number): number {
  const w = width ?? 0;
  const h = height ?? 0;
  if (w > 0 && w < MIN_DIMENSION && h > 0 && h < MIN_DIMENSION) {
    return -1000;
  }
  return Math.max(w, h, 0);
}

function parseSrcset(srcset: string): Candidate[] {
  const candidates: Candidate[] = [];

  for (const part of srcset.split(",")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const [url, descriptor] = trimmed.split(/\s+/);
    const widthMatch = descriptor?.match(/^(\d+)w$/i);
    const width = widthMatch ? Number(widthMatch[1]) : undefined;
    const src = normalizeImageUrl(url);
    if (!src) continue;
    candidates.push({
      src,
      width,
      score: dimensionScore(width),
    });
  }

  return candidates;
}

function pickBestCandidate(candidates: Candidate[]): Candidate | null {
  const valid = candidates.filter((item) => item.score >= 0);
  if (valid.length === 0) return null;
  return valid.sort((a, b) => b.score - a.score)[0] ?? null;
}

function candidatesFromMedia(media: WpFeaturedMedia): Candidate[] {
  const candidates: Candidate[] = [];
  const sizes = media.media_details?.sizes ?? {};

  for (const key of ["large", "medium_large", "medium", "full"] as const) {
    const size = sizes[key];
    if (!size?.source_url) continue;
    const src = normalizeImageUrl(size.source_url);
    if (!src) continue;
    candidates.push({
      src,
      width: size.width,
      height: size.height,
      score: dimensionScore(size.width, size.height) + (key === "large" ? 50 : 0),
    });
  }

  if (media.source_url) {
    const src = normalizeImageUrl(media.source_url);
    if (src) {
      candidates.push({
        src,
        width: media.media_details?.width,
        height: media.media_details?.height,
        score: dimensionScore(
          media.media_details?.width,
          media.media_details?.height,
        ),
      });
    }
  }

  return candidates;
}

function parseOrigSize(value: string | undefined): {
  width?: number;
  height?: number;
} {
  if (!value) return {};
  const match = value.match(/^(\d+)\s*,\s*(\d+)$/);
  if (!match) return {};
  return { width: Number(match[1]), height: Number(match[2]) };
}

function extractFromHtml(html: string | undefined): Candidate | null {
  if (!html) return null;

  const imgTags = html.match(/<img\b[^>]*>/gi) ?? [];
  const candidates: Candidate[] = [];

  for (const tag of imgTags) {
    const attrs: Record<string, string> = {};
    const attrRegex = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(["'])(.*?)\2/g;
    let match: RegExpExecArray | null;
    while ((match = attrRegex.exec(tag)) !== null) {
      attrs[match[1].toLowerCase()] = match[3];
    }

    const orig = parseOrigSize(attrs["data-orig-size"]);
    const width = Number(attrs.width) || orig.width || undefined;
    const height = Number(attrs.height) || orig.height || undefined;

    const urlCandidates = [
      attrs["data-orig-file"],
      attrs["data-large-file"],
      attrs["data-medium-file"],
      attrs.src,
    ];

    for (const raw of urlCandidates) {
      if (!raw) continue;
      const src = normalizeImageUrl(raw);
      if (!src) continue;
      candidates.push({
        src,
        width,
        height,
        score:
          dimensionScore(width, height) +
          (raw === attrs["data-orig-file"]
            ? 80
            : raw === attrs["data-large-file"]
              ? 40
              : raw === attrs["data-medium-file"]
                ? 20
                : 0),
      });
    }

    if (attrs.srcset) {
      candidates.push(...parseSrcset(attrs.srcset));
    }
  }

  return pickBestCandidate(candidates);
}

export function getPostImage(post: WpPost): FeaturedImageData | null {
  const alt = decodeHtml(post.title.rendered);
  const media = post._embedded?.["wp:featuredmedia"]?.[0];

  if (media) {
    const best = pickBestCandidate(candidatesFromMedia(media));
    if (best) {
      return {
        src: best.src,
        alt: media.alt_text || alt,
        width: best.width ?? media.media_details?.width,
        height: best.height ?? media.media_details?.height,
        caption: media.caption?.rendered
          ? decodeHtml(media.caption.rendered)
          : undefined,
      };
    }
  }

  if (post.jetpack_featured_media_url) {
    const src = normalizeImageUrl(post.jetpack_featured_media_url);
    if (src) {
      return { src, alt };
    }
  }

  const fromContent = extractFromHtml(post.content?.rendered);
  if (fromContent) {
    return {
      src: fromContent.src,
      alt,
      width: fromContent.width,
      height: fromContent.height,
    };
  }

  const fromExcerpt = extractFromHtml(post.excerpt?.rendered);
  if (fromExcerpt) {
    return {
      src: fromExcerpt.src,
      alt,
      width: fromExcerpt.width,
      height: fromExcerpt.height,
    };
  }

  return null;
}

/** @deprecated Use getPostImage */
export function getFeaturedImage(post: WpPost): FeaturedImageData | null {
  return getPostImage(post);
}
