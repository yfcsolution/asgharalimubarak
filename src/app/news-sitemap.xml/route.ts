import { absoluteUrl, PUBLISHER_NAME } from "@/lib/seo";
import { displayTitleForPost, postPath } from "@/lib/utils";
import { getPosts } from "@/lib/wordpress";

export const revalidate = 300;

/** Google News sitemap — recent articles only (last 48 hours). */
export async function GET() {
  const feed = await getPosts({ page: 1, perPage: 50, mode: "sitemap" });
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;

  const recent = feed.posts.filter((post) => {
    const published = new Date(post.date).getTime();
    return Number.isFinite(published) && published >= cutoff;
  });

  const urls = recent
    .map((post) => {
      const rawTitle = post.title?.rendered || "";
      if (!rawTitle) return null;
      const title = displayTitleForPost(post);
      const loc = absoluteUrl(postPath(post.slug));
      const publicationDate = new Date(post.date).toISOString();
      const safeTitle = escapeXml(title.text);

      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(PUBLISHER_NAME)}</news:name>
        <news:language>${title.lang === "ur" ? "ur" : "en"}</news:language>
      </news:publication>
      <news:publication_date>${publicationDate}</news:publication_date>
      <news:title>${safeTitle}</news:title>
    </news:news>
  </url>`;
    })
    .filter(Boolean)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
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
