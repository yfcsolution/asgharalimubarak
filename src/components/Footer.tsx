import Link from "next/link";

import { SocialLinksList } from "@/components/SocialIcons";
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
import { categoryPath, decodeHtml } from "@/lib/utils";
import { getNavCategories } from "@/lib/wordpress";

export async function Footer() {
  const year = new Date().getFullYear();
  const socialLinks = getActiveSocialLinks();
  const categories = await getNavCategories();
  const footerCategories = categories.slice(0, 8);
  const bloggerArchive = categories.find(
    (category) => getCategoryCanonicalSlug(category) === "blogger-archive",
  );

  return (
    <footer className="site-footer">
      <div className="footer-inner footer-grid">
        <div className="footer-brand">
          <p className="footer-eyebrow">AAM News</p>
          <p className="footer-title">{SITE_NAME}</p>
          <p className="footer-title-ur" lang="ur" dir="rtl">
            {SITE_NAME_UR}
          </p>
          <p className="footer-copy">{FOOTER_DESCRIPTION_EN}</p>
          <p className="footer-copy footer-copy-ur" lang="ur" dir="rtl">
            {FOOTER_DESCRIPTION_UR}
          </p>
        </div>

        <nav aria-label="Site pages">
          <p className="footer-eyebrow">Pages</p>
          <ul className="footer-links">
            <li>
              <Link href="/about">About &amp; Contact</Link>
            </li>
            <li>
              <Link href="/latest">Latest</Link>
            </li>
            {bloggerArchive ? (
              <li>
                <Link href={categoryPath(bloggerArchive.slug)} dir="auto">
                  {decodeHtml(bloggerArchive.name)}
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>

        {footerCategories.length > 0 ? (
          <nav aria-label="Footer categories">
            <p className="footer-eyebrow">Categories</p>
            <ul className="footer-links">
              {footerCategories.map((category) => (
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
