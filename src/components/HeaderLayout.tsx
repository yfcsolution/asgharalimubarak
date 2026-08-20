import Image from "next/image";
import Link from "next/link";

import { DesktopNav, MobileNav, type NavItem } from "@/components/SiteNav";
import { SocialLinksList } from "@/components/SocialIcons";
import type { SocialLink } from "@/lib/site";
import { AAM_NEWS_LOGO, AAM_NEWS_LOGO_ALT } from "@/lib/site";

type HeaderLayoutProps = {
  nav: {
    primary: NavItem[];
    more: NavItem[];
    all: NavItem[];
  };
  socialLinks: SocialLink[];
};

export function HeaderLayout({ nav, socialLinks }: HeaderLayoutProps) {
  return (
    <header className="site-header site-header--newsroom">
      <div className="nav-bar nav-bar-sticky newsroom-header">
        <div className="newsroom-header-inner">
          <Link
            href="/"
            className="newsroom-logo-link"
            aria-label="Go to AAM News homepage"
          >
            <Image
              src={AAM_NEWS_LOGO}
              alt={AAM_NEWS_LOGO_ALT}
              width={480}
              height={320}
              className="newsroom-logo"
              priority
              sizes="(max-width: 768px) 140px, 200px"
            />
          </Link>

          <div className="newsroom-nav">
            <DesktopNav primary={nav.primary} more={nav.more} />
            <MobileNav items={nav.all} />
          </div>

          <div className="newsroom-tools">
            <form
              className="newsroom-search"
              action="/search"
              method="get"
              role="search"
            >
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
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M15.5 14h-.8l-.3-.3A6.5 6.5 0 1 0 14 15.5l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"
                  />
                </svg>
              </button>
            </form>
            <SocialLinksList links={socialLinks} className="newsroom-social" />
          </div>
        </div>
      </div>
    </header>
  );
}
