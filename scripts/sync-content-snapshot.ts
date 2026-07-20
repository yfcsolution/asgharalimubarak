#!/usr/bin/env npx tsx
/**
 * Sync WordPress content into the local snapshot store.
 * Schedule every 30–60 minutes via Vercel Cron or GitHub Actions in production.
 */

import { getWordPressApiUrl, POSTS_PER_PAGE } from "../src/lib/site";
import { saveFullSnapshot } from "../src/lib/content-repository";
import type { WpCategory, WpPost, WpTag } from "../src/lib/types";

async function wpFetch<T>(endpoint: string): Promise<T> {
  const base = getWordPressApiUrl();
  const response = await fetch(`${base}${endpoint}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`WordPress API error ${response.status} for ${endpoint}`);
  }
  return response.json() as Promise<T>;
}

async function main() {
  const [posts, categories, tags] = await Promise.all([
    wpFetch<WpPost[]>(`/posts?status=publish&per_page=${POSTS_PER_PAGE}&page=1&_embed=true`),
    wpFetch<WpCategory[]>("/categories?per_page=100&hide_empty=true"),
    wpFetch<WpTag[]>("/tags?per_page=20&hide_empty=true"),
  ]);

  await saveFullSnapshot(
    {
      savedAt: new Date().toISOString(),
      posts,
      categories,
      tags,
      pagination: {
        page: 1,
        perPage: POSTS_PER_PAGE,
        total: posts.length,
        totalPages: 1,
      },
    },
    "site",
  );

  console.log(`Saved snapshot with ${posts.length} posts at ${new Date().toISOString()}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
