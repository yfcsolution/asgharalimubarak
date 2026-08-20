import Image from "next/image";
import Link from "next/link";

import { SocialLinksList } from "@/components/SocialIcons";
import {
  FOOTER_DESCRIPTION_EN,
} from "@/lib/about-content";
import { getCategoryCanonicalSlug } from "@/lib/category-config";
import {
  AUTHOR_AVATAR_PHOTO,
  DEVELOPER_CREDIT,
  HEADER_PORTRAIT_ALT,
  SITE_NAME,
  getActiveSocialLinks,
} from "@/lib/site";
import { categoryPath } from "@/lib/utils";
import { getNavCategories } from "@/lib/wordpress";

const FOOTER_NEWS_SLUGS = [
  "pakistan",
  "world",
  "politics",
  "diplomacy",
  "defence",
  "sports",
  "health",
  "business",
  "economy",
  "science-technology",
  "opinion",
] as const;

const FOOTER_NEWS_LABELS: Record<(typeof FOOTER_NEWS_SLUGS)[number], string> = {
  pakistan: "Pakistan",
  world: "World",
  politics: "Politics",
  diplomacy: "Diplomacy",
  defence: "Defence",
  sports: "Sports",
  health: "Health",
  business: "Business",
  economy: "Economy",
  "science-technology": "Science & Technology",
  opinion: "Opinion",
};

export async function Footer() {
  const year = new Date().getFullYear();
  const socialLinks = getActiveSocialLinks();
  const categories = await getNavCategories();

  const newsLinks = FOOTER_NEWS_SLUGS.flatMap((slug) => {
    const match = categories.find(
      (category) => getCategoryCanonicalSlug(category) === slug,
    );
    if (!match || match.count <= 0) return [];
    return [
      {
        href: categoryPath(match.slug),
        label: FOOTER_NEWS_LABELS[slug],
      },
    ];
  });

  return (
    <footer className="site-footer">
      <div className="footer-inner footer-grid footer-grid-newsroom">
        <div className="footer-brand">
          <Link href="/" className="footer-logo-link" aria-label="Go to AAM News homepage">
            <Image
              src={AUTHOR_AVATAR_PHOTO}
              alt={HEADER_PORTRAIT_ALT}
              width={72}
              height={72}
              className="footer-logo"
            />
          </Link>
          <p className="footer-eyebrow">AAM NEWS</p>
          <p className="footer-title">{SITE_NAME}</p>
          <p className="footer-copy">{FOOTER_DESCRIPTION_EN}</p>
          <SocialLinksList links={socialLinks} className="footer-social" />
        </div>

        <nav aria-label="News sections">
          <p className="footer-eyebrow">News</p>
          <ul className="footer-links footer-links-stack">
            {newsLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/latest">Latest News</Link>
            </li>
            <li>
              <Link href="/categories">All Categories</Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="About and contact">
          <p className="footer-eyebrow">About &amp; Contact</p>
          <ul className="footer-links footer-links-stack">
            <li>
              <Link href="/about-contact">About AAM News</Link>
            </li>
            <li>
              <Link href="/about-contact#contact">Contact Us</Link>
            </li>
            <li>
              <Link href="/editorial-policy">Editorial Policy</Link>
            </li>
            <li>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms-of-use">Terms of Use</Link>
            </li>
            <li>
              <Link href="/cookie-policy">Cookie Policy</Link>
            </li>
            <li>
              <Link href="/videos">YouTube Videos</Link>
            </li>
          </ul>
        </nav>

        <div className="footer-legal-block">
          <p className="footer-eyebrow">Developed By</p>
          <p className="footer-credit">
            Website developed by {DEVELOPER_CREDIT.name} at{" "}
            <a
              href={DEVELOPER_CREDIT.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {DEVELOPER_CREDIT.company}
            </a>
            .
          </p>
          <p className="footer-credit-desc">{DEVELOPER_CREDIT.descriptor}</p>
          <p className="footer-legal">
            © {year} {SITE_NAME} — AAM News. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
