import type { MetadataRoute } from "next";

import { PRODUCTION_SITE_URL, absoluteUrl } from "@/lib/seo";

function publicOrigin(): string {
  if (
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production"
  ) {
    return PRODUCTION_SITE_URL;
  }
  return absoluteUrl();
}

export default function robots(): MetadataRoute.Robots {
  const origin = publicOrigin();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: [`${origin}/sitemap.xml`, `${origin}/news-sitemap.xml`],
    host: origin,
  };
}
