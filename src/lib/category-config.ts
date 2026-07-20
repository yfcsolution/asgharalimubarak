import type { WpCategory } from "@/lib/types";
import { decodeHtml } from "@/lib/utils";

/** Editorial priority order (lower index = higher priority). */
export const CATEGORY_PRIORITY = [
  "breaking-news",
  "pakistan",
  "world",
  "politics",
  "diplomacy",
  "defence",
  "economy",
  "business",
  "education",
  "health",
  "sports",
  "science-technology",
  "environment",
  "law-justice",
  "culture",
  "entertainment",
  "opinion",
  "interviews",
  "photo-stories",
  "columns",
  "blogger-archive",
] as const;

/** Slug aliases for ordering / accent lookup only (does not mutate WordPress data). */
export const CATEGORY_ALIASES: Record<string, string> = {
  diplomatic: "diplomacy",
  coloums: "columns",
  columns: "columns",
  "science-and-technology": "science-technology",
  "science-technology": "science-technology",
  science: "science-technology",
  technology: "science-technology",
  breaking: "breaking-news",
  defense: "defence",
  blogger: "blogger-archive",
  "blogger-archive": "blogger-archive",
};

/** Preferred homepage section order. */
export const HOMEPAGE_SECTION_SLUGS = [
  "breaking-news",
  "pakistan",
  "world",
  "politics",
  "diplomacy",
  "defence",
  "economy",
  "education",
  "health",
  "sports",
  "science-technology",
  "opinion",
  "interviews",
  "photo-stories",
] as const;

/** Preferred desktop primary-nav category order (before More). */
export const PRIMARY_NAV_CATEGORY_SLUGS = [
  "pakistan",
  "world",
  "politics",
  "diplomacy",
  "defence",
  "economy",
  "education",
  "health",
  "sports",
  "science-technology",
  "opinion",
] as const;

export const MAX_PRIMARY_NAV_CATEGORIES = 10;
export const MAX_SIDEBAR_CATEGORIES = 14;
export const CATEGORY_CACHE_SECONDS = 300;

export type CategoryAccent =
  | "breaking"
  | "pakistan"
  | "world"
  | "politics"
  | "diplomacy"
  | "defence"
  | "economy"
  | "education"
  | "health"
  | "sports"
  | "science"
  | "opinion"
  | "default";

const ACCENT_BY_CANONICAL: Record<string, CategoryAccent> = {
  "breaking-news": "breaking",
  pakistan: "pakistan",
  world: "world",
  politics: "politics",
  diplomacy: "diplomacy",
  defence: "defence",
  economy: "economy",
  business: "economy",
  education: "education",
  health: "health",
  sports: "sports",
  "science-technology": "science",
  opinion: "opinion",
  interviews: "opinion",
  columns: "opinion",
};

export function normalizeCategorySlug(slug: string): string {
  const cleaned = slug.trim().toLowerCase();
  return CATEGORY_ALIASES[cleaned] ?? cleaned;
}

export function getCategoryCanonicalSlug(category: Pick<WpCategory, "slug" | "name">): string {
  const fromSlug = normalizeCategorySlug(category.slug);
  if (CATEGORY_PRIORITY.includes(fromSlug as (typeof CATEGORY_PRIORITY)[number])) {
    return fromSlug;
  }
  const fromName = normalizeCategorySlug(
    decodeHtml(category.name).toLowerCase().replace(/\s+/g, "-").replace(/&/g, ""),
  );
  return CATEGORY_ALIASES[fromName] ?? fromSlug;
}

export function getCategoryPriorityIndex(category: Pick<WpCategory, "slug" | "name">): number {
  const canonical = getCategoryCanonicalSlug(category);
  const index = CATEGORY_PRIORITY.indexOf(
    canonical as (typeof CATEGORY_PRIORITY)[number],
  );
  return index === -1 ? CATEGORY_PRIORITY.length + 50 : index;
}

export function getCategoryAccent(category: Pick<WpCategory, "slug" | "name">): CategoryAccent {
  const canonical = getCategoryCanonicalSlug(category);
  return ACCENT_BY_CANONICAL[canonical] ?? "default";
}

export function isValidNavCategory(category: WpCategory): boolean {
  const name = decodeHtml(category.name).trim().toLowerCase();
  const slug = category.slug.trim().toLowerCase();
  if (category.count <= 0) return false;
  if (slug === "uncategorized" || name === "uncategorized") return false;
  if (!name || name === "-" || name.includes("http")) return false;
  return true;
}

export function sortCategoriesEditorially(categories: WpCategory[]): WpCategory[] {
  return [...categories].sort((a, b) => {
    const priorityDiff = getCategoryPriorityIndex(a) - getCategoryPriorityIndex(b);
    if (priorityDiff !== 0) return priorityDiff;
    if (b.count !== a.count) return b.count - a.count;
    return decodeHtml(a.name).localeCompare(decodeHtml(b.name), undefined, {
      sensitivity: "base",
    });
  });
}

export function getHomepageSectionCategories(categories: WpCategory[]): WpCategory[] {
  const sorted = sortCategoriesEditorially(categories.filter(isValidNavCategory));
  const byCanonical = new Map<string, WpCategory>();
  for (const category of sorted) {
    const canonical = getCategoryCanonicalSlug(category);
    if (!byCanonical.has(canonical)) {
      byCanonical.set(canonical, category);
    }
  }

  const featured: WpCategory[] = [];
  const seen = new Set<number>();

  for (const slug of HOMEPAGE_SECTION_SLUGS) {
    const match = byCanonical.get(slug);
    if (match && !seen.has(match.id)) {
      seen.add(match.id);
      featured.push(match);
    }
  }

  return featured;
}

export function splitNavCategories(categories: WpCategory[]): {
  primary: WpCategory[];
  more: WpCategory[];
} {
  const sorted = sortCategoriesEditorially(categories.filter(isValidNavCategory));
  const preferred: WpCategory[] = [];
  const remainder: WpCategory[] = [];
  const used = new Set<number>();

  for (const slug of PRIMARY_NAV_CATEGORY_SLUGS) {
    const match = sorted.find((category) => getCategoryCanonicalSlug(category) === slug);
    if (match && !used.has(match.id)) {
      preferred.push(match);
      used.add(match.id);
    }
  }

  for (const category of sorted) {
    if (!used.has(category.id)) {
      remainder.push(category);
    }
  }

  const primary = preferred.slice(0, MAX_PRIMARY_NAV_CATEGORIES);
  const overflowPreferred = preferred.slice(MAX_PRIMARY_NAV_CATEGORIES);
  return {
    primary,
    more: [...overflowPreferred, ...remainder],
  };
}

export function getCategoryNavLabel(category: Pick<WpCategory, "slug" | "name">): string {
  const canonical = getCategoryCanonicalSlug(category);
  if (canonical === "science-technology") return "Science & Tech";
  return decodeHtml(category.name);
}

export const CATEGORY_DESCRIPTION_FALLBACK =
  "Latest reporting and analysis in this section.";
