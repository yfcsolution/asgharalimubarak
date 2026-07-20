import Link from "next/link";

import { ContactQuickLinks } from "@/components/WhatsAppFloat";
import { SocialLinksList } from "@/components/SocialIcons";
import {
  DEVELOPER_CREDIT,
  SITE_NAME,
  SITE_NAME_UR,
  SITE_SLOGAN,
  getActiveSocialLinks,
} from "@/lib/site";
import { categoryPath, decodeHtml } from "@/lib/utils";
import { getNavCategories } from "@/lib/wordpress";

export async function Footer() {
  const year = new Date().getFullYear();
  const socialLinks = getActiveSocialLinks();
  const categories = (await getNavCategories()).slice(0, 8);

  return (
    <footer className="site-footer">
      <div className="footer-inner footer-grid">
        <div className="footer-brand">
          <p className="footer-eyebrow">About</p>
          <p className="footer-title">{SITE_NAME}</p>
          <p className="footer-title-ur" lang="ur" dir="rtl">
            {SITE_NAME_UR}
          </p>
          <p className="footer-copy">{SITE_SLOGAN}</p>
        </div>

        <nav aria-label="Quick links">
          <p className="footer-eyebrow">Quick Links</p>
          <ul className="footer-links">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/latest">Latest</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </nav>

        {categories.length > 0 ? (
          <nav aria-label="Footer categories">
            <p className="footer-eyebrow">Categories</p>
            <ul className="footer-links">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link href={categoryPath(category.slug)} dir="auto">
                    {decodeHtml(category.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <div className="footer-contact">
          <p className="footer-eyebrow">Contact</p>
          <ContactQuickLinks className="footer-contact-links" />
          <p className="footer-follow-label">Follow</p>
          <SocialLinksList links={socialLinks} className="footer-social" />
        </div>

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
            © {year} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
