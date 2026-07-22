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

const HOMEPAGE_ARIA_LABEL = "Go to AAM News homepage";

type SiteMastheadProps = {
  socialLinks: SocialLink[];
};

export function SiteMasthead({ socialLinks }: SiteMastheadProps) {
  return (
    <div className="site-masthead">
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
            <span className="site-masthead-aam">AAM News</span>
            <span className="site-masthead-slogan">{SITE_SLOGAN}</span>
          </Link>
          <span className="site-masthead-accent" aria-hidden="true" />
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
