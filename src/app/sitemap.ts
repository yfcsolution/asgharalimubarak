import type { MetadataRoute } from "next";

import { getCategoryCanonicalSlug } from "@/lib/category-config";
import { absoluteUrl, PRODUCTION_SITE_URL } from "@/lib/seo";
import { normalizeSlug, postPath } from "@/lib/utils";
import { getNavCategories, getPosts } from "@/lib/wordpress";
import { getAllYouTubeVideos, isYouTubeConfigured } from "@/lib/youtube";
import type { PaginatedPosts } from "@/lib/types";

export const revalidate = 300;

async function safePosts(
  page: number,
  perPage: number,
): Promise<PaginatedPosts> {
  try {
    return await getPosts({ page, perPage, mode: "sitemap" });
  } catch {
    return {
      posts: [],
      total: 0,
      totalPages: 0,
      page,
      perPage,
      fromSnapshot: true,
      feedUnavailable: true,
    };
  }
}

/** Prefer production host in sitemap loc entries (never localhost / preview). */
function sitemapUrl(path = "/"): string {
  if (process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production") {
    if (!path || path === "/") return PRODUCTION_SITE_URL;
    return `${PRODUCTION_SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  }
  return absoluteUrl(path);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, page1, page2] = await Promise.all([
    getNavCategories().catch(() => []),
    safePosts(1, 100),
    safePosts(2, 100),
  ]);

  const posts = [...page1.posts, ...page2.posts].filter(
    (post, index, list) => list.findIndex((p) => p.id === post.id) === index,
  );

  const bloggerArchive = categories.find(
    (category) => getCategoryCanonicalSlug(category) === "blogger-archive",
  );

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: sitemapUrl(), lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: sitemapUrl("/latest"), lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: sitemapUrl("/about-contact"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: sitemapUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: sitemapUrl("/videos"), lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: sitemapUrl("/facebook"), lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: sitemapUrl("/instagram"), lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: sitemapUrl("/categories"), lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: sitemapUrl("/editorial-policy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: sitemapUrl("/privacy-policy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: sitemapUrl("/terms-of-use"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: sitemapUrl("/cookie-policy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const entries: MetadataRoute.Sitemap = [
    ...staticPages,
    ...categories
      .filter((category) => category.count > 0)
      .map((category) => ({
        url: sitemapUrl(
          `/category/${encodeURIComponent(normalizeSlug(category.slug))}`,
        ),
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.7,
      })),
    ...posts.map((post) => ({
      url: sitemapUrl(postPath(post.slug)),
      lastModified: new Date(post.modified || post.date),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];

  if (bloggerArchive) {
    entries.push({
      url: sitemapUrl("/blogger"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    });
  }

  if (isYouTubeConfigured()) {
    try {
      const videos = await getAllYouTubeVideos({ maxResults: 25 });
      for (const video of videos.videos) {
        entries.push({
          url: sitemapUrl(`/videos/${video.id}`),
          lastModified: new Date(video.publishedAt),
          changeFrequency: "weekly",
          priority: 0.55,
        });
      }
    } catch {
      // Skip videos if YouTube is temporarily unavailable.
    }
  }

  return entries;
}
