import Link from "next/link";

import { ContactQuickLinks } from "@/components/WhatsAppFloat";
import { SocialLinksList } from "@/components/SocialIcons";
import {
  DEVELOPER_CREDIT,
  SITE_NAME,
  SITE_NAME_UR,
  SITE_TAGLINE,
  getActiveSocialLinks,
} from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  const socialLinks = getActiveSocialLinks();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <p className="footer-title">{SITE_NAME}</p>
          <p className="footer-title-ur" lang="ur" dir="rtl">
            {SITE_NAME_UR}
          </p>
          <p className="footer-copy">{SITE_TAGLINE}</p>
          <ContactQuickLinks className="footer-contact-links" />
        </div>

        <nav aria-label="Footer">
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

        <div className="footer-follow">
          <p className="footer-follow-label">Follow</p>
          <SocialLinksList links={socialLinks} className="footer-social" showLabels />
        </div>

        <div className="footer-legal-block">
          <p className="footer-legal">
            © {year} {SITE_NAME}. All rights reserved.
          </p>
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
        </div>
      </div>
    </footer>
  );
}
