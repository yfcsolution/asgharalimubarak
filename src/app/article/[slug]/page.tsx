import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/ArticleCard";
import { ArticleLayout } from "@/components/ArticleLayout";
import { NewsSidebar } from "@/components/news-sidebar";
import { DEFAULT_OG_IMAGE, X_PROFILE_URL } from "@/lib/site";
import { absoluteUrl, truncateMetaDescription } from "@/lib/seo";
import {
  displayTitleForPost,
  excerptText,
  getPostCategories,
  getPostImage,
} from "@/lib/utils";
import {
  getAllPostSlugs,
  getNavCategories,
  getPostBySlug,
  getPosts,
  getTags,
} from "@/lib/wordpress";

export const revalidate = 60;

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs(24);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article not found",
      robots: { index: false, follow: false },
    };
  }

  const title = displayTitleForPost(post);
  const description = truncateMetaDescription(excerptText(post, 160));
  const image = getPostImage(post);
  const url = absoluteUrl(`/article/${encodeURIComponent(slug)}`);
  const fallbackOg = absoluteUrl(DEFAULT_OG_IMAGE);
  const categories = getPostCategories(post);
  const section = categories.find((c) => c.slug !== "uncategorized")?.name;

  return {
    title: title.text,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      title: title.text,
      description,
      url,
      locale: title.lang === "ur" ? "ur_PK" : "en_PK",
      publishedTime: post.date,
      modifiedTime: post.modified,
      section,
      images: image
        ? [
            {
              url: image.src,
              alt: image.alt || title.text,
              width: image.width,
              height: image.height,
            },
          ]
        : [
            {
              url: fallbackOg,
              alt: "Asghar Ali Mubarak in a professional news studio",
              width: 1920,
              height: 800,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: title.text,
      description,
      images: image ? [image.src] : [fallbackOg],
      site: "@ASGHARMUBARAK",
      creator: "@ASGHARMUBARAK",
    },
    other: {
      "x:url": X_PROFILE_URL,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const primaryCategoryId = Array.isArray(post.categories)
    ? post.categories[0]
    : undefined;

  const [relatedFeed, categories, tags, latestPack] = await Promise.all([
    primaryCategoryId
      ? getPosts({ page: 1, perPage: 8, categories: primaryCategoryId })
      : getPosts({ page: 1, perPage: 8 }),
    getNavCategories(),
    getTags(10),
    getPosts({ page: 1, perPage: 5 }),
  ]);

  const related = relatedFeed.posts
    .filter((item) => item.id !== post.id)
    .slice(0, 3);

  return (
    <ArticleLayout
      post={post}
      sidebar={
        <NewsSidebar
          latest={latestPack.posts}
          categories={categories}
          tags={tags}
          picks={relatedFeed.posts.slice(0, 5)}
        />
      }
      related={
        related.length > 0 ? (
          <section className="section related-section" aria-labelledby="related-heading">
            <div className="section-heading">
              <div>
                <h2 id="related-heading">Related News</h2>
                <p>More reports from the same coverage area.</p>
              </div>
            </div>
            <div className="article-grid two-col">
              {related.map((item) => (
                <ArticleCard key={item.id} post={item} />
              ))}
            </div>
          </section>
        ) : null
      }
    />
  );
}
