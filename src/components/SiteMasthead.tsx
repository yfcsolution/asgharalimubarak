import Image from "next/image";
import Link from "next/link";

import { SocialLinksList } from "@/components/SocialIcons";
import type { SocialLink } from "@/lib/site";
import {
  AUTHOR_LOCAL_PHOTO,
  HEADER_PORTRAIT_ALT,
  SITE_NAME,
  SITE_NAME_UR,
  SITE_SHOW_NAME_UR,
  SITE_TAGLINE,
} from "@/lib/site";

type SiteMastheadProps = {
  socialLinks: SocialLink[];
};

export function SiteMasthead({ socialLinks }: SiteMastheadProps) {
  return (
    <div className="site-masthead">
      <div className="site-masthead-inner">
        <div className="site-masthead-left">
          <Link href="/" className="site-masthead-portrait-link">
            <Image
              src={AUTHOR_LOCAL_PHOTO}
              alt={HEADER_PORTRAIT_ALT}
              width={900}
              height={900}
              className="site-masthead-portrait"
              priority
            />
          </Link>
          <p className="site-masthead-mark" lang="ur" dir="rtl">
            {SITE_SHOW_NAME_UR}
          </p>
        </div>

        <div className="site-masthead-brand">
          <Link href="/" className="site-masthead-lockup">
            <span className="site-masthead-name-en" lang="en">
              {SITE_NAME}
            </span>
            <span className="site-masthead-name-ur" lang="ur" dir="rtl">
              {SITE_NAME_UR}
            </span>
            <span className="site-masthead-tagline">{SITE_TAGLINE}</span>
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
            <button type="submit">Search</button>
          </form>
          <SocialLinksList links={socialLinks} className="site-masthead-social" />
        </div>
      </div>
    </div>
  );
}
