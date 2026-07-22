import type { MetadataRoute } from "next";

import { getCategoryCanonicalSlug } from "@/lib/category-config";
import { getSiteUrl } from "@/lib/site";
import { normalizeSlug, postPath } from "@/lib/utils";
import { getNavCategories, getPosts } from "@/lib/wordpress";
import { getAllYouTubeVideos, isYouTubeConfigured } from "@/lib/youtube";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [categories, page1, page2] = await Promise.all([
    getNavCategories(),
    getPosts({ page: 1, perPage: 100, mode: "sitemap" }),
    getPosts({ page: 2, perPage: 100, mode: "sitemap" }),
  ]);

  const posts = [...page1.posts, ...page2.posts];
  const bloggerArchive = categories.find(
    (category) => getCategoryCanonicalSlug(category) === "blogger-archive",
  );

  const entries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${siteUrl}/latest`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/videos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/facebook`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/instagram`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    ...categories.map((category) => ({
      url: `${siteUrl}/category/${encodeURIComponent(normalizeSlug(category.slug))}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...posts.map((post) => ({
      url: `${siteUrl}${postPath(post.slug)}`,
      lastModified: new Date(post.modified || post.date),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];

  if (bloggerArchive) {
    entries.push({
      url: `${siteUrl}/blogger`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    });
  }

  if (isYouTubeConfigured()) {
    const videos = await getAllYouTubeVideos({ maxResults: 25 });
    for (const video of videos.videos) {
      entries.push({
        url: `${siteUrl}/videos/${video.id}`,
        lastModified: new Date(video.publishedAt),
        changeFrequency: "weekly",
        priority: 0.55,
      });
    }
  }

  return entries;
}
