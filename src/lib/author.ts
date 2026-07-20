import { cache } from "react";
import { access } from "fs/promises";
import path from "path";

import { AUTHOR_LOCAL_PHOTO, SITE_NAME } from "@/lib/site";
import type { AuthorProfile, WpAuthor, WpPost } from "@/lib/types";
import { decodeHtml } from "@/lib/utils";
import { getPosts } from "@/lib/wordpress";

async function localAuthorPhotoExists(): Promise<boolean> {
  try {
    await access(
      path.join(process.cwd(), "public", "images", "asghar-ali-mubarak-original.jpg"),
    );
    return true;
  } catch {
    try {
      await access(
        path.join(process.cwd(), "public", "images", "asghar-ali-mubarak.jpg"),
      );
      return true;
    } catch {
      return false;
    }
  }
}

export function enlargeAvatarUrl(
  url: string | undefined,
  size = 512,
): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("s", String(size));
    return parsed.toString();
  } catch {
    return url;
  }
}

export function shortAuthorBio(description: string, maxLength = 220): string {
  const text = decodeHtml(description).replace(/\s+/g, " ").trim();
  if (!text) {
    return `${SITE_NAME} is a bilingual journalist covering politics, sports, diplomacy, and current affairs.`;
  }
  const chars = Array.from(text);
  if (chars.length <= maxLength) return text;
  return `${chars.slice(0, maxLength).join("").trimEnd()}…`;
}

export function authorFromEmbedded(
  author: WpAuthor | undefined,
): Omit<AuthorProfile, "localPhotoAvailable"> | null {
  if (!author) return null;
  const largest =
    author.avatar_urls?.["96"] ||
    author.avatar_urls?.["48"] ||
    author.avatar_urls?.["24"];

  return {
    id: author.id,
    name: author.name || SITE_NAME,
    description: author.description || "",
    shortBio: shortAuthorBio(author.description || ""),
    avatarUrl: enlargeAvatarUrl(largest),
  };
}

export const getSiteAuthor = cache(async function getSiteAuthor(): Promise<AuthorProfile> {
  const localPhotoAvailable = await localAuthorPhotoExists();
  const { posts } = await getPosts({ page: 1, perPage: 1 });
  const embedded = authorFromEmbedded(posts[0]?._embedded?.author?.[0]);

  return {
    id: embedded?.id ?? 0,
    name: embedded?.name ?? SITE_NAME,
    description: embedded?.description ?? "",
    shortBio: embedded?.shortBio ?? shortAuthorBio(""),
    avatarUrl: embedded?.avatarUrl ?? null,
    localPhotoAvailable,
  };
});

export function resolveAuthorPhoto(author: AuthorProfile): {
  src: string;
  alt: string;
  isLocal: boolean;
} | null {
  if (author.localPhotoAvailable) {
    return {
      src: AUTHOR_LOCAL_PHOTO,
      alt: `${author.name} portrait`,
      isLocal: true,
    };
  }
  if (author.avatarUrl) {
    return {
      src: author.avatarUrl,
      alt: `${author.name} portrait`,
      isLocal: false,
    };
  }
  return null;
}

export function getPostAuthor(post: WpPost): WpAuthor | undefined {
  return post._embedded?.author?.[0];
}
