import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";

/**
 * Seasonal / campaign banner. Prefer the client-supplied asset at
 * public/images/campaigns/independence-day.webp when present.
 * Falls back to the SVG mark without altering any portrait photography.
 */
const WEBP_PATH = join(
  process.cwd(),
  "public/images/campaigns/independence-day.webp",
);
const PNG_PATH = join(
  process.cwd(),
  "public/images/campaigns/independence-day.png",
);
const JPG_PATH = join(
  process.cwd(),
  "public/images/campaigns/independence-day.jpg",
);
const SVG_PATH = "/images/campaigns/independence-day.svg";

export function isIndependenceDayBannerEnabled(): boolean {
  const raw = process.env.INDEPENDENCE_DAY_BANNER_ENABLED?.trim().toLowerCase();
  if (raw === "false" || raw === "0" || raw === "off") return false;
  // Default on during August campaign season when unset.
  if (!raw) {
    const month = new Date().getUTCMonth() + 1;
    return month === 8;
  }
  return raw === "true" || raw === "1" || raw === "on";
}

function resolveBannerSrc(): string {
  if (existsSync(WEBP_PATH)) return "/images/campaigns/independence-day.webp";
  if (existsSync(PNG_PATH)) return "/images/campaigns/independence-day.png";
  if (existsSync(JPG_PATH)) return "/images/campaigns/independence-day.jpg";
  return SVG_PATH;
}

export function CampaignBanner() {
  if (!isIndependenceDayBannerEnabled()) return null;

  const src = resolveBannerSrc();
  const isSvg = src.endsWith(".svg");

  return (
    <section className="campaign-banner" aria-label="Pakistan Independence Day">
      <div className="campaign-banner-inner">
        {isSvg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt="Pakistan Independence Day — 14 August. AAM News greets the nation."
            className="campaign-banner-image"
            width={1280}
            height={280}
          />
        ) : (
          <Image
            src={src}
            alt="Pakistan Independence Day — 14 August. AAM News greets the nation."
            width={1280}
            height={280}
            className="campaign-banner-image"
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
        )}
      </div>
    </section>
  );
}
