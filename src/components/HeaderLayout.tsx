"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SiteBanner, type SiteBannerVariant } from "@/components/SiteBanner";
import { DesktopNav, MobileNav, type NavItem } from "@/components/SiteNav";
import { SocialLinksList } from "@/components/SocialIcons";
import type { SocialLink } from "@/lib/site";
import {
  SITE_NAME,
  SITE_NAME_UR,
  SITE_TAGLINE,
} from "@/lib/site";

type HeaderLayoutProps = {
  nav: {
    primary: NavItem[];
    more: NavItem[];
    all: NavItem[];
  };
  socialLinks: SocialLink[];
  photo: { src: string; alt: string } | null;
  today: string;
};

function resolveBannerVariant(pathname: string): SiteBannerVariant | "hidden" {
  if (pathname.startsWith("/article/")) return "compact";
  if (pathname === "/about" || pathname === "/contact") return "hidden";
  if (
    pathname === "/" ||
    pathname === "/latest" ||
    pathname.startsWith("/category/") ||
    pathname.startsWith("/search")
  ) {
    return "full";
  }
  return "hidden";
}

export function HeaderLayout({
  nav,
  socialLinks,
  photo,
  today,
}: HeaderLayoutProps) {
  const pathname = usePathname();
  const bannerVariant = resolveBannerVariant(pathname);
  const showBanner = bannerVariant !== "hidden";
  const isHome = pathname === "/";

  return (
    <header className="site-header">
      {showBanner ? (
        <div className="site-header-banner-wrap">
          <SiteBanner
            variant={bannerVariant === "compact" ? "compact" : "full"}
            priority={isHome}
            hidePortrait
          />
          <div className="masthead-overlay">
            <div className="masthead-inner masthead-overlay-inner">
              <div className="masthead-brand-row masthead-overlay-row">
                {!isHome && photo ? (
                  <Link href="/about" className="author-photo-link author-photo-link-sm">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={56}
                      height={56}
                      className="author-photo author-photo-sm"
                    />
                  </Link>
                ) : null}

                <div className="masthead-meta masthead-overlay-meta">
                  <time className="masthead-date" dateTime={new Date().toISOString()}>
                    {today}
                  </time>
                  <form
                    className="masthead-search"
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
                      placeholder="Search news"
                      autoComplete="off"
                      enterKeyHint="search"
                    />
                    <button type="submit">Search</button>
                  </form>
                  <SocialLinksList links={socialLinks} className="social-links" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="masthead">
          <div className="masthead-inner">
            <div className="masthead-brand-row">
              {photo ? (
                <Link href="/about" className="author-photo-link">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={88}
                    height={88}
                    className="author-photo"
                    priority
                  />
                </Link>
              ) : null}

              <div className="masthead-copy">
                <p className="masthead-kicker">English · اردو · Independent News</p>
                <Link href="/" className="brand-lockup">
                  <span className="brand-name" lang="en">
                    {SITE_NAME}
                  </span>
                  <span className="brand-name-ur" lang="ur" dir="rtl">
                    {SITE_NAME_UR}
                  </span>
                </Link>
                <p className="masthead-tagline">{SITE_TAGLINE}</p>
              </div>

              <div className="masthead-meta">
                <time className="masthead-date" dateTime={new Date().toISOString()}>
                  {today}
                </time>
                <form className="masthead-search" action="/search" method="get" role="search">
                  <label className="sr-only" htmlFor="site-search-fallback">
                    Search articles
                  </label>
                  <input
                    id="site-search-fallback"
                    name="q"
                    type="search"
                    placeholder="Search news"
                    autoComplete="off"
                    enterKeyHint="search"
                  />
                  <button type="submit">Search</button>
                </form>
                <SocialLinksList links={socialLinks} className="social-links" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="nav-bar nav-bar-sticky">
        <div className="nav-bar-inner">
          <DesktopNav primary={nav.primary} more={nav.more} />
          <MobileNav items={nav.all} />
        </div>
      </div>
    </header>
  );
}
