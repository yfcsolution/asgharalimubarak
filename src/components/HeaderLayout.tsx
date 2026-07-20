import { HeaderPromoBanner } from "@/components/HeaderPromoBanner";
import { SiteMasthead } from "@/components/SiteMasthead";
import { DesktopNav, MobileNav, type NavItem } from "@/components/SiteNav";
import type { SocialLink } from "@/lib/site";

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
    <header className="site-header">
      <SiteMasthead socialLinks={socialLinks} />

      <div className="nav-bar nav-bar-sticky">
        <div className="nav-bar-inner">
          <DesktopNav primary={nav.primary} more={nav.more} />
          <MobileNav items={nav.all} />
        </div>
      </div>

      <HeaderPromoBanner />
    </header>
  );
}
