import { existsSync } from "node:fs";
import { join } from "node:path";

import { PAKISTAN_TIME_ZONE } from "@/lib/site";

export type SeasonalCampaign = {
  id: string;
  title: string;
  subtitle?: string;
  dateLabel?: string;
  tagline?: string;
  brandLine?: string;
  titleUr?: string;
  dateLabelUr?: string;
  taglineUr?: string;
  /** Relative public path without extension, e.g. /images/campaigns/pakistan-defence-day */
  imageBase?: string;
  /** Fallback SVG under public/ when raster assets are absent */
  fallbackSvg?: string;
  startDate?: string;
  endDate?: string;
  enabled: boolean;
  href?: string;
  ariaLabel: string;
  linkLabel?: string;
  /** CSS theme hook: defence-day | independence-day */
  theme: "defence-day" | "independence-day";
  /** When true, temporarily boost Defence homepage section */
  boostDefence?: boolean;
};

/**
 * Reusable national-day campaigns. Only one active campaign is shown at a time
 * (first match by array order whose dates include “today” in Asia/Karachi).
 */
export const SEASONAL_CAMPAIGNS: SeasonalCampaign[] = [
  {
    id: "defence-day",
    title: "Pakistan Defence Day",
    subtitle: "Honouring Courage, Sacrifice and National Defence",
    dateLabel: "6 September",
    tagline: "Remembrance · Service · National Unity",
    brandLine: "AAM News — New Generation's News Leader",
    titleUr: "یومِ دفاعِ پاکستان",
    dateLabelUr: "6 ستمبر",
    taglineUr: "شہداء اور غازیوں کو سلام",
    imageBase: "/images/campaigns/pakistan-defence-day",
    fallbackSvg: "/images/campaigns/pakistan-defence-day.svg",
    startDate: "2026-09-01",
    endDate: "2026-09-07",
    enabled: true,
    href: "/category/defence",
    ariaLabel: "Pakistan Defence Day",
    linkLabel: "Read Defence Day coverage",
    theme: "defence-day",
    boostDefence: true,
  },
  {
    id: "independence-day",
    title: "Pakistan Independence Day",
    subtitle: "AAM News greets the nation",
    dateLabel: "14 August",
    brandLine: "AAM News — New Generation's News Leader",
    titleUr: "یومِ آزادی",
    dateLabelUr: "۱۴ اگست",
    taglineUr: "پاکستان زندہ باد",
    imageBase: "/images/campaigns/independence-day",
    fallbackSvg: "/images/campaigns/independence-day.svg",
    startDate: "2026-08-10",
    endDate: "2026-08-16",
    enabled: true,
    ariaLabel: "Pakistan Independence Day",
    theme: "independence-day",
    boostDefence: false,
  },
];

/** YYYY-MM-DD for “now” in Asia/Karachi (never browser local TZ). */
export function getPakistanCalendarDate(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PAKISTAN_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function parseEnvFlag(raw: string | undefined): boolean | null {
  if (!raw) return null;
  const value = raw.trim().toLowerCase();
  if (value === "false" || value === "0" || value === "off") return false;
  if (value === "true" || value === "1" || value === "on") return true;
  return null;
}

function isDateInRange(
  today: string,
  startDate?: string,
  endDate?: string,
): boolean {
  if (startDate && today < startDate) return false;
  if (endDate && today > endDate) return false;
  return true;
}

export function isCampaignActive(
  campaign: SeasonalCampaign,
  now: Date = new Date(),
): boolean {
  if (!campaign.enabled) return false;

  const forceId = process.env.SEASONAL_CAMPAIGN_FORCE?.trim().toLowerCase();
  if (forceId) {
    return forceId === campaign.id.toLowerCase();
  }

  const globalFlag = parseEnvFlag(process.env.SEASONAL_CAMPAIGN_ENABLED);
  if (globalFlag === false) return false;

  // Legacy Independence Day kill-switch
  if (campaign.id === "independence-day") {
    const legacy = parseEnvFlag(process.env.INDEPENDENCE_DAY_BANNER_ENABLED);
    if (legacy === false) return false;
    if (legacy === true) return true;
  }

  const today = getPakistanCalendarDate(now);
  return isDateInRange(today, campaign.startDate, campaign.endDate);
}

export function getActiveSeasonalCampaign(
  now: Date = new Date(),
): SeasonalCampaign | null {
  for (const campaign of SEASONAL_CAMPAIGNS) {
    if (isCampaignActive(campaign, now)) return campaign;
  }
  return null;
}

export function shouldBoostDefenceSection(now: Date = new Date()): boolean {
  const active = getActiveSeasonalCampaign(now);
  return Boolean(active?.boostDefence);
}

const RASTER_EXTS = [".webp", ".png", ".jpg", ".jpeg"] as const;

export function resolveCampaignImageSrc(
  campaign: SeasonalCampaign,
): { src: string; isSvg: boolean } | null {
  if (campaign.imageBase) {
    const baseName = campaign.imageBase.replace(/^\//, "");
    for (const ext of RASTER_EXTS) {
      const diskPath = join(process.cwd(), "public", `${baseName}${ext}`);
      if (existsSync(diskPath)) {
        return { src: `/${baseName}${ext}`, isSvg: false };
      }
    }
  }

  if (campaign.fallbackSvg) {
    const svgRel = campaign.fallbackSvg.replace(/^\//, "");
    const diskPath = join(process.cwd(), "public", svgRel);
    if (existsSync(diskPath)) {
      return { src: campaign.fallbackSvg, isSvg: true };
    }
  }

  return null;
}
