import Link from "next/link";

import { ArticleCard } from "@/components/ArticleCard";
import { LeadStory } from "@/components/LeadStory";
import { SITE_NAME, SITE_TAGLINE, SITE_TAGLINE_UR } from "@/lib/site";
import { getCategories, getPosts } from "@/lib/wordpress";
import { categoryPath, decodeHtml } from "@/lib/utils";

export const revalidate = 60;

export default async function HomePage() {
  const [{ posts }, categories] = await Promise.all([
    getPosts({ page: 1, perPage: 10 }),
    getCategories(),
  ]);

  const [lead, ...rest] = posts;
  const secondary = rest.slice(0, 3);
  const more = rest.slice(3);

  return (
    <>
      {lead ? <LeadStory post={lead} /> : null}

      <section className="section page-wrap" aria-labelledby="latest-heading">
        <div className="section-heading">
          <div>
            <h2 id="latest-heading">Latest reports</h2>
            <p>
              {SITE_TAGLINE}{" "}
              <span lang="ur" dir="rtl">
                {SITE_TAGLINE_UR}
              </span>
            </p>
          </div>
          <Link href="/latest" className="section-link">
            View all news
          </Link>
        </div>

        {secondary.length > 0 ? (
          <div className="article-grid featured-layout">
            {secondary.map((post, index) => (
              <ArticleCard
                key={post.id}
                post={post}
                featured={index === 0}
              />
            ))}
          </div>
        ) : null}
      </section>

      {categories.length > 0 ? (
        <section className="section page-wrap" aria-labelledby="categories-heading">
          <div className="section-heading">
            <div>
              <h2 id="categories-heading">Browse by category</h2>
              <p>Explore published coverage by topic.</p>
            </div>
          </div>
          <ul className="meta-pills" aria-label="Categories">
            {categories.map((category) => (
              <li key={category.id}>
                <Link href={categoryPath(category.slug)} className="meta-pill">
                  <span dir="auto">
                    {decodeHtml(category.name)} ({category.count})
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {more.length > 0 ? (
        <section className="section page-wrap" aria-labelledby="more-heading">
          <div className="section-heading">
            <div>
              <h2 id="more-heading">More from {SITE_NAME}</h2>
              <p>Continued coverage from the newsroom.</p>
            </div>
          </div>
          <div className="article-grid three-col">
            {more.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
