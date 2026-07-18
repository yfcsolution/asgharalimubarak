import {
  PAKISTAN_TIME_ZONE,
  UPDATE_THRESHOLD_MS,
} from "@/lib/site";

export function toPakistanDate(input: string | Date): Date {
  return input instanceof Date ? input : new Date(input);
}

export function formatPakistanDate(
  input: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
  locale = "en-PK",
): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: PAKISTAN_TIME_ZONE,
    ...options,
  }).format(toPakistanDate(input));
}

export function formatPakistanDateTime(input: string | Date): string {
  return formatPakistanDate(input, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatPakistanCompactDate(input: string | Date): string {
  return formatPakistanDate(input, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function isMeaningfullyUpdated(
  published: string,
  modified?: string,
  thresholdMs: number = UPDATE_THRESHOLD_MS,
): boolean {
  if (!modified) return false;
  const publishedMs = new Date(published).getTime();
  const modifiedMs = new Date(modified).getTime();
  if (Number.isNaN(publishedMs) || Number.isNaN(modifiedMs)) return false;
  return modifiedMs - publishedMs >= thresholdMs;
}

export function getLatestContentTimestamp(
  posts: Array<{ date: string; modified?: string }>,
): string | null {
  let latest: number | null = null;
  for (const post of posts) {
    const candidates = [post.date, post.modified].filter(Boolean) as string[];
    for (const value of candidates) {
      const ms = new Date(value).getTime();
      if (Number.isNaN(ms)) continue;
      if (latest === null || ms > latest) latest = ms;
    }
  }
  return latest === null ? null : new Date(latest).toISOString();
}
