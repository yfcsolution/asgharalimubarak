import Link from "next/link";

import { MobileNav } from "@/components/MobileNav";
import { SITE_NAME, SITE_NAME_UR } from "@/lib/site";

const navItems = [
  { href: "/", label: "Home", labelUr: "صفحہ اول" },
  { href: "/latest", label: "Latest", labelUr: "تازہ خبریں" },
  { href: "/about", label: "About", labelUr: "تعارف" },
  { href: "/contact", label: "Contact", labelUr: "رابطہ" },
] as const;

export function Header() {
  return (
    <header className="site-header">
      <div className="masthead">
        <div className="masthead-inner">
          <p className="masthead-kicker animate-fade-up">
            English · اردو · Independent News
          </p>
          <Link href="/" className="brand-lockup animate-fade-up delay-1">
            <span className="brand-name" lang="en">
              {SITE_NAME}
            </span>
            <span className="brand-name-ur" lang="ur" dir="rtl">
              {SITE_NAME_UR}
            </span>
          </Link>
        </div>
      </div>

      <div className="nav-bar">
        <div className="nav-bar-inner">
          <nav aria-label="Primary" className="primary-nav">
            <ul className="primary-nav-list">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="nav-link">
                    <span>{item.label}</span>
                    <span className="nav-link-ur" lang="ur" dir="rtl">
                      {item.labelUr}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <MobileNav items={[...navItems]} />
        </div>
      </div>
    </header>
  );
}
