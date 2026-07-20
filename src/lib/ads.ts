import type { AdCampaign } from "@/data/ads";
import { LOCAL_AD_CAMPAIGNS } from "@/data/ads";

const SAFE_URL_PATTERN = /^https?:\/\//i;
const BLOCKED_URL_PATTERN = /^(javascript|data):/i;

export function isSafeAdUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (BLOCKED_URL_PATTERN.test(trimmed)) return false;
  return SAFE_URL_PATTERN.test(trimmed);
}

export function isCampaignActive(campaign: AdCampaign, now = Date.now()): boolean {
  if (!campaign.enabled) return false;
  if (!isSafeAdUrl(campaign.destinationUrl)) return false;

  if (campaign.startAt) {
    const start = Date.parse(campaign.startAt);
    if (!Number.isNaN(start) && now < start) return false;
  }

  if (campaign.endAt) {
    const end = Date.parse(campaign.endAt);
    if (!Number.isNaN(end) && now > end) return false;
  }

  return true;
}

export function getActiveCampaigns(
  campaigns: AdCampaign[],
  placement: AdCampaign["placement"],
  now = Date.now(),
): AdCampaign[] {
  return campaigns
    .filter(
      (campaign) => campaign.placement === placement && isCampaignActive(campaign, now),
    )
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}

export async function loadAdCampaigns(): Promise<AdCampaign[]> {
  const remoteUrl = process.env.ADS_CONFIG_URL?.trim();
  if (!remoteUrl || !isSafeAdUrl(remoteUrl)) {
    return LOCAL_AD_CAMPAIGNS;
  }

  try {
    const response = await fetch(remoteUrl, {
      next: { revalidate: 300 },
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return LOCAL_AD_CAMPAIGNS;

    const data = (await response.json()) as { campaigns?: AdCampaign[] };
    if (!Array.isArray(data.campaigns)) return LOCAL_AD_CAMPAIGNS;

    const validated = data.campaigns.filter(
      (campaign) =>
        typeof campaign.id === "string" &&
        typeof campaign.name === "string" &&
        typeof campaign.image === "string" &&
        typeof campaign.destinationUrl === "string" &&
        typeof campaign.alt === "string" &&
        typeof campaign.placement === "string" &&
        typeof campaign.enabled === "boolean",
    );

    return validated.length > 0 ? validated : LOCAL_AD_CAMPAIGNS;
  } catch {
    return LOCAL_AD_CAMPAIGNS;
  }
}
