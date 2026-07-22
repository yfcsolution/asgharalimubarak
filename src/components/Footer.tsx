import Link from "next/link";

import { SocialLinksList } from "@/components/SocialIcons";
import { ContactQuickLinks } from "@/components/WhatsAppFloat";
import {
  FOOTER_DESCRIPTION_EN,
  FOOTER_DESCRIPTION_UR,
} from "@/lib/about-content";
import { getCategoryCanonicalSlug } from "@/lib/category-config";
import {
  DEVELOPER_CREDIT,
  SITE_NAME,
  SITE_NAME_UR,
  getActiveSocialLinks,
} from "@/lib/site";
import { getNavCategories } from "@/lib/wordpress";

export async function Footer() {
  const year = new Date().getFullYear();
  const socialLinks = getActiveSocialLinks();
  const categories = await getNavCategories();
  const bloggerArchive = categories.find(
    (category) => getCategoryCanonicalSlug(category) === "blogger-archive",
  );

  return (
    <footer className="site-footer">
      <div className="footer-inner footer-grid">
        <div className="footer-brand">
          <p className="footer-eyebrow">About AAM News</p>
          <p className="footer-title">{SITE_NAME}</p>
          <p className="footer-title-ur" lang="ur" dir="rtl">
            {SITE_NAME_UR}
          </p>
          <p className="footer-copy">{FOOTER_DESCRIPTION_EN}</p>
          <p className="footer-copy footer-copy-ur" lang="ur" dir="rtl">
            {FOOTER_DESCRIPTION_UR}
          </p>
        </div>

        <nav aria-label="Explore AAM News">
          <p className="footer-eyebrow">Explore AAM News</p>
          <ul className="footer-links footer-links-stack">
            <li>
              <Link href="/about">About &amp; Contact</Link>
            </li>
            <li>
              <Link href="/latest">Latest News</Link>
            </li>
            <li>
              <Link href="/categories">All Categories</Link>
            </li>
            <li>
              <Link href="/videos">YouTube Videos</Link>
            </li>
            <li>
              <Link href="/facebook">Facebook</Link>
            </li>
            <li>
              <Link href="/instagram">Instagram</Link>
            </li>
            {bloggerArchive ? (
              <li>
                <Link href="/blogger">Blogger Archive</Link>
              </li>
            ) : null}
          </ul>
        </nav>

        <div className="footer-contact">
          <p className="footer-eyebrow">Contact</p>
          <ContactQuickLinks className="footer-contact-links" />
        </div>

        <div className="footer-contact">
          <p className="footer-eyebrow">Follow</p>
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
