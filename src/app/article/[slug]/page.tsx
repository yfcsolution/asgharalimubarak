import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/ArticleCard";
import { ArticleLayout } from "@/components/ArticleLayout";
import { getSiteUrl } from "@/lib/site";
import {
  decodeHtml,
  excerptText,
  getFeaturedImage,
  getPostCategories,
} from "@/lib/utils";
import { getAllPostSlugs, getPostBySlug, getPosts } from "@/lib/wordpress";

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

  const title = decodeHtml(post.title.rendered);
  const description = excerptText(post, 160);
  const image = getFeaturedImage(post);
  const url = `${getSiteUrl()}/article/${encodeURIComponent(slug)}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      title,
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
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image.src] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const categories = getPostCategories(post);
  const relatedCategory = categories[0]?.id;
  const related = relatedCategory
    ? (await getPosts({ page: 1, perPage: 4, categories: relatedCategory }))
        .posts.filter((item) => item.id !== post.id)
        .slice(0, 3)
    : (await getPosts({ page: 1, perPage: 4 })).posts
        .filter((item) => item.id !== post.id)
        .slice(0, 3);

  return (
    <ArticleLayout
      post={post}
      related={
        related.length > 0 ? (
          <section className="section" aria-labelledby="related-heading">
            <div className="section-heading">
              <div>
                <h2 id="related-heading">Related coverage</h2>
                <p>More reports you may want to read next.</p>
              </div>
            </div>
            <div className="article-grid">
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
