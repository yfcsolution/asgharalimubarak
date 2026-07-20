import Link from "next/link";

import { getCategoryCanonicalSlug } from "@/lib/category-config";
import type { WpCategory } from "@/lib/types";
import { categoryPath, decodeHtml } from "@/lib/utils";

type CategoryStripProps = {
  categories: WpCategory[];
};

const SYMBOLS: Record<string, string> = {
  "breaking-news": "!",
  pakistan: "PK",
  world: "W",
  politics: "P",
  diplomacy: "D",
  defence: "Df",
  economy: "E",
  education: "Ed",
  health: "H",
  sports: "S",
  "science-technology": "ST",
  opinion: "O",
};

export function CategoryStrip({ categories }: CategoryStripProps) {
  if (categories.length === 0) return null;

  return (
    <section className="category-strip section" aria-labelledby="category-strip-heading">
      <div className="section-heading">
        <div>
          <h2 id="category-strip-heading">Sections</h2>
          <p>Browse reporting by topic.</p>
        </div>
      </div>
      <ul className="category-strip-grid">
        {categories.map((category) => {
          const canonical = getCategoryCanonicalSlug(category);
          const symbol = SYMBOLS[canonical] ?? decodeHtml(category.name).slice(0, 1).toUpperCase();
          return (
            <li key={category.id}>
              <Link href={categoryPath(category.slug)} className="category-strip-card" dir="auto">
                <span className="category-strip-symbol" aria-hidden="true">
                  {symbol}
                </span>
                <span className="category-strip-name">{decodeHtml(category.name)}</span>
                <span className="category-strip-count">{category.count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
