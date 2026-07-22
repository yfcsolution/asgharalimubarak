import Image from "next/image";
import Link from "next/link";

import type { YouTubeVideo } from "@/lib/youtube-types";
import { formatPakistanDate } from "@/lib/utils";

export function VideoCard({ video }: { video: YouTubeVideo }) {
  const excerpt =
    video.description.length > 140
      ? `${video.description.slice(0, 140).trimEnd()}…`
      : video.description;

  return (
    <article className="media-card">
      <Link href={`/videos/${video.id}`} className="media-card-thumb-link">
        {video.thumbnail ? (
          <Image
            src={video.thumbnail.url}
            alt=""
            width={video.thumbnail.width || 640}
            height={video.thumbnail.height || 360}
            className="media-card-thumb"
          />
        ) : (
          <span className="media-card-thumb media-card-thumb-fallback" aria-hidden="true">
            VIDEO
          </span>
        )}
      </Link>
      <div className="media-card-body">
        <span className="social-source-badge social-source-youtube">YOUTUBE</span>
        <h2 className="media-card-title">
          <Link href={`/videos/${video.id}`}>{video.title}</Link>
        </h2>
        <p className="media-card-meta">
          <time dateTime={video.publishedAt}>
            {formatPakistanDate(video.publishedAt)}
          </time>
        </p>
        {excerpt ? <p className="media-card-excerpt">{excerpt}</p> : null}
        <div className="media-card-actions">
          <Link href={`/videos/${video.id}`} className="btn-primary">
            Watch
          </Link>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Open on YouTube
          </a>
        </div>
      </div>
    </article>
  );
}
