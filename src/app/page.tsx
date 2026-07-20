import Link from "next/link";

import { AdBanner } from "@/components/ads/AdBanner";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryNewsSection } from "@/components/CategoryNewsSection";
import { CategoryStrip } from "@/components/CategoryStrip";
import { LeadStory } from "@/components/LeadStory";
import { LatestNewsTicker } from "@/components/latest-news-ticker";
import { NewsSidebar } from "@/components/news-sidebar";
import { SnapshotNotice } from "@/components/SnapshotNotice";
import { getHomepageSectionCategories } from "@/lib/category-config";
import { SITE_NAME } from "@/lib/site";
import type { WpCategory, WpPost } from "@/lib/types";
import {
  displayTitleForPost,
  formatPakistanDateTime,
  getLatestContentTimestamp,
  postPath,
} from "@/lib/utils";
import {
  getNavCategories,
  getPosts,
  getTags,
} from "@/lib/wordpress";

export const revalidate = 60;

function postsForCategory(
  posts: WpPost[],
  categoryId: number,
  excludeIds: Set<number>,
  limit = 3,
): WpPost[] {
  return posts
    .filter(
      (post) =>
        Array.isArray(post.categories) &&
        post.categories.includes(categoryId) &&
        !excludeIds.has(post.id),
    )
    .slice(0, limit);
}

async function buildCategorySections(
  categories: WpCategory[],
  homepagePosts: WpPost[],
  leadId?: number,
) {
  const featured = getHomepageSectionCategories(categories);
  const excludeIds = new Set<number>();
  if (leadId) excludeIds.add(leadId);

  const sections: { category: WpCategory; posts: WpPost[] }[] = [];

  for (const category of featured) {
    let posts = postsForCategory(homepagePosts, category.id, excludeIds, 3);

    if (posts.length < 3 && category.count > posts.length) {
      const fetched = await getPosts({
        categories: category.id,
        perPage: 4,
      });
      posts = fetched.posts
        .filter((post) => !excludeIds.has(post.id))
        .slice(0, 3);
    }

    if (posts.length === 0) continue;

    for (const post of posts) {
      excludeIds.add(post.id);
    }

    sections.push({ category, posts });
  }

  return sections;
}

export default async function HomePage() {
  const [{ posts, fromSnapshot, snapshotMessage }, categories, tags] =
    await Promise.all([
      getPosts({ page: 1, perPage: 20 }),
      getNavCategories(),
      getTags(12),
    ]);

  const [lead, ...rest] = posts;
  const secondary = rest.slice(0, 4);
  const latestGrid = rest.slice(4, 10);
  const sidebarLatest = posts.slice(0, 5);
  const picks = posts.slice(1, 6);

  const categorySections = await buildCategorySections(
    categories,
    posts,
    lead?.id,
  );

  const tickerHeadlines = posts.slice(0, 12).map((post) => {
    const title = displayTitleForPost(post);
    return {
      id: post.id,
      href: postPath(post.slug),
      label: title.text,
      dir: title.dir,
      lang: title.lang,
    };
  });

  const updatedIso =
    getLatestContentTimestamp(posts) ?? new Date().toISOString();
  const updatedLabel = formatPakistanDateTime(updatedIso);

  return (
    <>
      <LatestNewsTicker
        headlines={tickerHeadlines}
        updatedIso={updatedIso}
        updatedLabel={updatedLabel}
      />

      {fromSnapshot ? <SnapshotNotice message={snapshotMessage} /> : null}

      <div className="page-shell ad-leaderboard-wrap">
        <AdBanner />
      </div>

      <div className="page-shell content-with-sidebar">
        <div className="main-column">
          {lead ? <LeadStory post={lead} /> : null}

          {secondary.length > 0 ? (
            <section className="section" aria-labelledby="secondary-heading">
              <div className="section-heading section-heading-accent">
                <div>
                  <h2 id="secondary-heading">Latest stories</h2>
                  <p>Selected reports from the newsroom.</p>
                </div>
                <Link href="/latest" className="section-link">
                  View all
                </Link>
              </div>
              <div className="article-grid two-col">
                {secondary.map((post) => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          ) : null}

          <CategoryStrip categories={categories} />

          {latestGrid.length > 0 ? (
            <section className="section" aria-labelledby="latest-heading">
              <div className="section-heading">
                <div>
                  <h2 id="latest-heading">Latest news</h2>
                  <p>Fresh coverage in English and Urdu.</p>
                </div>
                <Link href="/latest" className="section-link">
                  View all
                </Link>
              </div>
              <div className="article-grid three-col">
                {latestGrid.map((post) => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          ) : null}

          {categorySections.map(({ category, posts: sectionPosts }) => (
            <CategoryNewsSection
              key={category.id}
              category={category}
              posts={sectionPosts}
            />
          ))}

          {categories.length === 0 && tags.length > 0 ? (
            <section className="section" aria-labelledby="topics-heading">
              <div className="section-heading">
                <div>
                  <h2 id="topics-heading">Topics</h2>
                  <p>Explore recent reporting by topic tag.</p>
                </div>
              </div>
              <ul className="section-chip-row">
                {tags.slice(0, 10).map((tag) => (
                  <li key={tag.id}>
                    <Link
                      href={`/search?q=${encodeURIComponent(tag.name)}`}
                      className="section-chip"
                      dir="auto"
                    >
                      {tag.name}
                      <span>{tag.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <NewsSidebar
          latest={sidebarLatest}
          categories={categories}
          tags={tags}
          picks={picks}
        />
      </div>

      <p className="sr-only">Homepage for {SITE_NAME}</p>
    </>
  );
}
