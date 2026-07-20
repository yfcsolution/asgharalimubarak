export interface AdCampaign {
  id: string;
  name: string;
  image: string;
  mobileImage?: string;
  destinationUrl: string;
  alt: string;
  label?: string;
  placement: "header" | "sidebar" | "inline" | "footer";
  startAt?: string;
  endAt?: string;
  enabled: boolean;
  priority?: number;
}

/** Sample campaigns — all disabled in production until real sponsors are configured. */
export const LOCAL_AD_CAMPAIGNS: AdCampaign[] = [
  {
    id: "sample-leaderboard",
    name: "Sample Leaderboard",
    image: "/images/ads/leaderboard-placeholder.svg",
    destinationUrl: "https://example.com",
    alt: "Advertisement placeholder",
    label: "Advertisement",
    placement: "header",
    enabled: process.env.NODE_ENV !== "production",
    priority: 0,
  },
  {
    id: "sample-sidebar",
    name: "Sample Sidebar",
    image: "/images/ads/sidebar-placeholder.svg",
    destinationUrl: "https://example.com",
    alt: "Advertisement placeholder",
    label: "Advertisement",
    placement: "sidebar",
    enabled: process.env.NODE_ENV !== "production",
    priority: 0,
  },
  {
    id: "sample-inline",
    name: "Sample Inline",
    image: "/images/ads/inline-placeholder.svg",
    destinationUrl: "https://example.com",
    alt: "Advertisement placeholder",
    label: "Sponsored",
    placement: "inline",
    enabled: process.env.NODE_ENV !== "production",
    priority: 0,
  },
];
