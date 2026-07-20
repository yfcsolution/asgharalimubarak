import Image from "next/image";

import {
  NEWS_BANNER_ALT,
  NEWS_BANNER_IMAGE,
  SITE_NAME,
  SITE_NAME_UR,
  SITE_TAGLINE,
  SITE_TAGLINE_UR,
} from "@/lib/site";

export type SiteBannerVariant = "full" | "compact";

type SiteBannerProps = {
  variant?: SiteBannerVariant;
  priority?: boolean;
  hidePortrait?: boolean;
};

export function SiteBanner({
  variant = "full",
  priority = false,
  hidePortrait = true,
}: SiteBannerProps) {
  const isCompact = variant === "compact";

  return (
    <section
      className={`site-banner${isCompact ? " site-banner-compact" : ""}`}
      aria-labelledby="site-banner-title"
    >
      <div className="site-banner-media" aria-hidden="true">
        <Image
          src={NEWS_BANNER_IMAGE}
          alt={NEWS_BANNER_ALT}
          fill
          priority={priority}
          sizes="100vw"
          className="site-banner-image"
        />
        <div className="site-banner-gradient" />
      </div>

      <div className="site-banner-inner">
        <div className="site-banner-copy">
          <p className="site-banner-kicker">Independent journalism, analysis and current affairs</p>
          <h1 id="site-banner-title" className="site-banner-title">
            <span lang="en">{SITE_NAME}</span>
            <span lang="ur" dir="rtl">
              {SITE_NAME_UR}
            </span>
          </h1>
          {!isCompact ? (
            <p className="site-banner-tagline" lang="ur" dir="rtl">
              {SITE_TAGLINE_UR}
            </p>
          ) : null}
        </div>
      </div>

      {hidePortrait ? (
        <span className="sr-only">
          {SITE_NAME} — {SITE_TAGLINE}
        </span>
      ) : null}
    </section>
  );
}
