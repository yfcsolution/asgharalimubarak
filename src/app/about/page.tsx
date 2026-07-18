import type { Metadata } from "next";

import { SITE_NAME, SITE_NAME_UR } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE_NAME} — bilingual English and Urdu news coverage.`,
};

export default function AboutPage() {
  return (
    <div className="page-wrap">
      <header className="page-hero">
        <h1>About {SITE_NAME}</h1>
        <p lang="ur" dir="rtl">
          {SITE_NAME_UR} کے بارے میں
        </p>
      </header>

      <div className="prose-page">
        <p>
          {SITE_NAME} is an independent bilingual news publication covering
          politics, sports, economy, diplomacy, and public affairs in English
          and Urdu.
        </p>
        <p lang="ur" dir="rtl">
          {SITE_NAME_UR} ایک آزاد دو لسانی نیوز پلیٹ فارم ہے جو سیاست، کھیل،
          معیشت، سفارت کاری اور عوامی امور پر انگریزی و اردو میں رپورٹنگ پیش
          کرتا ہے۔
        </p>
        <h2>Editorial approach</h2>
        <p>
          Stories are published through a WordPress newsroom and delivered here
          as a fast, accessible reading experience. Titles and articles may
          appear in English, Urdu, or both — the site preserves natural text
          direction with <code>dir=&quot;auto&quot;</code>.
        </p>
        <h2>What you will find</h2>
        <ul>
          <li>Daily and breaking coverage from published WordPress posts</li>
          <li>Category browsing and paginated latest-news archives</li>
          <li>Readable article pages with galleries, embeds, and media</li>
        </ul>
      </div>
    </div>
  );
}
