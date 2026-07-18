import { cache } from "react";

import { getPostImage } from "@/lib/images";
import { POSTS_PER_PAGE, REVALIDATE_SECONDS, getWordPressApiUrl } from "@/lib/site";
import type {
  PaginatedPosts,
  WpCategory,
  WpPost,
  WpTag,
} from "@/lib/types";
import { normalizeSlug } from "@/lib/utils";

type QueryValue = string | number | boolean | undefined;

const LIST_FIELDS = [
  "id",
  "date",
  "modified",
  "slug",
  "status",
  "link",
  "title",
  "excerpt",
  "content",
  "author",
  "featured_media",
  "categories",
  "tags",
  "jetpack_featured_media_url",
  "_links",
  "_embedded",
].join(",");

const SITEMAP_FIELDS = ["id", "date", "modified", "slug"].join(",");

async function wpFetch<T>(
  path: string,
  query: Record<string, QueryValue> = {},
): Promise<{ data: T; headers: Headers }> {
  const base = getWordPressApiUrl();
  const url = new URL(`${base}${path.startsWith("/") ? path : `/${path}`}`);

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url.toString(), {
    next: { revalidate: REVALIDATE_SECONDS },
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `WordPress API error ${response.status} for ${url.pathname}${url.search}`,
    );
  }

  const data = (await response.json()) as T;
  return { data, headers: response.headers };
}

function stripHeavyContent(posts: WpPost[]): WpPost[] {
  return posts.map((post) => {
    // Keep enough HTML for image extraction, then drop bulky content from RSC payloads.
    const imageProbe = getPostImage(post);
    void imageProbe;
    return {
      ...post,
      content: post.content
        ? {
            rendered: summarizeContentForImages(post.content.rendered),
            protected: post.content.protected,
          }
        : undefined,
    };
  });
}

function summarizeContentForImages(html: string): string {
  const images = html.match(/<img\b[^>]*>/gi) ?? [];
  if (images.length === 0) return "";
  // Preserve image tags (with attrs) so getPostImage can still resolve URLs.
  return images.slice(0, 8).join("\n");
}

export const getPosts = cache(async function getPosts(options: {
  page?: number;
  perPage?: number;
  categories?: number | string;
  search?: string;
  mode?: "list" | "sitemap";
} = {}): Promise<PaginatedPosts> {
  const page = Math.max(1, options.page ?? 1);
  const perPage = options.perPage ?? POSTS_PER_PAGE;
  const mode = options.mode ?? "list";

  const { data, headers } = await wpFetch<WpPost[]>("/posts", {
    status: "publish",
    _embed: mode === "list" ? true : undefined,
    _fields: mode === "sitemap" ? SITEMAP_FIELDS : LIST_FIELDS,
    page,
    per_page: perPage,
    categories: options.categories,
    search: options.search,
    orderby: "date",
    order: "desc",
  });

  return {
    posts: mode === "list" ? stripHeavyContent(data) : data,
    total: Number(headers.get("X-WP-Total") ?? data.length),
    totalPages: Number(headers.get("X-WP-TotalPages") ?? 1),
    page,
    perPage,
  };
});

export const getPostBySlug = cache(async function getPostBySlug(
  slug: string,
): Promise<WpPost | null> {
  const normalized = normalizeSlug(slug);
  const candidates = Array.from(
    new Set([normalized, encodeURIComponent(normalized), slug]),
  );

  for (const candidate of candidates) {
    const { data } = await wpFetch<WpPost[]>("/posts", {
      slug: candidate,
      status: "publish",
      _embed: true,
    });
    if (data.length > 0) {
      return data[0];
    }
  }

  return null;
});

export const getCategories = cache(async function getCategories(): Promise<
  WpCategory[]
> {
  const { data } = await wpFetch<WpCategory[]>("/categories", {
    per_page: 100,
    hide_empty: true,
    orderby: "count",
    order: "desc",
  });
  return data;
});

export const getTags = cache(async function getTags(
  limit = 20,
): Promise<WpTag[]> {
  const { data } = await wpFetch<WpTag[]>("/tags", {
    per_page: limit,
    hide_empty: true,
    orderby: "count",
    order: "desc",
  });
  return data;
});

export const getCategoryBySlug = cache(async function getCategoryBySlug(
  slug: string,
): Promise<WpCategory | null> {
  const normalized = normalizeSlug(slug);
  const { data } = await wpFetch<WpCategory[]>("/categories", {
    slug: normalized,
  });
  return data[0] ?? null;
});

export async function getAllPostSlugs(limit = 24): Promise<string[]> {
  const { posts } = await getPosts({
    page: 1,
    perPage: Math.min(limit, 100),
    mode: "sitemap",
  });
  return posts.map((post) => normalizeSlug(post.slug));
}

export async function getPostsForSitemap(
  page: number,
  perPage = 100,
): Promise<PaginatedPosts> {
  return getPosts({ page, perPage, mode: "sitemap" });
}

export async function getNavCategories(): Promise<WpCategory[]> {
  const categories = await getCategories();
  return categories.filter((category) => {
    const name = category.name.trim().toLowerCase();
    const slug = category.slug.trim().toLowerCase();
    if (category.count <= 0) return false;
    if (slug === "uncategorized" || name === "uncategorized") return false;
    if (!name || name === "-" || name.includes("http")) return false;
    return true;
  });
}
