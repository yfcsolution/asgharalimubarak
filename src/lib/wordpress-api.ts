import { readSnapshot } from "@/lib/content-repository";
import type { WpCategory, WpPost } from "@/lib/types";

export const WORDPRESS_PUBLIC_API_URL =
  "https://public-api.wordpress.com/wp/v2/sites/asgharalimubarakblog.wordpress.com";

export const WORDPRESS_DIRECT_API_URL =
  "https://asgharalimubarakblog.wordpress.com/wp-json/wp/v2";

export const WP_TIMEOUT_MS = 10000;
export const WP_MAX_RETRIES = 2;
const DEFAULT_REVALIDATE_SECONDS = 60;

type QueryValue = string | number | boolean | undefined;

export type WordPressFetchResult<T> = {
  data: T;
  headers: Headers;
  apiHost: string;
};

export type WordPressHealthResult = {
  ok: boolean;
  postsReachable: boolean;
  categoriesReachable: boolean;
  apiHost: string;
  snapshotAvailable: boolean;
  checkedAt: string;
};

/** Ordered API bases: configured env, public WordPress.com proxy, direct site REST. */
export function getWordPressApiBases(): string[] {
  const configured = process.env.WORDPRESS_API_URL?.replace(/\/$/, "");
  return [
    ...new Set(
      [configured, WORDPRESS_PUBLIC_API_URL, WORDPRESS_DIRECT_API_URL].filter(
        (value): value is string => Boolean(value && value.length > 0),
      ),
    ),
  ];
}

export function getConfiguredWordPressApiUrl(): string {
  const bases = getWordPressApiBases();
  return bases[0] ?? WORDPRESS_PUBLIC_API_URL;
}

function buildApiUrl(base: string, path: string, query: Record<string, QueryValue>): URL {
  const url = new URL(`${base}${path.startsWith("/") ? path : `/${path}`}`);
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    url.searchParams.set(key, String(value));
  }
  return url;
}

function isValidJsonArray(data: unknown): data is unknown[] {
  return Array.isArray(data);
}

export async function wpFetchWithFallback<T>(
  path: string,
  query: Record<string, QueryValue> = {},
  options: { revalidate?: number; validate?: (data: unknown) => data is T } = {},
): Promise<WordPressFetchResult<T>> {
  const bases = getWordPressApiBases();
  const revalidate = options.revalidate ?? DEFAULT_REVALIDATE_SECONDS;
  const validate =
    options.validate ??
    ((data: unknown): data is T => data !== null && typeof data === "object");

  let lastError: Error | null = null;

  for (const base of bases) {
    const url = buildApiUrl(base, path, query);

    for (let attempt = 0; attempt <= WP_MAX_RETRIES; attempt += 1) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), WP_TIMEOUT_MS);

      try {
        const response = await fetch(url.toString(), {
          next: { revalidate },
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
        clearTimeout(timer);

        if (!response.ok) {
          throw new Error(
            `WordPress API error ${response.status} for ${url.pathname}${url.search}`,
          );
        }

        const data: unknown = await response.json();
        if (!validate(data)) {
          throw new Error(`Invalid WordPress JSON payload for ${url.pathname}`);
        }

        return {
          data,
          headers: response.headers,
          apiHost: new URL(base).hostname,
        };
      } catch (error) {
        clearTimeout(timer);
        lastError = error instanceof Error ? error : new Error("WordPress fetch failed");
        if (attempt < WP_MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
        }
      }
    }
  }

  throw lastError ?? new Error("WordPress fetch failed");
}

function isPostsPayload(data: unknown): data is WpPost[] {
  return isValidJsonArray(data);
}

function isCategoriesPayload(data: unknown): data is WpCategory[] {
  return isValidJsonArray(data);
}

async function probeBase(base: string): Promise<{
  postsReachable: boolean;
  categoriesReachable: boolean;
  apiHost: string;
}> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), WP_TIMEOUT_MS);
  let postsReachable = false;
  let categoriesReachable = false;

  try {
    const postsUrl = buildApiUrl(base, "/posts", {
      status: "publish",
      per_page: 1,
      orderby: "date",
      order: "desc",
    });
    const postsResponse = await fetch(postsUrl.toString(), {
      headers: { Accept: "application/json" },
      signal: controller.signal,
      cache: "no-store",
    });
    if (postsResponse.ok) {
      const posts = (await postsResponse.json()) as unknown;
      postsReachable = isPostsPayload(posts);
    }

    const categoriesUrl = buildApiUrl(base, "/categories", {
      per_page: 1,
      hide_empty: true,
      orderby: "count",
      order: "desc",
    });
    const categoriesResponse = await fetch(categoriesUrl.toString(), {
      headers: { Accept: "application/json" },
      signal: controller.signal,
      cache: "no-store",
    });
    if (categoriesResponse.ok) {
      const categories = (await categoriesResponse.json()) as unknown;
      categoriesReachable = isCategoriesPayload(categories);
    }
  } catch {
    // fall through
  } finally {
    clearTimeout(timer);
  }

  return {
    postsReachable,
    categoriesReachable,
    apiHost: new URL(base).hostname,
  };
}

export async function probeWordPressApi(): Promise<WordPressHealthResult> {
  const checkedAt = new Date().toISOString();
  let snapshotAvailable = false;

  try {
    const snapshot = await readSnapshot("site");
    snapshotAvailable = Boolean(snapshot && snapshot.posts.length > 0);
  } catch {
    snapshotAvailable = false;
  }

  for (const base of getWordPressApiBases()) {
    const probe = await probeBase(base);
    if (probe.postsReachable || probe.categoriesReachable) {
      return {
        ok: probe.postsReachable && probe.categoriesReachable,
        postsReachable: probe.postsReachable,
        categoriesReachable: probe.categoriesReachable,
        apiHost: probe.apiHost,
        snapshotAvailable,
        checkedAt,
      };
    }
  }

  return {
    ok: false,
    postsReachable: false,
    categoriesReachable: false,
    apiHost: "unknown",
    snapshotAvailable,
    checkedAt,
  };
}
