import { getActiveCampaigns, loadAdCampaigns } from "@/lib/ads";

import { RotatingAds } from "./AdClient";

const WIDTH = 728;
const HEIGHT = 90;

export async function AdBanner() {
  const campaigns = getActiveCampaigns(await loadAdCampaigns(), "header");
  if (campaigns.length === 0) return null;

  return (
    <aside className="ad-slot ad-slot-leaderboard" aria-label="Advertisement">
      <RotatingAds
        campaigns={campaigns}
        placement="header"
        width={WIDTH}
        height={HEIGHT}
        className="ad-leaderboard"
        linkClassName="ad-leaderboard-link"
      />
    </aside>
  );
}
