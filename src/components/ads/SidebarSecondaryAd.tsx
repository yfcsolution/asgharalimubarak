import { getActiveCampaigns, loadAdCampaigns } from "@/lib/ads";

import { RotatingAds } from "./AdClient";

const WIDTH = 300;
const HEIGHT = 250;

export async function SidebarSecondaryAd() {
  const campaigns = getActiveCampaigns(await loadAdCampaigns(), "sidebar-secondary");
  if (campaigns.length === 0) return null;

  return (
    <aside className="ad-slot ad-slot-sidebar sidebar-block" aria-label="Advertisement">
      <RotatingAds
        campaigns={campaigns}
        placement="sidebar-secondary"
        width={WIDTH}
        height={HEIGHT}
        className="ad-sidebar"
        linkClassName="ad-sidebar-link"
      />
    </aside>
  );
}
