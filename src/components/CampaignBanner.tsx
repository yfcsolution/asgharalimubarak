import Link from "next/link";

import {
  getActiveSeasonalCampaign,
  resolveCampaignImageSrc,
  type SeasonalCampaign,
} from "@/lib/seasonal-campaigns";
import { findCategoryByCanonical } from "@/lib/category-config";
import { getNavCategories } from "@/lib/wordpress";

function resolveCampaignHref(
  campaign: SeasonalCampaign,
  defenceExists: boolean,
): string | undefined {
  if (!campaign.href) return undefined;
  if (campaign.href.includes("/defence") && !defenceExists) {
    return "/latest";
  }
  return campaign.href;
}

function CampaignVisual({ campaign }: { campaign: SeasonalCampaign }) {
  const image = resolveCampaignImageSrc(campaign);

  if (campaign.theme === "defence-day") {
    return (
      <div className="campaign-banner-panel campaign-banner-panel--defence">
        <div className="campaign-banner-motif" aria-hidden="true">
          {image ? (
            // Decorative backdrop — copy is semantic HTML below
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.src}
              alt=""
              className="campaign-banner-backdrop"
              width={1280}
              height={300}
            />
          ) : (
            <div className="campaign-banner-backdrop campaign-banner-backdrop--css" />
          )}
        </div>

        <div className="campaign-banner-copy">
          <p className="campaign-banner-kicker">{campaign.dateLabel}</p>
          <p className="campaign-banner-title">{campaign.title}</p>
          {campaign.subtitle ? (
            <p className="campaign-banner-subtitle">{campaign.subtitle}</p>
          ) : null}
          {campaign.brandLine ? (
            <p className="campaign-banner-brand">{campaign.brandLine}</p>
          ) : null}
        </div>

        <div className="campaign-banner-urdu" lang="ur" dir="rtl">
          {campaign.titleUr ? (
            <p className="campaign-banner-title-ur">{campaign.titleUr}</p>
          ) : null}
          {campaign.dateLabelUr ? (
            <p className="campaign-banner-date-ur">{campaign.dateLabelUr}</p>
          ) : null}
          {campaign.taglineUr ? (
            <p className="campaign-banner-tagline-ur">{campaign.taglineUr}</p>
          ) : null}
        </div>
      </div>
    );
  }

  if (!image) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.src}
      alt={`${campaign.title}${campaign.dateLabel ? ` — ${campaign.dateLabel}` : ""} — AAM News`}
      className="campaign-banner-image"
      width={1280}
      height={280}
    />
  );
}

function BannerInner({ campaign }: { campaign: SeasonalCampaign }) {
  return (
    <div className="campaign-banner-inner">
      <CampaignVisual campaign={campaign} />
    </div>
  );
}

/**
 * Active seasonal national-day campaign (Asia/Karachi date windows).
 */
export async function CampaignBanner() {
  const campaign = getActiveSeasonalCampaign();
  if (!campaign) return null;

  const categories = await getNavCategories();
  const defenceExists = Boolean(findCategoryByCanonical(categories, "defence"));
  const href = resolveCampaignHref(campaign, defenceExists);
  const className = `campaign-banner campaign-banner--${campaign.theme}`;

  if (href) {
    return (
      <section className={className} aria-label={campaign.ariaLabel}>
        <Link
          href={href}
          className="campaign-banner-link"
          aria-label={campaign.linkLabel ?? campaign.ariaLabel}
        >
          <BannerInner campaign={campaign} />
        </Link>
      </section>
    );
  }

  return (
    <section className={className} aria-label={campaign.ariaLabel}>
      <BannerInner campaign={campaign} />
    </section>
  );
}

/** @deprecated Prefer getActiveSeasonalCampaign */
export function isIndependenceDayBannerEnabled(): boolean {
  return getActiveSeasonalCampaign()?.id === "independence-day";
}
