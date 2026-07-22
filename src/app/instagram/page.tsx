import type { Metadata } from "next";
import Image from "next/image";

import { SocialUnavailable } from "@/components/SocialUnavailable";
import { getInstagramMedia, getOfficialInstagramUrl } from "@/lib/instagram";
import { getSiteUrl } from "@/lib/site";
import { formatPakistanDate } from "@/lib/utils";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "AAM News on Instagram",
  description:
    "Follow AAM News on Instagram for photos and public updates from Asghar Ali Mubarak.",
  alternates: { canonical: `${getSiteUrl()}/instagram` },
  openGraph: {
    title: "AAM News on Instagram | Asghar Ali Mubarak",
    description:
      "Follow AAM News on Instagram for photos and public updates from Asghar Ali Mubarak.",
    url: `${getSiteUrl()}/instagram`,
  },
};

export default async function InstagramPage() {
  const instagramUrl = getOfficialInstagramUrl();
  const result = await getInstagramMedia(12);

  return (
    <div className="page-shell media-page">
      <header className="page-hero">
        <h1>AAM News on Instagram</h1>
        <p>Public photos and updates from the official Instagram account.</p>
      </header>

      {result.media.length === 0 ? (
        <SocialUnavailable
          platform="Instagram"
          message={
            result.message ||
            "Follow AAM News on the official Instagram account for photos and updates."
          }
          href={instagramUrl}
          buttonLabel="Visit Instagram"
        />
      ) : (
        <div className="media-grid">
          {result.media.map((item) => {
            const caption =
              item.caption.length > 160
                ? `${item.caption.slice(0, 160).trimEnd()}…`
                : item.caption;
            const imageSrc = item.thumbnailUrl || item.mediaUrl;
            return (
              <article key={item.id} className="media-card">
                {imageSrc ? (
                  <a
                    href={item.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="media-card-thumb-link"
                  >
                    <Image
                      src={imageSrc}
                      alt=""
                      width={640}
                      height={640}
                      className="media-card-thumb"
                    />
                  </a>
                ) : null}
                <div className="media-card-body">
                  <span className="social-source-badge social-source-instagram">
                    INSTAGRAM
                  </span>
                  <p className="media-card-meta">
                    <span>{item.mediaType}</span>
                    {" · "}
                    <time dateTime={item.timestamp}>
                      {formatPakistanDate(item.timestamp)}
                    </time>
                  </p>
                  {caption ? <p className="media-card-excerpt">{caption}</p> : null}
                  <a
                    href={item.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    Open on Instagram
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
