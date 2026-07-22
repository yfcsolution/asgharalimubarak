import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { getCategoryCanonicalSlug } from "@/lib/category-config";
import { getSiteUrl } from "@/lib/site";
import { categoryPath } from "@/lib/utils";
import { getNavCategories } from "@/lib/wordpress";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blogger Archive",
  description: "Browse the AAM News blogger archive section.",
  alternates: { canonical: `${getSiteUrl()}/blogger` },
};

export default async function BloggerPage() {
  const categories = await getNavCategories();
  const blogger = categories.find(
    (category) => getCategoryCanonicalSlug(category) === "blogger-archive",
  );

  if (!blogger) {
    notFound();
  }

  redirect(categoryPath(blogger.slug));
}
