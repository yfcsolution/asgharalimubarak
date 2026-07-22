import type { Metadata } from "next";
import Link from "next/link";

import { CATEGORY_DESCRIPTION_FALLBACK } from "@/lib/category-config";
import { getSiteUrl } from "@/lib/site";
import { categoryPath, decodeHtml } from "@/lib/utils";
import { getNavCategories } from "@/lib/wordpress";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "News Sections",
  description:
    "Browse all AAM News sections and categories covering politics, sports and public affairs.",
  alternates: { canonical: `${getSiteUrl()}/categories` },
  openGraph: {
    title: "News Sections | Asghar Ali Mubarak",
    description:
      "Browse all AAM News sections and categories covering politics, sports and public affairs.",
    url: `${getSiteUrl()}/categories`,
  },
};

export default async function CategoriesPage() {
  const categories = await getNavCategories();

  return (
    <div className="page-shell media-page">
      <header className="page-hero">
        <h1>News Sections</h1>
        <p lang="ur" dir="rtl">
          خبری شعبے
        </p>
        <p>Every current non-empty WordPress category from the newsroom.</p>
      </header>

      {categories.length === 0 ? (
        <p className="empty-state">No categories are available right now.</p>
      ) : (
        <ul className="categories-directory">
          {categories.map((category) => (
            <li key={category.id}>
              <Link href={categoryPath(category.slug)} className="categories-directory-card">
                <span className="about-coverage-accent" aria-hidden="true" />
                <span className="categories-directory-name" dir="auto">
                  {decodeHtml(category.name)}
                </span>
                <span className="categories-directory-count">
                  {category.count} {category.count === 1 ? "story" : "stories"}
                </span>
                <span className="categories-directory-desc">
                  {decodeHtml(category.description || "") ||
                    CATEGORY_DESCRIPTION_FALLBACK}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
