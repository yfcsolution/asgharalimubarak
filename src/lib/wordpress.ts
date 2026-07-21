import { cache } from "react";

import { readSnapshot, saveFullSnapshot } from "@/lib/content-repository";
import {
  CATEGORY_CACHE_SECONDS,
  isValidNavCategory,
  sortCategoriesEditorially,
} from "@/lib/category-config";
import {
  FEED_UNAVAILABLE_MESSAGE,
  SNAPSHOT_MESSAGE,
} from "@/lib/feed-status";
import { POSTS_PER_PAGE } from "@/lib/site";
import type {
  PaginatedPosts,
  WpCategory,
  WpPost,
  WpTag,
} from "@/lib/types";
import { normalizeSlug } from "@/lib/utils";
import { wpFetchWithFallback } from "@/lib/wordpress-api";

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
  "author",
  "featured_media",
  "categories",
  "tags",
  "jetpack_featured_media_url",
].join(",");

const LIST_FIELDS_LIGHT = LIST_FIELDS;

const CONTENT_IMAGE_FIELDS = ["id", "content"].join(",");

const SITEMAP_FIELDS = ["id", "date", "modified", "slug"].join(",");

async function wpFetch<T>(
  path: string,
  query: Record<string, QueryValue> = {},
  options: { revalidate?: number; validate?: (data: unknown) => data is T } = {},
): Promise<{ data: T; headers: Headers }> {
  const { data, headers } = await wpFetchWithFallback<T>(path, query, options);
  return { data, headers };
}

function stripHeavyContent(posts: WpPost[]): WpPost[] {
  return posts.map((post) => ({
    ...post,
    content: post.content
      ? {
          rendered: summarizeContentForImages(post.content.rendered),
          protected: post.content.protected,
        }
      : undefined,
  }));
}

function summarizeContentForImages(html: string): string {
  const images = html.match(/<img\b[^>]*>/gi) ?? [];
  if (images.length === 0) return "";
  return images.slice(0, 8).join("\n");
}

function postNeedsContentImage(post: WpPost): boolean {
  if (post.jetpack_featured_media_url) return false;
  if (post._embedded?.["wp:featuredmedia"]?.[0]?.source_url) return false;
  if (extractHasInlineImage(post.content?.rendered)) return false;
  if (extractHasInlineImage(post.excerpt?.rendered)) return false;
  return true;
}

function extractHasInlineImage(html: string | undefined): boolean {
  if (!html) return false;
  return /<img\b/i.test(html);
}

async function enrichPostsWithContentImages(
  posts: WpPost[],
): Promise<WpPost[]> {
  const missing = posts.filter(postNeedsContentImage);
  if (missing.length === 0) return posts;

  try {
    const { data } = await wpFetch<WpPost[]>("/posts", {
      include: missing.map((post) => post.id).join(","),
      per_page: missing.length,
      status: "publish",
      _fields: CONTENT_IMAGE_FIELDS,
    });

    const contentById = new Map(
      data.map((post) => [
        post.id,
        summarizeContentForImages(post.content?.rendered ?? ""),
      ]),
    );

    return posts.map((post) => {
      const rendered = contentById.get(post.id);
      if (!rendered) return post;
      return {
        ...post,
        content: {
          rendered,
          protected: false,
        },
      };
    });
  } catch {
    return posts;
  }
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

  const mergedPosts = partial.posts
    ? mergePostsById(existing.posts, partial.posts)
    : existing.posts;

  await saveFullSnapshot(
    {
      ...existing,
      savedAt: new Date().toISOString(),
      posts: mergedPosts,
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

async function persistSnapshotSafe(partial: {
  posts?: WpPost[];
  categories?: WpCategory[];
  tags?: WpTag[];
  pagination?: PaginatedPosts;
}): Promise<void> {
  try {
    await persistSnapshot(partial);
  } catch (error) {
    console.error("Snapshot persistence failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

function mergePostsById(existing: WpPost[], incoming: WpPost[]): WpPost[] {
  const byId = new Map<number, WpPost>();
  for (const post of existing) {
    byId.set(post.id, post);
  }
  for (const post of incoming) {
    byId.set(post.id, post);
  }
  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
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

function isPostsPayload(data: unknown): data is WpPost[] {
  return Array.isArray(data);
}

function isCategoriesPayload(data: unknown): data is WpCategory[] {
  return Array.isArray(data);
}

function isTagsPayload(data: unknown): data is WpTag[] {
  return Array.isArray(data);
}

function emptyFeedResult(
  page: number,
  perPage: number,
  feedUnavailable: boolean,
): PaginatedPosts {
  return {
    posts: [],
    total: 0,
    totalPages: 0,
    page,
    perPage,
    fromSnapshot: feedUnavailable,
    feedUnavailable,
    snapshotMessage: feedUnavailable ? FEED_UNAVAILABLE_MESSAGE : undefined,
  };
}

export const getPosts = cache(async function getPosts(options: {
  page?: number;
  perPage?: number;
  categories?: number | string;
  search?: string;
  mode?: "list" | "sitemap" | "light";
} = {}): Promise<PaginatedPosts> {
  const page = Math.max(1, options.page ?? 1);
  const perPage = options.perPage ?? POSTS_PER_PAGE;
  const mode = options.mode ?? "list";
  const fields =
    mode === "sitemap"
      ? SITEMAP_FIELDS
      : mode === "light"
        ? LIST_FIELDS_LIGHT
        : LIST_FIELDS;
  const useEmbed = mode !== "sitemap";

  try {
    const { data, headers } = await wpFetch<WpPost[]>(
      "/posts",
      {
        status: "publish",
        _embed: useEmbed ? true : undefined,
        _fields: fields,
        page,
        per_page: perPage,
        categories: options.categories,
        search: options.search,
        orderby: "date",
        order: "desc",
      },
      { validate: isPostsPayload },
    );

    const postsWithImages =
      mode === "sitemap" ? data : await enrichPostsWithContentImages(data);
    const posts =
      mode === "sitemap" ? postsWithImages : stripHeavyContent(postsWithImages);

    const result: PaginatedPosts = {
      posts,
      total: Number(headers.get("X-WP-Total") ?? data.length),
      totalPages: Number(headers.get("X-WP-TotalPages") ?? 1),
      page,
      perPage,
    };

    if (
      page === 1 &&
      !options.search &&
      !options.categories &&
      (mode === "list" || mode === "light") &&
      perPage >= POSTS_PER_PAGE
    ) {
      void persistSnapshotSafe({ posts, pagination: result });
    }

    return result;
  } catch {
    const snapshot = await readSnapshot("site");
    if (!snapshot || snapshot.posts.length === 0) {
      return emptyFeedResult(page, perPage, true);
    }

    const filtered = filterSnapshotPosts(snapshot.posts, {
      page,
      perPage,
      categories: options.categories,
      search: options.search,
    });

    const total = snapshot.pagination?.total ?? snapshot.posts.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));

    return {
      posts: mode === "sitemap" ? filtered : stripHeavyContent(filtered),
      total,
      totalPages,
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
      const { data } = await wpFetch<WpPost[]>(
        "/posts",
        {
          slug: candidate,
          status: "publish",
          _embed: true,
        },
        { validate: isPostsPayload },
      );
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
    const { data } = await wpFetch<WpCategory[]>(
      "/categories",
      {
        per_page: 100,
        hide_empty: true,
        orderby: "count",
        order: "desc",
      },
      { revalidate: CATEGORY_CACHE_SECONDS, validate: isCategoriesPayload },
    );
    void persistSnapshotSafe({ categories: data });
    return sortCategoriesEditorially(data);
  } catch {
    const snapshot = await readSnapshot("site");
    return sortCategoriesEditorially(snapshot?.categories ?? []);
  }
});

export const getAllCategories = cache(async function getAllCategories(): Promise<
  WpCategory[]
> {
  try {
    const { data } = await wpFetch<WpCategory[]>(
      "/categories",
      {
        per_page: 100,
        hide_empty: false,
        orderby: "count",
        order: "desc",
      },
      { revalidate: CATEGORY_CACHE_SECONDS, validate: isCategoriesPayload },
    );
    return sortCategoriesEditorially(data);
  } catch {
    const snapshot = await readSnapshot("site");
    return sortCategoriesEditorially(snapshot?.categories ?? []);
  }
});

export const getTags = cache(async function getTags(
  limit = 20,
): Promise<WpTag[]> {
  try {
    const { data } = await wpFetch<WpTag[]>(
      "/tags",
      {
        per_page: limit,
        hide_empty: true,
        orderby: "count",
        order: "desc",
      },
      { validate: isTagsPayload },
    );
    void persistSnapshotSafe({ tags: data });
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
    const { data } = await wpFetch<WpCategory[]>(
      "/categories",
      { slug: normalized },
      { revalidate: CATEGORY_CACHE_SECONDS, validate: isCategoriesPayload },
    );
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
  return sortCategoriesEditorially(categories.filter(isValidNavCategory));
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
