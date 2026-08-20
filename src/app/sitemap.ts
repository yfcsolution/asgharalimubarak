import type { MetadataRoute } from "next";

import { getCategoryCanonicalSlug } from "@/lib/category-config";
import { absoluteUrl } from "@/lib/seo";
import { normalizeSlug, postPath } from "@/lib/utils";
import { getNavCategories, getPosts } from "@/lib/wordpress";
import { getAllYouTubeVideos, isYouTubeConfigured } from "@/lib/youtube";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, page1, page2] = await Promise.all([
    getNavCategories(),
    getPosts({ page: 1, perPage: 100, mode: "sitemap" }),
    getPosts({ page: 2, perPage: 100, mode: "sitemap" }),
  ]);

  const posts = [...page1.posts, ...page2.posts];
  const bloggerArchive = categories.find(
    (category) => getCategoryCanonicalSlug(category) === "blogger-archive",
  );

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl(), lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
    { url: absoluteUrl("/latest"), lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: absoluteUrl("/about-contact"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/about"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/videos"), lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: absoluteUrl("/facebook"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: absoluteUrl("/instagram"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: absoluteUrl("/categories"), lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: absoluteUrl("/editorial-policy"), lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/privacy-policy"), lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms-of-use"), lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/cookie-policy"), lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const entries: MetadataRoute.Sitemap = [
    ...staticPages,
    ...categories
      .filter((category) => category.count > 0)
      .map((category) => ({
        url: absoluteUrl(
          `/category/${encodeURIComponent(normalizeSlug(category.slug))}`,
        ),
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.7,
      })),
    ...posts.map((post) => ({
      url: absoluteUrl(postPath(post.slug)),
      lastModified: new Date(post.modified || post.date),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];

  if (bloggerArchive) {
    entries.push({
      url: absoluteUrl("/blogger"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    });
  }

  if (isYouTubeConfigured()) {
    const videos = await getAllYouTubeVideos({ maxResults: 25 });
    for (const video of videos.videos) {
      entries.push({
        url: absoluteUrl(`/videos/${video.id}`),
        lastModified: new Date(video.publishedAt),
        changeFrequency: "weekly",
        priority: 0.55,
      });
    }
  }

  return entries;
}
