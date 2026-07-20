import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/ArticleCard";
import { LeadStory } from "@/components/LeadStory";
import { NewsSidebar } from "@/components/news-sidebar";
import { Pagination } from "@/components/Pagination";
import {
  CATEGORY_DESCRIPTION_FALLBACK,
  getCategoryAccent,
} from "@/lib/category-config";
import { getSiteUrl } from "@/lib/site";
import { categoryPath, decodeHtml, stripHtml } from "@/lib/utils";
import {
  getCategoryBySlug,
  getNavCategories,
  getPosts,
  getTags,
} from "@/lib/wordpress";

export const revalidate = 60;

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

function categoryDescription(raw: string | undefined, name: string): {
  text: string;
  isFallback: boolean;
} {
  const cleaned = stripHtml(raw || "").trim();
  if (cleaned) {
    return { text: cleaned, isFallback: false };
  }
  return {
    text: CATEGORY_DESCRIPTION_FALLBACK.replace("this section", name),
    isFallback: true,
  };
}

export async function generateStaticParams() {
  const categories = await getNavCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const category = await getCategoryBySlug(slug);

  if (!category || category.count <= 0) {
    return { title: "Category not found", robots: { index: false, follow: false } };
  }

  const name = decodeHtml(category.name);
  const description = categoryDescription(category.description, name);
  const canonicalPath =
    page > 1
      ? `${categoryPath(category.slug)}?page=${page}`
      : categoryPath(category.slug);
  const title = page > 1 ? `${name} news — page ${page}` : `${name} news`;

  return {
    title,
    description: description.text,
    alternates: {
      canonical: `${getSiteUrl()}${canonicalPath}`,
    },
    openGraph: {
      title: `${name} | Asghar Ali Mubarak`,
      description: description.text,
      url: `${getSiteUrl()}${categoryPath(category.slug)}`,
      type: "website",
    },
    robots: page > 1 ? { index: false, follow: true } : undefined,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const category = await getCategoryBySlug(slug);

  if (!category || category.count <= 0) {
    notFound();
  }

  const page = Math.max(1, Number(pageParam) || 1);
  const [{ posts, totalPages }, categories, tags, sidebarLatest] =
    await Promise.all([
      getPosts({ page, categories: category.id }),
      getNavCategories(),
      getTags(10),
      getPosts({ page: 1, perPage: 5 }),
    ]);

  if (page > 1 && posts.length === 0) {
    notFound();
  }

  const name = decodeHtml(category.name);
  const description = categoryDescription(category.description, name);
  const accent = getCategoryAccent(category);
  const [lead, ...gridPosts] = page === 1 ? posts : [undefined, ...posts];
  const siteUrl = getSiteUrl();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name,
        item: `${siteUrl}${categoryPath(category.slug)}`,
      },
    ],
  };

  return (
    <div className={`page-shell content-with-sidebar category-page category-accent-${accent}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="main-column">
        <header className="page-hero category-hero">
          <p className="category-kicker">Section</p>
          <h1 dir="auto">{name}</h1>
          <p
            className={description.isFallback ? "category-description is-fallback" : "category-description"}
            dir="auto"
          >
            {description.text}
          </p>
          <p className="category-count">
            {category.count.toLocaleString()}{" "}
            {category.count === 1 ? "story" : "stories"}
          </p>
        </header>

        {lead ? <LeadStory post={lead} headingLevel="h2" /> : null}

        {gridPosts.length > 0 ? (
          <div className="article-grid three-col">
            {gridPosts.map((post) =>
              post ? <ArticleCard key={post.id} post={post} /> : null,
            )}
          </div>
        ) : !lead ? (
          <p>No published posts in this category yet.</p>
        ) : null}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath={`/category/${encodeURIComponent(slug)}`}
        />
      </div>

      <NewsSidebar
        latest={sidebarLatest.posts}
        categories={categories}
        tags={tags}
        picks={posts.slice(0, 5)}
        activeCategorySlug={category.slug}
      />
    </div>
  );
}
