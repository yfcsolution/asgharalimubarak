import Link from "next/link";

import { ArticleCard } from "@/components/ArticleCard";
import { BreakingStrip } from "@/components/BreakingStrip";
import { LeadStory } from "@/components/LeadStory";
import { NewsSidebar } from "@/components/news-sidebar";
import { SITE_NAME } from "@/lib/site";
import {
  displayTitleForPost,
  postPath,
} from "@/lib/utils";
import {
  getNavCategories,
  getPosts,
  getTags,
} from "@/lib/wordpress";

export const revalidate = 60;

export default async function HomePage() {
  const [{ posts }, categories, tags] = await Promise.all([
    getPosts({ page: 1, perPage: 14 }),
    getNavCategories(),
    getTags(12),
  ]);

  const [lead, ...rest] = posts;
  const secondary = rest.slice(0, 4);
  const latestGrid = rest.slice(4, 10);
  const sidebarLatest = posts.slice(0, 5);
  const picks = posts.slice(1, 6);

  const stripItems = posts.slice(0, 6).map((post) => {
    const title = displayTitleForPost(post);
    return {
      href: postPath(post.slug),
      label: title.text,
      dir: title.dir,
      lang: title.lang,
    };
  });

  return (
    <>
      <BreakingStrip items={stripItems} />

      <div className="page-shell content-with-sidebar">
        <div className="main-column">
          {lead ? <LeadStory post={lead} /> : null}

          {secondary.length > 0 ? (
            <section className="section" aria-labelledby="secondary-heading">
              <div className="section-heading">
                <div>
                  <h2 id="secondary-heading">Top stories</h2>
                  <p>Selected reports from the newsroom.</p>
                </div>
              </div>
              <div className="article-grid two-col">
                {secondary.map((post) => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          ) : null}

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

          {categories.length > 0 ? (
            <section className="section" aria-labelledby="categories-heading">
              <div className="section-heading">
                <div>
                  <h2 id="categories-heading">Sections</h2>
                  <p>Browse by WordPress category.</p>
                </div>
              </div>
              <ul className="section-chip-row">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/category/${encodeURIComponent(category.slug)}`}
                      className="section-chip"
                      dir="auto"
                    >
                      {category.name}
                      <span>{category.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <section className="section" aria-labelledby="topics-heading">
              <div className="section-heading">
                <div>
                  <h2 id="topics-heading">Topics</h2>
                  <p>
                    WordPress currently files posts under Uncategorized. Topic
                    tags below are taken from the CMS.
                  </p>
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
          )}
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
