import { cache } from "react";

import { YOUTUBE_CHANNEL_URL } from "@/lib/site";
import type {
  YouTubeChannel,
  YouTubeVideo,
  YouTubeVideoPage,
} from "@/lib/youtube-types";

const YOUTUBE_API = "https://www.googleapis.com/youtube/v3";
const CACHE_SECONDS = 30 * 60;
const TIMEOUT_MS = 8000;

export { YOUTUBE_CHANNEL_URL };

function getYouTubeConfig() {
  return {
    apiKey: process.env.YOUTUBE_API_KEY?.trim() || "",
    channelId: process.env.YOUTUBE_CHANNEL_ID?.trim() || "",
    uploadsPlaylistId: process.env.YOUTUBE_UPLOADS_PLAYLIST_ID?.trim() || "",
  };
}

export function isYouTubeConfigured(): boolean {
  const { apiKey, channelId, uploadsPlaylistId } = getYouTubeConfig();
  return Boolean(apiKey && (channelId || uploadsPlaylistId));
}

async function youtubeFetch<T>(
  path: string,
  params: Record<string, string>,
): Promise<T | null> {
  const { apiKey } = getYouTubeConfig();
  if (!apiKey) return null;

  const url = new URL(`${YOUTUBE_API}${path}`);
  url.searchParams.set("key", apiKey);
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

type PlaylistItemsResponse = {
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo?: { totalResults?: number };
  items?: Array<{
    contentDetails?: { videoId?: string };
    snippet?: {
      title?: string;
      description?: string;
      publishedAt?: string;
      resourceId?: { videoId?: string };
      thumbnails?: Record<
        string,
        { url?: string; width?: number; height?: number }
      >;
    };
  }>;
};

function mapFromSnippet(
  id: string,
  snippet:
    | {
        title?: string;
        description?: string;
        publishedAt?: string;
        thumbnails?: Record<
          string,
          { url?: string; width?: number; height?: number }
        >;
      }
    | undefined,
): YouTubeVideo {
  const thumbs = snippet?.thumbnails ?? {};
  const thumb =
    thumbs.maxres ||
    thumbs.standard ||
    thumbs.high ||
    thumbs.medium ||
    thumbs.default;
  return {
    id,
    title: snippet?.title?.trim() || "Untitled video",
    description: snippet?.description?.trim() || "",
    publishedAt: snippet?.publishedAt || new Date().toISOString(),
    thumbnail: thumb?.url
      ? { url: thumb.url, width: thumb.width, height: thumb.height }
      : null,
    url: `https://www.youtube.com/watch?v=${id}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
  };
}

function mapPlaylistItem(
  item: NonNullable<PlaylistItemsResponse["items"]>[number],
): YouTubeVideo | null {
  const id =
    item.contentDetails?.videoId || item.snippet?.resourceId?.videoId || "";
  if (!id) return null;
  return mapFromSnippet(id, item.snippet);
}

export const getYouTubeChannel = cache(async function getYouTubeChannel(): Promise<YouTubeChannel | null> {
  const { channelId } = getYouTubeConfig();
  if (!isYouTubeConfigured() || !channelId) return null;

  const data = await youtubeFetch<{
    items?: Array<{
      id?: string;
      snippet?: { title?: string; description?: string; customUrl?: string };
      contentDetails?: { relatedPlaylists?: { uploads?: string } };
    }>;
  }>("/channels", {
    part: "snippet,contentDetails",
    id: channelId,
  });

  const item = data?.items?.[0];
  if (!item?.id) return null;

  return {
    id: item.id,
    title: item.snippet?.title || "AAM News",
    description: item.snippet?.description || "",
    customUrl: item.snippet?.customUrl,
    uploadsPlaylistId: item.contentDetails?.relatedPlaylists?.uploads,
  };
});

export const getYouTubeUploadsPlaylist = cache(
  async function getYouTubeUploadsPlaylist(): Promise<string | null> {
    const { uploadsPlaylistId } = getYouTubeConfig();
    if (uploadsPlaylistId) return uploadsPlaylistId;
    const channel = await getYouTubeChannel();
    return channel?.uploadsPlaylistId ?? null;
  },
);

async function fetchPlaylistVideos(options: {
  maxResults?: number;
  pageToken?: string;
}): Promise<YouTubeVideoPage> {
  if (!isYouTubeConfigured()) {
    return {
      videos: [],
      configured: false,
      message:
        "Latest videos are available on the official AAM News YouTube channel.",
    };
  }

  const playlistId = await getYouTubeUploadsPlaylist();
  if (!playlistId) {
    return {
      videos: [],
      configured: false,
      message:
        "Latest videos are available on the official AAM News YouTube channel.",
    };
  }

  const data = await youtubeFetch<PlaylistItemsResponse>("/playlistItems", {
    part: "snippet,contentDetails",
    playlistId,
    maxResults: String(options.maxResults ?? 12),
    pageToken: options.pageToken ?? "",
  });

  if (!data) {
    return {
      videos: [],
      configured: true,
      message:
        "Latest videos are available on the official AAM News YouTube channel.",
    };
  }

  const videos = (data.items ?? [])
    .map(mapPlaylistItem)
    .filter((video): video is YouTubeVideo => Boolean(video));

  return {
    videos,
    nextPageToken: data.nextPageToken,
    prevPageToken: data.prevPageToken,
    totalResults: data.pageInfo?.totalResults,
    configured: true,
  };
}

export const getLatestYouTubeVideos = cache(
  async function getLatestYouTubeVideos(limit = 4): Promise<YouTubeVideo[]> {
    const page = await fetchPlaylistVideos({ maxResults: limit });
    return page.videos.slice(0, limit);
  },
);

export async function getAllYouTubeVideos(
  options: {
    maxResults?: number;
    pageToken?: string;
  } = {},
): Promise<YouTubeVideoPage> {
  return fetchPlaylistVideos(options);
}

export async function searchYouTubeVideos(
  query: string,
  maxResults = 12,
): Promise<YouTubeVideo[]> {
  const { channelId } = getYouTubeConfig();
  if (!isYouTubeConfigured() || !channelId || !query.trim()) return [];

  const data = await youtubeFetch<{
    items?: Array<{ id?: { videoId?: string } }>;
  }>("/search", {
    part: "snippet",
    channelId,
    q: query.trim(),
    type: "video",
    order: "date",
    maxResults: String(maxResults),
  });

  const ids = (data?.items ?? [])
    .map((item) => item.id?.videoId)
    .filter((id): id is string => Boolean(id));

  if (ids.length === 0) return [];

  const details = await youtubeFetch<{
    items?: Array<{
      id?: string;
      snippet?: {
        title?: string;
        description?: string;
        publishedAt?: string;
        thumbnails?: Record<
          string,
          { url?: string; width?: number; height?: number }
        >;
      };
    }>;
  }>("/videos", {
    part: "snippet",
    id: ids.join(","),
  });

  return (details?.items ?? [])
    .map((item) => (item.id ? mapFromSnippet(item.id, item.snippet) : null))
    .filter((video): video is YouTubeVideo => Boolean(video));
}

export async function getYouTubeVideoById(
  videoId: string,
): Promise<YouTubeVideo | null> {
  if (!isYouTubeConfigured() || !videoId) return null;

  const details = await youtubeFetch<{
    items?: Array<{
      id?: string;
      snippet?: {
        title?: string;
        description?: string;
        publishedAt?: string;
        thumbnails?: Record<
          string,
          { url?: string; width?: number; height?: number }
        >;
      };
    }>;
  }>("/videos", {
    part: "snippet",
    id: videoId,
  });

  const item = details?.items?.[0];
  if (!item?.id) return null;
  return mapFromSnippet(item.id, item.snippet);
}
