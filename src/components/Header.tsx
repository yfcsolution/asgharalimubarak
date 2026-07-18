import Image from "next/image";
import Link from "next/link";

import { DesktopNav, MobileNav, type NavItem } from "@/components/SiteNav";
import { getSiteAuthor, resolveAuthorPhoto } from "@/lib/author";
import {
  SITE_NAME,
  SITE_NAME_UR,
  SITE_TAGLINE,
  SOCIAL_LINKS,
} from "@/lib/site";
import { categoryPath, decodeHtml, formatDate } from "@/lib/utils";
import { getNavCategories } from "@/lib/wordpress";

function buildNavItems(
  categories: Awaited<ReturnType<typeof getNavCategories>>,
): { primary: NavItem[]; more: NavItem[]; all: NavItem[] } {
  const fixedStart: NavItem[] = [
    { href: "/", label: "Home" },
    { href: "/latest", label: "Latest" },
  ];
  const fixedEnd: NavItem[] = [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const categoryItems: NavItem[] = categories.map((category) => ({
    href: categoryPath(category.slug),
    label: decodeHtml(category.name),
    dir: "auto" as const,
  }));

  // Desktop budget: Home + Latest + up to 5 categories + About + Contact (+ More)
  const visibleCategoryCount = Math.min(5, categoryItems.length);
  const primaryCategories = categoryItems.slice(0, visibleCategoryCount);
  const moreCategories = categoryItems.slice(visibleCategoryCount);

  return {
    primary: [...fixedStart, ...primaryCategories, ...fixedEnd],
    more: moreCategories,
    all: [...fixedStart, ...categoryItems, ...fixedEnd],
  };
}

export async function Header() {
  const [author, categories] = await Promise.all([
    getSiteAuthor(),
    getNavCategories(),
  ]);
  const photo = resolveAuthorPhoto(author);
  const nav = buildNavItems(categories);
  const today = formatDate(new Date().toISOString());

  return (
    <header className="site-header">
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
              <ul className="social-links" aria-label="Social profiles">
                {SOCIAL_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                    >
                      <span className="social-label-full">{link.label}</span>
                      <span className="social-label-short" aria-hidden="true">
                        {link.label.slice(0, 2)}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="nav-bar">
        <div className="nav-bar-inner">
          <DesktopNav primary={nav.primary} more={nav.more} />
          <MobileNav items={nav.all} />
        </div>
      </div>
    </header>
  );
}
