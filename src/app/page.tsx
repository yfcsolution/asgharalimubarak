import Link from "next/link";

import { AdBanner } from "@/components/ads/AdBanner";
import { ArticleCard } from "@/components/ArticleCard";
import { CampaignBanner } from "@/components/CampaignBanner";
import { CategoryNewsSection } from "@/components/CategoryNewsSection";
import { FeedUnavailablePanel } from "@/components/FeedUnavailablePanel";
import { LeadStory } from "@/components/LeadStory";
import { LatestNewsTicker } from "@/components/latest-news-ticker";
import { NewsSidebar } from "@/components/news-sidebar";
import { PhotoStoriesSection } from "@/components/PhotoStoriesSection";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteEntitiesJsonLd } from "@/components/SiteEntitiesJsonLd";
import { SnapshotNotice } from "@/components/SnapshotNotice";
import { VideoCard } from "@/components/VideoCard";
import {
  findCategoryByCanonical,
  getCategoryCanonicalSlug,
  getHomepageSectionCategories,
} from "@/lib/category-config";
import { hasEditorialPosts } from "@/lib/feed-status";
import {
  HOMEPAGE_DESCRIPTION,
  HOMEPAGE_TITLE,
  absoluteUrl,
} from "@/lib/seo";
import { shouldBoostDefenceSection } from "@/lib/seasonal-campaigns";
import { SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";
import type { WpCategory, WpPost } from "@/lib/types";
import {
  categoryPath,
  displayTitleForPost,
  formatPakistanDateTime,
  getLatestContentTimestamp,
  getPostImage,
  postPath,
} from "@/lib/utils";
import {
  getNavCategories,
  getPosts,
  getTags,
} from "@/lib/wordpress";
import { getLatestYouTubeVideos } from "@/lib/youtube";

export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    absolute: HOMEPAGE_TITLE,
  },
  description: HOMEPAGE_DESCRIPTION,
  alternates: {
    canonical: absoluteUrl(),
  },
  openGraph: {
    title: HOMEPAGE_TITLE,
    description: HOMEPAGE_DESCRIPTION,
    url: absoluteUrl(),
    type: "website",
  },
};

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

function collectPhotoStories(
  photoCategory: WpCategory | undefined,
  homepagePosts: WpPost[],
  excludeIds: Set<number>,
  extraPosts: WpPost[] = [],
): WpPost[] {
  const pool = [...homepagePosts, ...extraPosts];
  const seen = new Set<number>();
  const selected: WpPost[] = [];

  const preferCategory = (post: WpPost) => {
    if (!photoCategory) return false;
    return Array.isArray(post.categories) && post.categories.includes(photoCategory.id);
  };

  const candidates = [
    ...pool.filter(preferCategory),
    ...pool.filter((post) => !preferCategory(post) && getPostImage(post)),
  ];

  for (const post of candidates) {
    if (excludeIds.has(post.id) || seen.has(post.id)) continue;
    if (!getPostImage(post)) continue;
    seen.add(post.id);
    selected.push(post);
    if (selected.length >= 7) break;
  }

  return selected;
}

async function buildCategorySections(
  categories: WpCategory[],
  homepagePosts: WpPost[],
  leadId: number | undefined,
  boostDefence: boolean,
) {
  const featured = getHomepageSectionCategories(categories, { boostDefence });
  const excludeIds = new Set<number>();
  if (leadId) excludeIds.add(leadId);

  const sections: {
    category: WpCategory;
    posts: WpPost[];
    variant: "grid" | "featured";
  }[] = [];

  for (const category of featured) {
    const canonical = getCategoryCanonicalSlug(category);
    const isDefence = canonical === "defence";
    const limit = isDefence && boostDefence ? 5 : 3;
    let posts = postsForCategory(homepagePosts, category.id, excludeIds, limit);

    if (posts.length < limit && category.count > posts.length) {
      const fetched = await getPosts({
        categories: category.id,
        perPage: limit + 1,
      });
      posts = fetched.posts
        .filter((post) => !excludeIds.has(post.id))
        .slice(0, limit);
    }

    if (posts.length === 0) continue;

    for (const post of posts) {
      excludeIds.add(post.id);
    }

    sections.push({
      category,
      posts,
      variant: isDefence && boostDefence ? "featured" : "grid",
    });
  }

  return { sections, excludeIds };
}

export default async function HomePage() {
  const boostDefence = shouldBoostDefenceSection();

  const [feed, categories, tags, latestVideos] = await Promise.all([
    getPosts({ page: 1, perPage: 24 }),
    getNavCategories(),
    getTags(12),
    getLatestYouTubeVideos(4),
  ]);

  const { posts, fromSnapshot, snapshotMessage } = feed;
  const editorialAvailable = hasEditorialPosts(feed);
  const showSnapshotNotice =
    editorialAvailable && fromSnapshot && Boolean(snapshotMessage);

  if (!editorialAvailable) {
    return (
      <div className="page-shell feed-unavailable-layout">
        <FeedUnavailablePanel message={snapshotMessage} />
        <div className="feed-unavailable-ads">
          <AdBanner />
        </div>
      </div>
    );
  }

  const [lead, ...rest] = posts;
  const secondary = rest.slice(0, 4);
  const latestGrid = rest.slice(4, 10);
  const moreLatest = rest.slice(10, 16);
  const sidebarLatest = posts.slice(0, 5);
  const picks = posts.slice(1, 6);

  const { sections: categorySections, excludeIds } = await buildCategorySections(
    categories,
    posts,
    lead?.id,
    boostDefence,
  );

  const photoCategory = findCategoryByCanonical(categories, "photo-stories");
  let photoExtra: WpPost[] = [];
  if (photoCategory && photoCategory.count > 0) {
    const fetched = await getPosts({
      categories: photoCategory.id,
      perPage: 8,
    });
    photoExtra = fetched.posts;
  }

  const photoStories = collectPhotoStories(
    photoCategory,
    posts,
    excludeIds,
    photoExtra,
  );

  for (const post of photoStories) {
    excludeIds.add(post.id);
  }

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

  const opinionIndex = categorySections.findIndex(
    ({ category }) => getCategoryCanonicalSlug(category) === "opinion",
  );
  const beforeOpinion =
    opinionIndex === -1
      ? categorySections
      : categorySections.slice(0, opinionIndex);
  const opinionAndAfter =
    opinionIndex === -1 ? [] : categorySections.slice(opinionIndex);

  return (
    <>
      <SiteEntitiesJsonLd />
      <LatestNewsTicker
        headlines={tickerHeadlines}
        updatedIso={updatedIso}
        updatedLabel={updatedLabel}
      />

      <CampaignBanner />

      {showSnapshotNotice ? <SnapshotNotice message={snapshotMessage} /> : null}

      <div className="page-shell ad-leaderboard-wrap">
        <AdBanner />
      </div>

      <div className="page-shell content-with-sidebar">
        <div className="main-column">
          {lead ? <LeadStory post={lead} /> : null}

          {secondary.length > 0 ? (
            <section className="section" aria-labelledby="secondary-heading">
              <SectionHeading
                title="Latest Stories"
                titleId="secondary-heading"
                description="Selected reports from the newsroom."
                href="/latest"
              />
              <div className="article-grid two-col">
                {secondary.map((post) => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          ) : null}

          {latestGrid.length > 0 ? (
            <section className="section" aria-labelledby="latest-heading">
              <SectionHeading
                title="Latest News"
                titleId="latest-heading"
                description="Fresh coverage in English and Urdu."
                href="/latest"
              />
              <div className="article-grid three-col">
                {latestGrid.map((post) => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          ) : null}

          {beforeOpinion.map(({ category, posts: sectionPosts, variant }) => (
            <CategoryNewsSection
              key={category.id}
              category={category}
              posts={sectionPosts}
              variant={variant}
              linkLabel={
                getCategoryCanonicalSlug(category) === "defence"
                  ? "View all Defence news"
                  : undefined
              }
            />
          ))}

          <PhotoStoriesSection
            posts={photoStories}
            categoryHref={
              photoCategory
                ? categoryPath(photoCategory.slug)
                : "/categories"
            }
          />

          {latestVideos.length > 0 ? (
            <section className="section" aria-labelledby="videos-heading">
              <SectionHeading
                title="Latest Videos"
                titleId="videos-heading"
                description="From the official AAM News YouTube channel."
                href="/videos"
                linkLabel="View all videos"
              />
              <div className="media-grid media-grid-home">
                {latestVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </section>
          ) : null}

          {opinionAndAfter.map(({ category, posts: sectionPosts, variant }) => (
            <CategoryNewsSection
              key={category.id}
              category={category}
              posts={sectionPosts}
              variant={variant}
            />
          ))}

          {moreLatest.length > 0 ? (
            <section className="section" aria-labelledby="more-latest-heading">
              <SectionHeading
                title="More Latest News"
                titleId="more-latest-heading"
                description="Continue reading from the newsroom."
                href="/latest"
                linkLabel="View all latest"
              />
              <div className="article-grid three-col">
                {moreLatest.map((post) => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          ) : null}

          {categories.length === 0 && tags.length > 0 ? (
            <section className="section" aria-labelledby="topics-heading">
              <SectionHeading
                title="Topics"
                titleId="topics-heading"
                description="Explore recent reporting by topic tag."
              />
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
