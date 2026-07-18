import { POSTS_PER_PAGE, REVALIDATE_SECONDS, getWordPressApiUrl } from "@/lib/site";
import type { PaginatedPosts, WpCategory, WpPost } from "@/lib/types";
import { normalizeSlug } from "@/lib/utils";

type QueryValue = string | number | boolean | undefined;

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

export async function getPosts(options: {
  page?: number;
  perPage?: number;
  categories?: number | string;
  search?: string;
} = {}): Promise<PaginatedPosts> {
  const page = Math.max(1, options.page ?? 1);
  const perPage = options.perPage ?? POSTS_PER_PAGE;

  const { data, headers } = await wpFetch<WpPost[]>("/posts", {
    status: "publish",
    _embed: true,
    page,
    per_page: perPage,
    categories: options.categories,
    search: options.search,
    orderby: "date",
    order: "desc",
  });

  return {
    posts: data,
    total: Number(headers.get("X-WP-Total") ?? data.length),
    totalPages: Number(headers.get("X-WP-TotalPages") ?? 1),
    page,
    perPage,
  };
}

export async function getPostBySlug(slug: string): Promise<WpPost | null> {
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
}

export async function getCategories(): Promise<WpCategory[]> {
  const { data } = await wpFetch<WpCategory[]>("/categories", {
    per_page: 100,
    hide_empty: true,
    orderby: "count",
    order: "desc",
  });
  return data;
}

export async function getCategoryBySlug(
  slug: string,
): Promise<WpCategory | null> {
  const normalized = normalizeSlug(slug);
  const { data } = await wpFetch<WpCategory[]>("/categories", {
    slug: normalized,
  });
  return data[0] ?? null;
}

export async function getAllPostSlugs(limit = 24): Promise<string[]> {
  const { posts } = await getPosts({ page: 1, perPage: Math.min(limit, 100) });
  return posts.map((post) => normalizeSlug(post.slug));
}

export async function getPostsForSitemap(
  page: number,
  perPage = 100,
): Promise<PaginatedPosts> {
  return getPosts({ page, perPage });
}
