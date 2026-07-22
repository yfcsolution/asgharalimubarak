import { cache } from "react";

import type { FacebookFeedResult, FacebookPost } from "@/lib/meta-types";
import { getActiveSocialLinks } from "@/lib/site";

const GRAPH_API = "https://graph.facebook.com/v19.0";
const CACHE_SECONDS = 30 * 60;
const TIMEOUT_MS = 8000;

function getFacebookConfig() {
  return {
    pageId: process.env.META_FACEBOOK_PAGE_ID?.trim() || "",
    accessToken: process.env.META_FACEBOOK_PAGE_ACCESS_TOKEN?.trim() || "",
  };
}

export function isFacebookConfigured(): boolean {
  const { pageId, accessToken } = getFacebookConfig();
  return Boolean(pageId && accessToken);
}

export function getOfficialFacebookUrl(): string {
  return (
    getActiveSocialLinks().find((link) => link.id === "facebook")?.href ||
    "https://www.facebook.com/Asgharali.Mubarak/"
  );
}

async function graphFetch<T>(path: string, params: Record<string, string>): Promise<T | null> {
  const { accessToken } = getFacebookConfig();
  if (!accessToken) return null;

  const url = new URL(`${GRAPH_API}${path}`);
  url.searchParams.set("access_token", accessToken);
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: CACHE_SECONDS },
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timer);
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

export const getFacebookPosts = cache(async function getFacebookPosts(
  limit = 12,
): Promise<FacebookFeedResult> {
  if (!isFacebookConfigured()) {
    return {
      posts: [],
      configured: false,
      message:
        "Follow AAM News on the official Facebook page for updates and public posts.",
    };
  }

  const { pageId } = getFacebookConfig();
  const data = await graphFetch<{
    data?: Array<{
      id?: string;
      message?: string;
      created_time?: string;
      permalink_url?: string;
      full_picture?: string;
    }>;
  }>(`/${pageId}/posts`, {
    fields: "id,message,created_time,permalink_url,full_picture",
    limit: String(limit),
  });

  if (!data) {
    return {
      posts: [],
      configured: true,
      message:
        "Follow AAM News on the official Facebook page for updates and public posts.",
    };
  }

  const posts: FacebookPost[] = (data.data ?? [])
    .filter((item) => item.id)
    .map((item) => ({
      id: item.id!,
      message: item.message?.trim() || "",
      createdAt: item.created_time || new Date().toISOString(),
      permalink: item.permalink_url || getOfficialFacebookUrl(),
      imageUrl: item.full_picture,
    }));

  return { posts, configured: true };
});
