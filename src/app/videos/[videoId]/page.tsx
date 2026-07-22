import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getSiteUrl, SITE_NAME } from "@/lib/site";
import { formatPakistanDate } from "@/lib/utils";
import {
  YOUTUBE_CHANNEL_URL,
  getYouTubeVideoById,
  isYouTubeConfigured,
} from "@/lib/youtube";

export const revalidate = 1800;

type VideoPageProps = {
  params: Promise<{ videoId: string }>;
};

export async function generateMetadata({
  params,
}: VideoPageProps): Promise<Metadata> {
  const { videoId } = await params;
  const video = await getYouTubeVideoById(videoId);
  if (!video) {
    return { title: "Video" };
  }
  return {
    title: video.title,
    description: video.description.slice(0, 160) || `Watch ${video.title} on AAM News.`,
    alternates: { canonical: `${getSiteUrl()}/videos/${video.id}` },
    openGraph: {
      title: video.title,
      description: video.description.slice(0, 160),
      url: `${getSiteUrl()}/videos/${video.id}`,
      type: "video.other",
      videos: [{ url: video.url }],
    },
  };
}

export default async function VideoDetailPage({ params }: VideoPageProps) {
  const { videoId } = await params;
  if (!isYouTubeConfigured()) {
    notFound();
  }

  const video = await getYouTubeVideoById(videoId);
  if (!video) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    uploadDate: video.publishedAt,
    thumbnailUrl: video.thumbnail?.url,
    contentUrl: video.url,
    embedUrl: video.embedUrl,
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "AAM News",
      alternateName: SITE_NAME,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: getSiteUrl() },
      {
        "@type": "ListItem",
        position: 2,
        name: "Videos",
        item: `${getSiteUrl()}/videos`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: video.title,
        item: `${getSiteUrl()}/videos/${video.id}`,
      },
    ],
  };

  return (
    <div className="page-shell media-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/videos">Videos</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{video.title}</span>
      </nav>

      <header className="page-hero">
        <span className="social-source-badge social-source-youtube">YOUTUBE</span>
        <h1>{video.title}</h1>
        <p>
          <time dateTime={video.publishedAt}>
            {formatPakistanDate(video.publishedAt)}
          </time>
        </p>
      </header>

      <div className="video-embed-wrap">
        <iframe
          src={video.embedUrl}
          title={video.title}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      {video.description ? (
        <div className="prose-page">
          <p style={{ whiteSpace: "pre-wrap" }}>{video.description}</p>
        </div>
      ) : null}

      <div className="media-card-actions">
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Watch on YouTube
        </a>
        <a
          href={YOUTUBE_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
        >
          Visit channel
        </a>
      </div>
    </div>
  );
}
