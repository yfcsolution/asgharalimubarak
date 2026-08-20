import Link from "next/link";

import { getNavCategories } from "@/lib/wordpress";
import { categoryPath, decodeHtml } from "@/lib/utils";

export default async function NotFound() {
  let categories: Awaited<ReturnType<typeof getNavCategories>> = [];
  try {
    categories = (await getNavCategories()).filter((c) => c.count > 0).slice(0, 8);
  } catch {
    categories = [];
  }

  return (
    <div className="page-shell status-page">
      <p className="section-kicker">AAM News</p>
      <h1>Page not found</h1>
      <p lang="ur" dir="rtl">
        صفحہ نہیں ملا
      </p>
      <p>
        The story or page you requested is unavailable. It may have been moved
        or unpublished.
      </p>

      <form className="masthead-search page-search" action="/search" method="get" role="search">
        <label className="sr-only" htmlFor="not-found-search">
          Search news
        </label>
        <input
          id="not-found-search"
          name="q"
          type="search"
          placeholder="Search news"
          autoComplete="off"
        />
        <button type="submit">Search</button>
      </form>

      <div className="lead-cta" style={{ justifyContent: "center" }}>
        <Link href="/" className="btn-primary">
          Go to homepage
        </Link>
        <Link href="/latest" className="section-link">
          Browse latest news
        </Link>
        <Link href="/about-contact" className="section-link">
          About &amp; Contact
        </Link>
      </div>

      {categories.length > 0 ? (
        <nav aria-label="Popular categories" className="section" style={{ marginTop: "1.5rem" }}>
          <h2 className="sidebar-heading">Popular categories</h2>
          <ul className="section-chip-row">
            {categories.map((category) => (
              <li key={category.id}>
                <Link href={categoryPath(category.slug)} className="section-chip" dir="auto">
                  {decodeHtml(category.name)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
