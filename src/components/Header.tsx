import { HeaderLayout } from "@/components/HeaderLayout";
import { type NavItem } from "@/components/SiteNav";
import { getCategoryNavLabel, splitNavCategories } from "@/lib/category-config";
import { getActiveSocialLinks } from "@/lib/site";
import { categoryPath } from "@/lib/utils";
import { getNavCategories } from "@/lib/wordpress";

function toNavItem(href: string, label: string, dir: "auto" = "auto"): NavItem {
  return { href, label, dir };
}

function buildNavItems(
  categories: Awaited<ReturnType<typeof getNavCategories>>,
): { primary: NavItem[]; more: NavItem[]; all: NavItem[] } {
  const fixedStart = [
    toNavItem("/", "Home"),
    toNavItem("/latest", "Latest"),
  ];
  const fixedEnd = [
    toNavItem("/about", "About"),
    toNavItem("/contact", "Contact"),
  ];

  const { primary: primaryCategories, more: moreCategories } =
    splitNavCategories(categories);

  const primaryCategoryItems = primaryCategories.map((category) =>
    toNavItem(categoryPath(category.slug), getCategoryNavLabel(category)),
  );
  const moreCategoryItems = moreCategories.map((category) =>
    toNavItem(categoryPath(category.slug), getCategoryNavLabel(category)),
  );
  const allCategoryItems = [...primaryCategoryItems, ...moreCategoryItems];

  return {
    primary: [...fixedStart, ...primaryCategoryItems, ...fixedEnd],
    more: moreCategoryItems,
    all: [...fixedStart, ...allCategoryItems, ...fixedEnd],
  };
}

export async function Header() {
  const categories = await getNavCategories();
  const nav = buildNavItems(categories);
  const socialLinks = getActiveSocialLinks();

  return <HeaderLayout nav={nav} socialLinks={socialLinks} />;
}
