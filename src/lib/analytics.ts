export type AnalyticsEventName =
  | "share_click"
  | "recommend_click"
  | "ad_impression"
  | "ad_click";

export type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

/** No-op analytics abstraction — wire to your provider when ready. */
export function trackEvent(
  name: AnalyticsEventName,
  payload: AnalyticsPayload = {},
): void {
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", name, payload);
  }
}
