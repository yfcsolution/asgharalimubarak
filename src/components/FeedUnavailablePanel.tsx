"use client";

import { useRouter } from "next/navigation";

import { FEED_UNAVAILABLE_MESSAGE } from "@/lib/feed-status";

type FeedUnavailablePanelProps = {
  message?: string;
};

export function FeedUnavailablePanel({
  message = FEED_UNAVAILABLE_MESSAGE,
}: FeedUnavailablePanelProps) {
  const router = useRouter();

  return (
    <section className="feed-unavailable-panel" aria-labelledby="feed-unavailable-heading">
      <h2 id="feed-unavailable-heading" className="feed-unavailable-title">
        Feed unavailable
      </h2>
      <p className="feed-unavailable-message" role="status">
        {message}
      </p>
      <div className="feed-unavailable-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={() => router.refresh()}
          aria-label="Try again to reload newsroom feed"
        >
          Try again
        </button>
      </div>
    </section>
  );
}
