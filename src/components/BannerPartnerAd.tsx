"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { trackEvent } from "@/lib/analytics";
import { DEVELOPER_CREDIT } from "@/lib/site";

const MESSAGES = [
  "Websites & Next.js apps",
  "SEO & digital marketing",
  "Automation & ERP systems",
  "Virtual assistant teams",
] as const;

export function BannerPartnerAd({ compact = false }: { compact?: boolean }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    trackEvent("ad_impression", { ad_id: "yfc-banner-partner", placement: "header" });
  }, []);

  useEffect(() => {
    if (compact || paused || reduceMotion) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % MESSAGES.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [compact, paused, reduceMotion]);

  const message = MESSAGES[index];

  return (
    <aside
      className={`banner-partner-ad${compact ? " banner-partner-ad-compact" : ""}`}
      aria-label="Sponsored partner advertisement"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
    >
      <Link
        href={DEVELOPER_CREDIT.companyUrl}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="banner-partner-ad-link"
        aria-label={`Sponsored: ${DEVELOPER_CREDIT.company} — ${DEVELOPER_CREDIT.descriptor}`}
        onClick={() =>
          trackEvent("ad_click", { ad_id: "yfc-banner-partner", placement: "header" })
        }
      >
        <span className="banner-partner-ad-label">Sponsored</span>
        <span className="banner-partner-ad-brand">{DEVELOPER_CREDIT.company}</span>
        <span className="banner-partner-ad-tagline" aria-live="polite">
          {message}
        </span>
        <span className="banner-partner-ad-cta">Visit yfcsolution.com</span>
      </Link>
    </aside>
  );
}
