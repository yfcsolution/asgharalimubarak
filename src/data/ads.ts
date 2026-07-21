import { existsSync } from "node:fs";
import { join } from "node:path";

export interface AdCampaign {
  id: string;
  name: string;
  image: string;
  mobileImage?: string;
  destinationUrl: string;
  alt: string;
  label?: string;
  placement: "header" | "sidebar" | "sidebar-secondary" | "inline" | "footer";
  startAt?: string;
  endAt?: string;
  enabled: boolean;
  priority?: number;
}

/** Exact Google Maps share link for Slice 'n' Story (do not shorten). */
export const SLICE_N_STORY_URL = "https://share.google/qDvgIXVAYuhGaDCd5";
export const YFC_SOLUTION_URL = "https://yfcsolution.com/";

const SLICE_SOURCE = join(process.cwd(), "public/ads/slice-n-story-source.jpg");
const SLICE_SIDEBAR = join(process.cwd(), "public/ads/slice-n-story-sidebar.webp");
const SLICE_CREATIVES_READY = existsSync(SLICE_SOURCE) && existsSync(SLICE_SIDEBAR);

/** Real sponsor campaigns. */
export const LOCAL_AD_CAMPAIGNS: AdCampaign[] = [
  {
    id: "slice-n-story-sidebar",
    name: "Slice 'n' Story",
    image: "/ads/slice-n-story-sidebar.webp",
    mobileImage: "/ads/slice-n-story-mobile.webp",
    destinationUrl: SLICE_N_STORY_URL,
    alt: "Slice 'n' Story pizza restaurant — open location in Google Maps",
    label: "Sponsored",
    placement: "sidebar",
    enabled: SLICE_CREATIVES_READY,
    priority: 10,
  },
  {
    id: "yfc-solution-sidebar",
    name: "YFC Solution",
    image: "/ads/yfc-solution-sidebar.webp",
    mobileImage: "/ads/yfc-solution-mobile.webp",
    destinationUrl: YFC_SOLUTION_URL,
    alt: "YFC Solution professional websites and digital services",
    label: "Sponsored",
    placement: "sidebar-secondary",
    enabled: true,
    priority: 9,
  },
  {
    id: "yfc-solution-leaderboard",
    name: "YFC Solution",
    image: "/ads/yfc-solution-leaderboard.webp",
    mobileImage: "/ads/yfc-solution-mobile.webp",
    destinationUrl: YFC_SOLUTION_URL,
    alt: "YFC Solution professional websites and digital services",
    label: "Sponsored",
    placement: "header",
    enabled: true,
    priority: 9,
  },
  {
    id: "slice-n-story-leaderboard",
    name: "Slice 'n' Story",
    image: "/ads/slice-n-story-leaderboard.webp",
    mobileImage: "/ads/slice-n-story-mobile.webp",
    destinationUrl: SLICE_N_STORY_URL,
    alt: "Slice 'n' Story pizza restaurant — open location in Google Maps",
    label: "Sponsored",
    placement: "header",
    enabled: false,
    priority: 10,
  },
  {
    id: "yfc-solution-inline",
    name: "YFC Solution",
    image: "/ads/yfc-solution-inline.webp",
    mobileImage: "/ads/yfc-solution-mobile.webp",
    destinationUrl: YFC_SOLUTION_URL,
    alt: "YFC Solution professional websites and digital services",
    label: "Sponsored",
    placement: "inline",
    enabled: true,
    priority: 5,
  },
];
