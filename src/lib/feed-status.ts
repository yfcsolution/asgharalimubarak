import type { PaginatedPosts } from "@/lib/types";

export const FEED_UNAVAILABLE_MESSAGE =
  "Newsroom feed temporarily unavailable. Please try again shortly.";

export const SNAPSHOT_MESSAGE = "Showing the latest saved edition.";

export function isFeedUnavailable(
  result: Pick<PaginatedPosts, "feedUnavailable">,
): boolean {
  return Boolean(result.feedUnavailable);
}

export function hasEditorialPosts(result: Pick<PaginatedPosts, "posts">): boolean {
  return result.posts.length > 0;
}
