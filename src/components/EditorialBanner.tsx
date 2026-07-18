import { access } from "fs/promises";
import path from "path";
import Link from "next/link";

import {
  EDITORIAL_BANNER_IMAGE,
  SITE_NAME,
  SITE_NAME_UR,
} from "@/lib/site";

async function bannerExists(): Promise<boolean> {
  try {
    await access(path.join(process.cwd(), "public", "images", "editorial-banner.webp"));
    return true;
  } catch {
    return false;
  }
}

export async function EditorialBanner() {
  const hasImage = await bannerExists();

  return (
    <section
      className={hasImage ? "editorial-banner has-image" : "editorial-banner"}
      aria-labelledby="editorial-banner-title"
      style={
        hasImage
          ? {
              backgroundImage: `linear-gradient(105deg, rgba(10, 22, 32, 0.88) 18%, rgba(10, 22, 32, 0.55) 58%, rgba(10, 22, 32, 0.28) 100%), url(${EDITORIAL_BANNER_IMAGE})`,
            }
          : undefined
      }
    >
      <div className="editorial-banner-inner">
        <p className="editorial-banner-kicker">Independent journalism</p>
        <h2 id="editorial-banner-title" className="editorial-banner-title">
          <span lang="en">{SITE_NAME}</span>
          <span lang="ur" dir="rtl">
            {SITE_NAME_UR}
          </span>
        </h2>
        <p className="editorial-banner-copy">
          Pakistan, diplomacy, defence, politics, sports and world affairs.
        </p>
        <div className="editorial-banner-actions">
          <Link href="/latest" className="btn-primary">
            Latest News
          </Link>
          <Link href="/about" className="btn-secondary">
            About
          </Link>
        </div>
      </div>
    </section>
  );
}
