import { cache } from "react";

import type { InstagramFeedResult, InstagramMedia } from "@/lib/meta-types";
import { getActiveSocialLinks } from "@/lib/site";

const GRAPH_API = "https://graph.facebook.com/v19.0";
const CACHE_SECONDS = 30 * 60;
const TIMEOUT_MS = 8000;

function getInstagramConfig() {
  return {
    userId: process.env.META_INSTAGRAM_USER_ID?.trim() || "",
    accessToken: process.env.META_INSTAGRAM_ACCESS_TOKEN?.trim() || "",
  };
}

export function isInstagramConfigured(): boolean {
  const { userId, accessToken } = getInstagramConfig();
  return Boolean(userId && accessToken);
}

export function getOfficialInstagramUrl(): string {
  return (
    getActiveSocialLinks().find((link) => link.id === "instagram")?.href ||
    "https://www.instagram.com/Asgharali.Mubarak/"
  );
}

async function graphFetch<T>(path: string, params: Record<string, string>): Promise<T | null> {
  const { accessToken } = getInstagramConfig();
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

export const getInstagramMedia = cache(async function getInstagramMedia(
  limit = 12,
): Promise<InstagramFeedResult> {
  if (!isInstagramConfigured()) {
    return {
      media: [],
      configured: false,
      message:
        "Follow AAM News on the official Instagram account for photos and updates.",
    };
  }

  const { userId } = getInstagramConfig();
  const data = await graphFetch<{
    data?: Array<{
      id?: string;
      caption?: string;
      timestamp?: string;
      permalink?: string;
      media_type?: string;
      media_url?: string;
      thumbnail_url?: string;
    }>;
  }>(`/${userId}/media`, {
    fields: "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp",
    limit: String(limit),
  });

  if (!data) {
    return {
      media: [],
      configured: true,
      message:
        "Follow AAM News on the official Instagram account for photos and updates.",
    };
  }

  const media: InstagramMedia[] = (data.data ?? [])
    .filter((item) => item.id)
    .map((item) => ({
      id: item.id!,
      caption: item.caption?.trim() || "",
      timestamp: item.timestamp || new Date().toISOString(),
      permalink: item.permalink || getOfficialInstagramUrl(),
      mediaType: item.media_type || "IMAGE",
      mediaUrl: item.media_url,
      thumbnailUrl: item.thumbnail_url || item.media_url,
    }));

  return { media, configured: true };
});
