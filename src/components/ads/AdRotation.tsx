"use client";

import { useCallback, useEffect, useId, useState } from "react";

import type { AdCampaign } from "@/data/ads";
import { trackEvent } from "@/lib/analytics";

type AdRotationProps = {
  campaigns: AdCampaign[];
  placement: AdCampaign["placement"];
  intervalMs?: number;
  className?: string;
  width: number;
  height: number;
  renderCampaign: (
    campaign: AdCampaign,
    index: number,
    isActive: boolean,
  ) => React.ReactNode;
};

export function AdRotation({
  campaigns,
  placement,
  intervalMs = 10000,
  className = "",
  width,
  height,
  renderCampaign,
}: AdRotationProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const regionId = useId();

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (campaigns.length <= 1 || paused || reduceMotion) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % campaigns.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [campaigns.length, intervalMs, paused, reduceMotion]);

  useEffect(() => {
    const campaign = campaigns[activeIndex];
    if (!campaign) return;
    trackEvent("ad_impression", { ad_id: campaign.id, placement });
  }, [activeIndex, campaigns, placement]);

  if (campaigns.length === 0) return null;

  return (
    <div
      className={`ad-rotation ${className}`.trim()}
      style={{ width: "100%", maxWidth: width, aspectRatio: `${width} / ${height}` }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
      role="region"
      aria-label="Advertisement"
      aria-roledescription="carousel"
      id={regionId}
    >
      {campaigns.map((campaign, index) => (
        <div
          key={campaign.id}
          className={`ad-rotation-slide${index === activeIndex ? " is-active" : ""}`}
          aria-hidden={index !== activeIndex}
        >
          {renderCampaign(campaign, index, index === activeIndex)}
        </div>
      ))}
    </div>
  );
}

export function useAdClickHandler(placement: AdCampaign["placement"]) {
  return useCallback(
    (campaign: AdCampaign) => {
      trackEvent("ad_click", { ad_id: campaign.id, placement });
    },
    [placement],
  );
}
