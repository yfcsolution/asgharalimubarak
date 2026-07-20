import { cache } from "react";

import { readSnapshot, saveFullSnapshot } from "@/lib/content-repository";
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

const WP_TIMEOUT_MS = 8000;
const WP_MAX_RETRIES = 2;
const SNAPSHOT_MESSAGE = "Showing the latest saved edition.";

async function wpFetchRaw<T>(
  path: string,
  query: Record<string, QueryValue> = {},
): Promise<{ data: T; headers: Headers }> {
  const base = getWordPressApiUrl();
  const url = new URL(`${base}${path.startsWith("/") ? path : `/${path}`}`);

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    url.searchParams.set(key, String(value));
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= WP_MAX_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), WP_TIMEOUT_MS);

    try {
      const response = await fetch(url.toString(), {
        next: { revalidate: REVALIDATE_SECONDS },
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!response.ok) {
        throw new Error(
          `WordPress API error ${response.status} for ${url.pathname}${url.search}`,
        );
      }

      const data = (await response.json()) as T;
      return { data, headers: response.headers };
    } catch (error) {
      clearTimeout(timer);
      lastError = error instanceof Error ? error : new Error("WordPress fetch failed");
      if (attempt < WP_MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
      }
    }
  }

  throw lastError ?? new Error("WordPress fetch failed");
}

async function wpFetch<T>(
  path: string,
  query: Record<string, QueryValue> = {},
): Promise<{ data: T; headers: Headers }> {
  return wpFetchRaw<T>(path, query);
}

function stripHeavyContent(posts: WpPost[]): WpPost[] {
  return posts.map((post) => {
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
  return images.slice(0, 8).join("\n");
}

async function persistSnapshot(partial: {
  posts?: WpPost[];
  categories?: WpCategory[];
  tags?: WpTag[];
  pagination?: PaginatedPosts;
}): Promise<void> {
  const existing = (await readSnapshot("site")) ?? {
    savedAt: new Date().toISOString(),
    posts: [],
    categories: [],
    tags: [],
  };

  await saveFullSnapshot(
    {
      ...existing,
      savedAt: new Date().toISOString(),
      posts: partial.posts ?? existing.posts,
      categories: partial.categories ?? existing.categories,
      tags: partial.tags ?? existing.tags,
      pagination: partial.pagination
        ? {
            page: partial.pagination.page,
            perPage: partial.pagination.perPage,
            total: partial.pagination.total,
            totalPages: partial.pagination.totalPages,
          }
        : existing.pagination,
    },
    "site",
  );
}

function filterSnapshotPosts(
  posts: WpPost[],
  options: {
    page?: number;
    perPage?: number;
    categories?: number | string;
    search?: string;
  },
): WpPost[] {
  let filtered = [...posts];

  if (options.categories !== undefined) {
    const categoryId = Number(options.categories);
    filtered = filtered.filter((post) => post.categories.includes(categoryId));
  }

  if (options.search) {
    const query = options.search.toLowerCase();
    filtered = filtered.filter((post) => {
      const title = post.title.rendered.toLowerCase();
      const excerpt = post.excerpt.rendered.toLowerCase();
      return title.includes(query) || excerpt.includes(query);
    });
  }

  filtered.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const page = Math.max(1, options.page ?? 1);
  const perPage = options.perPage ?? POSTS_PER_PAGE;
  const start = (page - 1) * perPage;
  return filtered.slice(start, start + perPage);
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

  try {
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

    const result: PaginatedPosts = {
      posts: mode === "list" ? stripHeavyContent(data) : data,
      total: Number(headers.get("X-WP-Total") ?? data.length),
      totalPages: Number(headers.get("X-WP-TotalPages") ?? 1),
      page,
      perPage,
    };

    if (page === 1 && !options.search && !options.categories) {
      await persistSnapshot({ posts: data, pagination: result });
    }

    return result;
  } catch {
    const snapshot = await readSnapshot("site");
    if (!snapshot || snapshot.posts.length === 0) {
      throw new Error("WordPress unavailable and no saved snapshot exists");
    }

    const filtered = filterSnapshotPosts(snapshot.posts, {
      page,
      perPage,
      categories: options.categories,
      search: options.search,
    });

    return {
      posts: mode === "list" ? stripHeavyContent(filtered) : filtered,
      total: snapshot.pagination?.total ?? snapshot.posts.length,
      totalPages: snapshot.pagination?.totalPages ?? 1,
      page,
      perPage,
      fromSnapshot: true,
      snapshotMessage: SNAPSHOT_MESSAGE,
    };
  }
});

export const getPostBySlug = cache(async function getPostBySlug(
  slug: string,
): Promise<WpPost | null> {
  const normalized = normalizeSlug(slug);
  const candidates = Array.from(
    new Set([normalized, encodeURIComponent(normalized), slug]),
  );

  try {
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
  } catch {
    const snapshot = await readSnapshot("site");
    if (!snapshot) return null;

    return (
      snapshot.posts.find((post) => {
        const postSlug = normalizeSlug(post.slug);
        return candidates.some(
          (candidate) =>
            postSlug === normalizeSlug(candidate) ||
            post.slug === candidate ||
            encodeURIComponent(postSlug) === candidate,
        );
      }) ?? null
    );
  }
});

export const getCategories = cache(async function getCategories(): Promise<
  WpCategory[]
> {
  try {
    const { data } = await wpFetch<WpCategory[]>("/categories", {
      per_page: 100,
      hide_empty: true,
      orderby: "count",
      order: "desc",
    });
    await persistSnapshot({ categories: data });
    return data;
  } catch {
    const snapshot = await readSnapshot("site");
    return snapshot?.categories ?? [];
  }
});

export const getTags = cache(async function getTags(
  limit = 20,
): Promise<WpTag[]> {
  try {
    const { data } = await wpFetch<WpTag[]>("/tags", {
      per_page: limit,
      hide_empty: true,
      orderby: "count",
      order: "desc",
    });
    await persistSnapshot({ tags: data });
    return data;
  } catch {
    const snapshot = await readSnapshot("site");
    return snapshot?.tags.slice(0, limit) ?? [];
  }
});

export const getCategoryBySlug = cache(async function getCategoryBySlug(
  slug: string,
): Promise<WpCategory | null> {
  const normalized = normalizeSlug(slug);

  try {
    const { data } = await wpFetch<WpCategory[]>("/categories", {
      slug: normalized,
    });
    return data[0] ?? null;
  } catch {
    const snapshot = await readSnapshot("site");
    return (
      snapshot?.categories.find(
        (category) => normalizeSlug(category.slug) === normalized,
      ) ?? null
    );
  }
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

export const getSnapshotStatus = cache(async function getSnapshotStatus(): Promise<{
  fromSnapshot: boolean;
  message?: string;
}> {
  const result = await getPosts({ page: 1, perPage: 1 });
  return {
    fromSnapshot: Boolean(result.fromSnapshot),
    message: result.snapshotMessage,
  };
});
