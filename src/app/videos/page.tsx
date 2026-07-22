import type { Metadata } from "next";
import Link from "next/link";

import { SocialUnavailable } from "@/components/SocialUnavailable";
import { VideoCard } from "@/components/VideoCard";
import { getSiteUrl } from "@/lib/site";
import {
  YOUTUBE_CHANNEL_URL,
  getAllYouTubeVideos,
} from "@/lib/youtube";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "AAM News Videos",
  description:
    "Watch the latest AAM News videos from the official Asghar Ali Mubarak YouTube channel.",
  alternates: { canonical: `${getSiteUrl()}/videos` },
  openGraph: {
    title: "AAM News Videos | Asghar Ali Mubarak",
    description:
      "Watch the latest AAM News videos from the official Asghar Ali Mubarak YouTube channel.",
    url: `${getSiteUrl()}/videos`,
  },
};

type VideosPageProps = {
  searchParams: Promise<{ pageToken?: string }>;
};

export default async function VideosPage({ searchParams }: VideosPageProps) {
  const { pageToken } = await searchParams;
  const result = await getAllYouTubeVideos({
    maxResults: 12,
    pageToken,
  });

  return (
    <div className="page-shell media-page">
      <header className="page-hero">
        <h1>AAM News Videos</h1>
        <p lang="ur" dir="rtl">
          اے اے ایم نیوز ویڈیوز
        </p>
        <p>Latest reports and commentary from the official YouTube channel.</p>
      </header>

      {result.videos.length === 0 ? (
        <SocialUnavailable
          platform="YouTube"
          message={
            result.message ||
            "Latest videos are available on the official AAM News YouTube channel."
          }
          href={YOUTUBE_CHANNEL_URL}
          buttonLabel="Visit YouTube Channel"
        />
      ) : (
        <>
          <div className="media-grid">
            {result.videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
          <div className="media-pagination">
            {result.prevPageToken ? (
              <Link
                href={`/videos?pageToken=${encodeURIComponent(result.prevPageToken)}`}
                className="btn-secondary"
              >
                Previous
              </Link>
            ) : (
              <span />
            )}
            {result.nextPageToken ? (
              <Link
                href={`/videos?pageToken=${encodeURIComponent(result.nextPageToken)}`}
                className="btn-secondary"
              >
                Next
              </Link>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
