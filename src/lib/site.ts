export const SITE_NAME = "Asghar Ali Mubarak";
export const SITE_NAME_UR = "اصغر علی مبارک";
export const SITE_SLOGAN = "New Generation's News Leader";
export const SITE_TAGLINE =
  "Bilingual English & Urdu news coverage from Pakistan and beyond.";
export const SITE_TAGLINE_UR =
  "پاکستان اور دنیا بھر سے انگریزی و اردو خبریں اور تجزیے۔";
export const SITE_DESCRIPTION =
  "Asghar Ali Mubarak (AAM News) is an independent Pakistani bilingual news platform providing timely English and Urdu news on Pakistan, politics, sports, economy, diplomacy, defence, health and public affairs.";

export const POSTS_PER_PAGE = 12;
export const REVALIDATE_SECONDS = 60;
export const UPDATE_THRESHOLD_MS = 10 * 60 * 1000;
export const PAKISTAN_TIME_ZONE = "Asia/Karachi";

export const AUTHOR_LOCAL_PHOTO = "/images/asghar-ali-mubarak-original.jpg";
export const AUTHOR_HEADER_PHOTO = "/images/asghar-ali-mubarak-header.webp";
export const AUTHOR_AVATAR_PHOTO = "/images/asghar-ali-mubarak-avatar.webp";
export const AUTHOR_ABOUT_PHOTO = "/images/asghar-ali-mubarak-about.webp";
export const HEADER_PORTRAIT_ALT = "Asghar Ali Mubarak";
export const SITE_SHOW_NAME_UR = "اندر کی بات";

/** Approved AAM News brand logo (header, footer, OG/publisher). */
export const AAM_NEWS_LOGO = "/images/brand/aam-news-logo.png";
export const AAM_NEWS_LOGO_ALT = "AAM News — Asghar Ali Mubarak";
export const AAM_NEWS_LOGO_WIDTH = 1536;
export const AAM_NEWS_LOGO_HEIGHT = 1024;

export const NEWS_BANNER_IMAGE = "/images/asghar-ali-mubarak-news-banner.webp";
export const NEWS_BANNER_SOURCE = "/images/asghar-ali-mubarak-news-banner-source.png";
export const NEWS_BANNER_ALT = "Asghar Ali Mubarak in a professional news studio";
export const NEWS_BANNER_WIDTH = 1920;
export const NEWS_BANNER_HEIGHT = 800;
/** Default Open Graph image when no article-specific image exists. */
export const DEFAULT_OG_IMAGE = NEWS_BANNER_IMAGE;

export const CONTACT_EMAIL = "asgharalimubarak@yahoo.com";
/** Used only to build the WhatsApp floating button deep link — never shown in public contact UI. */
const WHATSAPP_E164 = "923334911786";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_E164}`;
export const MAILTO_URL = `mailto:${CONTACT_EMAIL}`;
export const LINKEDIN_PROFILE_URL =
  "https://www.linkedin.com/in/asghar-ali-mubarak-a67abb29/";
export const X_PROFILE_URL = "https://x.com/ASGHARMUBARAK";

export const DEVELOPER_CREDIT = {
  name: "Zulqarnain Basher",
  company: "YFC Solution",
  companyUrl: "https://yfcsolution.com/",
  descriptor: "Digital products, websites and software solutions",
} as const;

/** Preferred masthead order: Facebook, X, YouTube, LinkedIn, Instagram (+ TikTok if valid). */
export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/asgharalimubarak";

export const SOCIAL_LINKS = [
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/Asgharali.Mubarak/",
  },
  {
    id: "x",
    label: "X",
    href: X_PROFILE_URL,
  },
  {
    id: "youtube",
    label: "YouTube",
    href: YOUTUBE_CHANNEL_URL,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: LINKEDIN_PROFILE_URL,
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/Asgharali.Mubarak/",
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@asgharalimubarak2",
  },
] as const;

export type SocialLink = (typeof SOCIAL_LINKS)[number];

export function getActiveSocialLinks(): SocialLink[] {
  return SOCIAL_LINKS.filter((link) => {
    const href = link.href.trim();
    if (!href) return false;
    if (href.includes("example.com")) return false;
    if (href.includes("placeholder")) return false;
    return /^https?:\/\//i.test(href);
  });
}

import {
  getConfiguredWordPressApiUrl,
  WORDPRESS_DIRECT_API_URL,
  WORDPRESS_PUBLIC_API_URL,
} from "@/lib/wordpress-api";

export const PRODUCTION_SITE_URL = "https://asgharalimubarak.com";

export function getSiteUrl(): string {
  if (process.env.VERCEL_ENV === "production") {
    return PRODUCTION_SITE_URL;
  }

  const url = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (
    url &&
    url.length > 0 &&
    !url.includes("localhost") &&
    !url.includes("127.0.0.1") &&
    !url.includes(".vercel.app")
  ) {
    return url;
  }

  if (url && url.length > 0) {
    return url;
  }

  return "http://localhost:3000";
}

export function getWordPressApiUrl(): string {
  return getConfiguredWordPressApiUrl();
}

export { WORDPRESS_PUBLIC_API_URL, WORDPRESS_DIRECT_API_URL };
