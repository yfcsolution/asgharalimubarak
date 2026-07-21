import { getActiveCampaigns, loadAdCampaigns } from "@/lib/ads";

import { RotatingAds } from "./AdClient";

const WIDTH = 640;
const HEIGHT = 120;

export async function InlineAd() {
  const campaigns = getActiveCampaigns(await loadAdCampaigns(), "inline");
  if (campaigns.length === 0) return null;

  return (
    <aside className="ad-slot ad-slot-inline" aria-label="Advertisement">
      <RotatingAds
        campaigns={campaigns}
        placement="inline"
        width={WIDTH}
        height={HEIGHT}
        className="ad-inline"
        linkClassName="ad-inline-link"
      />
    </aside>
  );
}
