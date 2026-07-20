import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/ArticleCard";
import { ArticleLayout } from "@/components/ArticleLayout";
import { NewsSidebar } from "@/components/news-sidebar";
import { DEFAULT_OG_IMAGE, getSiteUrl } from "@/lib/site";
import {
  displayTitleForPost,
  excerptText,
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
    };
  }

  const title = displayTitleForPost(post);
  const description = excerptText(post, 160);
  const image = getPostImage(post);
  const url = `${getSiteUrl()}/article/${encodeURIComponent(slug)}`;
  const fallbackOg = `${getSiteUrl()}${DEFAULT_OG_IMAGE}`;

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
      publishedTime: post.date,
      modifiedTime: post.modified,
      images: image
        ? [
            {
              url: image.src,
              alt: image.alt,
              width: image.width,
              height: image.height,
            },
          ]
        : [
            {
              url: fallbackOg,
              alt: "Asghar Ali Mubarak in a professional news studio",
              width: 1536,
              height: 1024,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: title.text,
      description,
      images: image ? [image.src] : [fallbackOg],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [{ posts: relatedPool }, categories, tags, latestPack] =
    await Promise.all([
      getPosts({ page: 1, perPage: 8 }),
      getNavCategories(),
      getTags(10),
      getPosts({ page: 1, perPage: 5 }),
    ]);

  const related = relatedPool
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
          picks={relatedPool.slice(0, 5)}
        />
      }
      related={
        related.length > 0 ? (
          <section className="section related-section" aria-labelledby="related-heading">
            <div className="section-heading">
              <div>
                <h2 id="related-heading">Related coverage</h2>
                <p>More reports you may want to read next.</p>
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
