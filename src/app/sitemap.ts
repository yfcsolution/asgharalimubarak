import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";
import { normalizeSlug, postPath } from "@/lib/utils";
import { getCategories, getPosts } from "@/lib/wordpress";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [categories, page1, page2] = await Promise.all([
    getCategories(),
    getPosts({ page: 1, perPage: 100 }),
    getPosts({ page: 2, perPage: 100 }),
  ]);

  const posts = [...page1.posts, ...page2.posts];

  return [
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
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
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
}
