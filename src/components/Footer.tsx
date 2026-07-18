import Link from "next/link";

import { SITE_NAME, SITE_NAME_UR, SITE_TAGLINE } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <p className="footer-title">{SITE_NAME}</p>
          <p className="footer-title-ur" lang="ur" dir="rtl">
            {SITE_NAME_UR}
          </p>
          <p className="footer-copy">{SITE_TAGLINE}</p>
        </div>

        <nav aria-label="Footer">
          <ul className="footer-links">
            <li>
              <Link href="/latest">Latest News</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </nav>

        <p className="footer-legal">
          © {year} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
