import Link from "next/link";

import { LinkedPostImage } from "@/components/PostImage";
import type { WpPost } from "@/lib/types";
import {
  decodeHtml,
  excerptText,
  formatDate,
  getFeaturedImage,
  postPath,
} from "@/lib/utils";

export function LeadStory({ post }: { post: WpPost }) {
  const title = decodeHtml(post.title.rendered);
  const href = postPath(post.slug);
  const image = getFeaturedImage(post);

  return (
    <section className="lead-story" aria-labelledby="lead-story-title">
      <div className="lead-story-media">
        <LinkedPostImage
          href={href}
          image={image}
          title={title}
          priority
          className="lead-story-image"
          sizes="100vw"
          fillParent
        />
      </div>

      <div className="lead-story-content">
        <p className="lead-kicker animate-fade-up">Top Story · سرخی خبر</p>
        <h1 id="lead-story-title" className="lead-title animate-fade-up delay-1">
          <Link href={href} dir="auto">
            {title}
          </Link>
        </h1>
        <p className="lead-excerpt animate-fade-up delay-2" dir="auto">
          {excerptText(post, 200)}
        </p>
        <div className="lead-cta animate-fade-up delay-3">
          <Link href={href} className="btn-primary">
            Read full report
          </Link>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
      </div>
    </section>
  );
}
