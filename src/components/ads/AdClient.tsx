"use client";

import Image from "next/image";
import Link from "next/link";

import type { AdCampaign } from "@/data/ads";
import { trackEvent } from "@/lib/analytics";

import { AdRotation } from "./AdRotation";

type AdLinkProps = {
  campaign: AdCampaign;
  placement: AdCampaign["placement"];
  isActive: boolean;
  width: number;
  height: number;
  className?: string;
};

function AdLink({
  campaign,
  placement,
  isActive,
  width,
  height,
  className = "",
}: AdLinkProps) {
  return (
    <Link
      href={campaign.destinationUrl}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className={`ad-link ${className}`.trim()}
      tabIndex={isActive ? 0 : -1}
      onClick={() => trackEvent("ad_click", { ad_id: campaign.id, placement })}
      aria-label={`Advertisement: ${campaign.alt}`}
    >
      <span className="ad-label" aria-label="Advertisement">
        {campaign.label ?? "Advertisement"}
      </span>
      <Image
        src={campaign.mobileImage && width <= 400 ? campaign.mobileImage : campaign.image}
        alt={campaign.alt}
        width={width}
        height={height}
        className="ad-image"
        sizes={`(max-width: 768px) 100vw, ${width}px`}
        loading="lazy"
      />
    </Link>
  );
}

type RotatingAdsProps = {
  campaigns: AdCampaign[];
  placement: AdCampaign["placement"];
  width: number;
  height: number;
  className?: string;
  linkClassName?: string;
};

export function RotatingAds({
  campaigns,
  placement,
  width,
  height,
  className = "",
  linkClassName = "",
}: RotatingAdsProps) {
  if (campaigns.length === 0) return null;

  return (
    <AdRotation
      campaigns={campaigns}
      placement={placement}
      width={width}
      height={height}
      className={className}
      renderCampaign={(campaign, _index, isActive) => (
        <AdLink
          campaign={campaign}
          placement={placement}
          isActive={isActive}
          width={width}
          height={height}
          className={linkClassName}
        />
      )}
    />
  );
}
