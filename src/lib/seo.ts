import {
  AUTHOR_HEADER_PHOTO,
  DEFAULT_OG_IMAGE,
  LINKEDIN_PROFILE_URL,
  PRODUCTION_SITE_URL,
  SITE_NAME,
  SITE_NAME_UR,
  X_PROFILE_URL,
  getActiveSocialLinks,
  getSiteUrl,
} from "@/lib/site";

export { PRODUCTION_SITE_URL, LINKEDIN_PROFILE_URL, X_PROFILE_URL };

export const ORGANIZATION_NAME = "Asghar Ali Mubarak / AAM News";
export const WEBSITE_NAME = "Asghar Ali Mubarak - AAM News";
export const PUBLISHER_NAME = "AAM News";

export const ORGANIZATION_DESCRIPTION =
  "Asghar Ali Mubarak (AAM News) is an independent Pakistani bilingual digital news platform providing factual and timely news in English and Urdu across Pakistan, politics, sports, economy, diplomacy, defence, health, education, science and technology, and other public affairs.";

export const HOMEPAGE_TITLE =
  "Asghar Ali Mubarak - AAM News | Pakistan & World News";

export const HOMEPAGE_DESCRIPTION =
  "Asghar Ali Mubarak (AAM News) is an independent Pakistani bilingual news platform providing timely English and Urdu news on Pakistan, politics, sports, economy, diplomacy, defence, health and public affairs.";

/** Square/brand mark for Organization/publisher logo. */
export const PUBLISHER_LOGO_PATH = "/images/brand/aam-news-logo.png";

/** Absolute URL for SEO/canonical/schema. Prefer production domain on Vercel production. */
export function getCanonicalSiteUrl(): string {
  if (process.env.VERCEL_ENV === "production") {
    return PRODUCTION_SITE_URL;
  }
  return getSiteUrl();
}

export function absoluteUrl(path = "/"): string {
  const base = getCanonicalSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function truncateMetaDescription(text: string, max = 160): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  const sliced = cleaned.slice(0, max - 1);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${(lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced).trim()}…`;
}

export function categorySeoTitle(categoryName: string, page = 1): string {
  if (page > 1) {
    return `${categoryName} News — Page ${page} | AAM News`;
  }
  return `${categoryName} News | AAM News - Asghar Ali Mubarak`;
}

export function getSameAsLinks(): string[] {
  const fromConfig = getActiveSocialLinks().map((link) => link.href);
  const required = [X_PROFILE_URL, LINKEDIN_PROFILE_URL];
  return Array.from(new Set([...required, ...fromConfig]));
}

export function organizationJsonLd() {
  const siteUrl = getCanonicalSiteUrl();
  return {
    "@type": "NewsMediaOrganization",
    "@id": `${siteUrl}/#organization`,
    name: ORGANIZATION_NAME,
    alternateName: [PUBLISHER_NAME, SITE_NAME, SITE_NAME_UR],
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(PUBLISHER_LOGO_PATH),
      width: 512,
      height: 512,
    },
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    description: ORGANIZATION_DESCRIPTION,
    sameAs: getSameAsLinks(),
    foundingLocation: {
      "@type": "Place",
      name: "Pakistan",
    },
  };
}

export function personJsonLd(options?: {
  description?: string;
  jobTitle?: string;
}) {
  const siteUrl = getCanonicalSiteUrl();
  return {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: SITE_NAME,
    alternateName: SITE_NAME_UR,
    url: absoluteUrl("/about-contact"),
    image: absoluteUrl(AUTHOR_HEADER_PHOTO),
    jobTitle: options?.jobTitle ?? "Journalist and Editor",
    description: options?.description,
    worksFor: { "@id": `${siteUrl}/#organization` },
    sameAs: getSameAsLinks(),
  };
}

export function websiteJsonLd() {
  const siteUrl = getCanonicalSiteUrl();
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: WEBSITE_NAME,
    url: siteUrl,
    description: ORGANIZATION_DESCRIPTION,
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: ["en", "ur"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path.startsWith("http") ? item.path : absoluteUrl(item.path),
    })),
  };
}

export function toJsonLdGraph(nodes: Record<string, unknown>[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
