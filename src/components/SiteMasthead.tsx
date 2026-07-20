import Image from "next/image";
import Link from "next/link";

import { SocialLinksList } from "@/components/SocialIcons";
import type { SocialLink } from "@/lib/site";
import {
  HEADER_PORTRAIT,
  HEADER_PORTRAIT_ALT,
  SITE_NAME,
  SITE_NAME_UR,
  SITE_SHOW_NAME_UR,
} from "@/lib/site";

type SiteMastheadProps = {
  socialLinks: SocialLink[];
};

export function SiteMasthead({ socialLinks }: SiteMastheadProps) {
  return (
    <div className="site-masthead">
      <div className="site-masthead-inner">
        <Link href="/" className="site-masthead-portrait-link">
          <Image
            src={HEADER_PORTRAIT}
            alt={HEADER_PORTRAIT_ALT}
            width={180}
            height={220}
            className="site-masthead-portrait"
            priority
          />
        </Link>

        <div className="site-masthead-brand">
          <Link href="/" className="site-masthead-lockup">
            <span className="site-masthead-show" lang="ur" dir="rtl">
              {SITE_SHOW_NAME_UR}
            </span>
            <span className="site-masthead-name-en" lang="en">
              {SITE_NAME}
            </span>
            <span className="site-masthead-name-ur" lang="ur" dir="rtl">
              {SITE_NAME_UR}
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
              placeholder="Search"
              autoComplete="off"
              enterKeyHint="search"
            />
            <button type="submit" aria-label="Search">
              Search
            </button>
          </form>
          <SocialLinksList links={socialLinks} className="site-masthead-social" />
        </div>
      </div>
    </div>
  );
}
