import type { Metadata } from "next";

import { SocialUnavailable } from "@/components/SocialUnavailable";
import { getFacebookPosts, getOfficialFacebookUrl } from "@/lib/facebook";
import { getSiteUrl } from "@/lib/site";
import { formatPakistanDate } from "@/lib/utils";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "AAM News on Facebook",
  description:
    "Follow AAM News on Facebook for public updates from Asghar Ali Mubarak.",
  alternates: { canonical: `${getSiteUrl()}/facebook` },
  openGraph: {
    title: "AAM News on Facebook | Asghar Ali Mubarak",
    description:
      "Follow AAM News on Facebook for public updates from Asghar Ali Mubarak.",
    url: `${getSiteUrl()}/facebook`,
  },
};

export default async function FacebookPage() {
  const facebookUrl = getOfficialFacebookUrl();
  const result = await getFacebookPosts(12);

  return (
    <div className="page-shell media-page">
      <header className="page-hero">
        <h1>AAM News on Facebook</h1>
        <p>Public updates from the official Facebook page.</p>
      </header>

      {result.posts.length === 0 ? (
        <SocialUnavailable
          platform="Facebook"
          message={
            result.message ||
            "Follow AAM News on the official Facebook page for updates and public posts."
          }
          href={facebookUrl}
          buttonLabel="Visit Facebook Page"
        />
      ) : (
        <div className="media-grid">
          {result.posts.map((post) => (
            <article key={post.id} className="media-card">
              <div className="media-card-body">
                <span className="social-source-badge social-source-facebook">
                  FACEBOOK
                </span>
                {post.message ? (
                  <p className="media-card-excerpt">{post.message}</p>
                ) : (
                  <p className="media-card-excerpt">View this post on Facebook.</p>
                )}
                <p className="media-card-meta">
                  <time dateTime={post.createdAt}>
                    {formatPakistanDate(post.createdAt)}
                  </time>
                </p>
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Open on Facebook
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
