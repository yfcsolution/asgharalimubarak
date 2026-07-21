import Image from "next/image";
import Link from "next/link";

import { SocialLinksList } from "@/components/SocialIcons";
import type { SocialLink } from "@/lib/site";
import {
  AUTHOR_HEADER_PHOTO,
  HEADER_PORTRAIT_ALT,
  SITE_NAME,
  SITE_NAME_UR,
  SITE_SHOW_NAME_UR,
  SITE_SLOGAN,
} from "@/lib/site";

const HOMEPAGE_ARIA_LABEL = "Go to Asghar Ali Mubarak homepage";

type SiteMastheadProps = {
  socialLinks: SocialLink[];
};

export function SiteMasthead({ socialLinks }: SiteMastheadProps) {
  return (
    <div className="site-masthead">
      <div className="site-masthead-motif" aria-hidden="true">
        <svg className="site-masthead-crescent" viewBox="0 0 120 120" width="120" height="120">
          <path
            fill="currentColor"
            d="M70 12a48 48 0 1 0 38 82 40 40 0 1 1-38-82zm18 18 6 12 13 2-10 9 3 13-12-6-12 6 3-13-10-9 13-2z"
          />
        </svg>
        <svg className="site-masthead-skyline" viewBox="0 0 320 90" width="320" height="90">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            d="M8 78h304M24 78V52l12-8 10 8v26M56 78V40l18-18 18 18v38M108 78V28l22-16 22 16v50M168 78V46h18v32M198 78V34l28-20 28 20v44M268 78V50l16-10 16 10v28"
          />
        </svg>
      </div>

      <div className="site-masthead-inner">
        <div className="site-masthead-left">
          <Link
            href="/"
            className="site-masthead-brand-link"
            aria-label={HOMEPAGE_ARIA_LABEL}
          >
            <Image
              src={AUTHOR_HEADER_PHOTO}
              alt={HEADER_PORTRAIT_ALT}
              width={480}
              height={480}
              className="site-masthead-portrait"
              priority
            />
            <div className="site-masthead-urdu" lang="ur" dir="rtl">
              <p className="site-masthead-show">{SITE_SHOW_NAME_UR}</p>
              <span className="site-masthead-urdu-divider" aria-hidden="true" />
              <p className="site-masthead-name-ur-side">{SITE_NAME_UR}</p>
            </div>
          </Link>
        </div>

        <div className="site-masthead-brand">
          <Link
            href="/"
            className="site-masthead-lockup"
            aria-label={HOMEPAGE_ARIA_LABEL}
          >
            <span className="site-masthead-name-en" lang="en">
              {SITE_NAME}
            </span>
            <span className="site-masthead-slogan">
              <span className="site-masthead-slogan-rule" aria-hidden="true" />
              <span className="site-masthead-slogan-text">{SITE_SLOGAN}</span>
              <span className="site-masthead-slogan-rule" aria-hidden="true" />
            </span>
          </Link>
        </div>

        <div className="site-masthead-tools">
          <form className="site-masthead-search" action="/search" method="get" role="search">
            <label className="sr-only" htmlFor="site-search">
              Search articles
            </label>
            <input
              id="site-search"
              name="q"
              type="search"
              placeholder="Search news"
              autoComplete="off"
              enterKeyHint="search"
            />
            <button type="submit" aria-label="Search">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M15.5 14h-.8l-.3-.3A6.5 6.5 0 1 0 14 15.5l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"
                />
              </svg>
            </button>
          </form>
          <SocialLinksList links={socialLinks} className="site-masthead-social" />
        </div>
      </div>
    </div>
  );
}
