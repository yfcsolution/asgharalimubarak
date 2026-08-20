export type AnalyticsEventName =
  | "share_click"
  | "recommend_click"
  | "ad_impression"
  | "ad_click"
  | "page_view";

export type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

/** Optional GA4 measurement ID — never invent an ID. */
export function getGaMeasurementId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  return id && id.startsWith("G-") ? id : undefined;
}

/** No-op analytics abstraction — wire to your provider when ready. */
export function trackEvent(
  name: AnalyticsEventName,
  payload: AnalyticsPayload = {},
): void {
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", name, payload);
  }

  if (typeof window === "undefined") return;
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") {
    gtag("event", name, payload);
  }
}
