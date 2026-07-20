import { HeaderLayout } from "@/components/HeaderLayout";
import { type NavItem } from "@/components/SiteNav";
import { getSiteAuthor, resolveAuthorPhoto } from "@/lib/author";
import { getActiveSocialLinks } from "@/lib/site";
import { categoryPath, decodeHtml, formatPakistanDate } from "@/lib/utils";
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
  const socialLinks = getActiveSocialLinks();
  const today = formatPakistanDate(new Date().toISOString());

  return (
    <HeaderLayout
      nav={nav}
      socialLinks={socialLinks}
      photo={photo}
      today={today}
    />
  );
}
