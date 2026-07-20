import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import type { PaginatedPosts, WpCategory, WpPost, WpTag } from "@/lib/types";

export type ContentSnapshot = {
  savedAt: string;
  posts: WpPost[];
  categories: WpCategory[];
  tags: WpTag[];
  pagination?: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
};

export interface ContentSnapshotStore {
  read(key: string): Promise<ContentSnapshot | null>;
  write(key: string, snapshot: ContentSnapshot): Promise<void>;
}

export type ContentFetchResult<T> = {
  data: T;
  fromSnapshot: boolean;
  snapshotMessage?: string;
};

const SNAPSHOT_DIR =
  process.env.CONTENT_SNAPSHOT_PATH?.trim() || ".content-cache";

class FilesystemSnapshotStore implements ContentSnapshotStore {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  private filePath(key: string): string {
    const safeKey = key.replace(/[^a-zA-Z0-9._-]/g, "_");
    return path.join(process.cwd(), this.basePath, `${safeKey}.json`);
  }

  async read(key: string): Promise<ContentSnapshot | null> {
    try {
      const raw = await readFile(this.filePath(key), "utf8");
      return JSON.parse(raw) as ContentSnapshot;
    } catch {
      return null;
    }
  }

  async write(key: string, snapshot: ContentSnapshot): Promise<void> {
    const filePath = this.filePath(key);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, JSON.stringify(snapshot), "utf8");
  }
}

function createSnapshotStore(): ContentSnapshotStore | null {
  const mode = process.env.CONTENT_SNAPSHOT_STORAGE?.trim() || "filesystem";

  if (mode === "filesystem") {
    return new FilesystemSnapshotStore(SNAPSHOT_DIR);
  }

  // Optional production adapters can be wired here (KV, Blob, Postgres).
  return null;
}

let snapshotStore: ContentSnapshotStore | null | undefined;

function getSnapshotStore(): ContentSnapshotStore | null {
  if (snapshotStore === undefined) {
    snapshotStore = createSnapshotStore();
  }
  return snapshotStore;
}

const WP_TIMEOUT_MS = 8000;
const WP_MAX_RETRIES = 2;

async function fetchWithRetry(url: string): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= WP_MAX_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), WP_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        next: { revalidate: 60 },
        headers: { Accept: "application/json" },
      });
      clearTimeout(timer);

      if (!response.ok) {
        throw new Error(`WordPress API error ${response.status}`);
      }

      return response;
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

function isValidPostsPayload(data: unknown): data is WpPost[] {
  return Array.isArray(data);
}

export async function fetchPostsWithFallback(options: {
  key: string;
  url: string;
  page?: number;
  perPage?: number;
}): Promise<ContentFetchResult<PaginatedPosts>> {
  const store = getSnapshotStore();

  try {
    const response = await fetchWithRetry(options.url);
    const data = (await response.json()) as WpPost[];

    if (!isValidPostsPayload(data)) {
      throw new Error("Invalid WordPress posts payload");
    }

    const result: PaginatedPosts = {
      posts: data,
      total: Number(response.headers.get("X-WP-Total") ?? data.length),
      totalPages: Number(response.headers.get("X-WP-TotalPages") ?? 1),
      page: options.page ?? 1,
      perPage: options.perPage ?? data.length,
    };

    if (store) {
      const existing = (await store.read(options.key)) ?? {
        savedAt: new Date().toISOString(),
        posts: [],
        categories: [],
        tags: [],
      };

      await store.write(options.key, {
        ...existing,
        savedAt: new Date().toISOString(),
        posts: data,
        pagination: {
          page: result.page,
          perPage: result.perPage,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    }

    return { data: result, fromSnapshot: false };
  } catch {
    if (!store) throw new Error("WordPress unavailable and no snapshot store configured");

    const snapshot = await store.read(options.key);
    if (!snapshot || snapshot.posts.length === 0) {
      throw new Error("WordPress unavailable and no saved snapshot exists");
    }

    return {
      data: {
        posts: snapshot.posts,
        total: snapshot.pagination?.total ?? snapshot.posts.length,
        totalPages: snapshot.pagination?.totalPages ?? 1,
        page: snapshot.pagination?.page ?? 1,
        perPage: snapshot.pagination?.perPage ?? snapshot.posts.length,
      },
      fromSnapshot: true,
      snapshotMessage: "Showing the latest saved edition.",
    };
  }
}

export async function saveFullSnapshot(snapshot: ContentSnapshot, key = "site"): Promise<void> {
  const store = getSnapshotStore();
  if (!store) return;
  await store.write(key, snapshot);
}

export async function readSnapshot(key = "site"): Promise<ContentSnapshot | null> {
  const store = getSnapshotStore();
  if (!store) return null;
  return store.read(key);
}

export function getSnapshotStoreForScripts(): ContentSnapshotStore | null {
  return getSnapshotStore();
}
