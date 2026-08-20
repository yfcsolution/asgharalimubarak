import { PRODUCTION_SITE_URL, PUBLISHER_NAME, absoluteUrl } from "@/lib/seo";
import { displayTitleForPost, postPath } from "@/lib/utils";
import { getPosts } from "@/lib/wordpress";

export const dynamic = "force-dynamic";
export const revalidate = 300;

function origin(): string {
  if (
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production"
  ) {
    return PRODUCTION_SITE_URL;
  }
  return absoluteUrl();
}

/** Google News sitemap — recent articles with real WordPress dates. */
export async function GET() {
  let posts: Awaited<ReturnType<typeof getPosts>>["posts"] = [];
  try {
    const feed = await getPosts({ page: 1, perPage: 50, mode: "sitemap" });
    posts = Array.isArray(feed.posts) ? feed.posts : [];
  } catch {
    posts = [];
  }

  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let recent = posts.filter((post) => {
    const published = Date.parse(post.date);
    return Number.isFinite(published) && published >= cutoff;
  });

  if (recent.length === 0) {
    recent = posts.slice(0, 20);
  }

  const base = origin();
  const urls = recent
    .map((post) => {
      const slug = post.slug?.trim();
      if (!slug) return "";
      const title = displayTitleForPost(post);
      const headline = (title.text || post.title?.rendered || "").trim();
      if (!headline) return "";
      const loc = `${base}${postPath(slug)}`;
      const publicationDate = new Date(post.date).toISOString();

      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(PUBLISHER_NAME)}</news:name>
        <news:language>${title.lang === "ur" ? "ur" : "en"}</news:language>
      </news:publication>
      <news:publication_date>${publicationDate}</news:publication_date>
      <news:title>${escapeXml(headline)}</news:title>
    </news:news>
  </url>`;
    })
    .filter(Boolean)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
