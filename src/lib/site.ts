export const SITE_NAME = "Asghar Ali Mubarak";
export const SITE_NAME_UR = "اصغر علی مبارک";
export const SITE_TAGLINE =
  "Bilingual English & Urdu news coverage from Pakistan and beyond.";
export const SITE_TAGLINE_UR =
  "پاکستان اور دنیا بھر سے انگریزی و اردو خبریں اور تجزیے۔";
export const SITE_DESCRIPTION =
  "Independent bilingual news by Asghar Ali Mubarak — politics, sports, economy, and current affairs in English and Urdu.";

export const POSTS_PER_PAGE = 12;
export const REVALIDATE_SECONDS = 60;
export const UPDATE_THRESHOLD_MS = 10 * 60 * 1000;
export const PAKISTAN_TIME_ZONE = "Asia/Karachi";

export const AUTHOR_LOCAL_PHOTO = "/images/asghar-ali-mubarak.jpg";
export const HEADER_PORTRAIT_ALT = "Asghar Ali Mubarak";
export const SITE_SHOW_NAME_UR = "اندر کی بات";

export const NEWS_BANNER_IMAGE = "/images/asghar-ali-mubarak-news-banner.webp";
export const NEWS_BANNER_SOURCE = "/images/asghar-ali-mubarak-news-banner-source.png";
export const NEWS_BANNER_ALT = "Asghar Ali Mubarak in a professional news studio";
export const NEWS_BANNER_WIDTH = 1920;
export const NEWS_BANNER_HEIGHT = 800;
/** Default Open Graph image when no article-specific image exists. */
export const DEFAULT_OG_IMAGE = NEWS_BANNER_IMAGE;

export const CONTACT_EMAIL = "asgharalimubarak@yahoo.com";
export const CONTACT_PHONE_DISPLAY = "+92 333 4911786";
export const CONTACT_PHONE_E164 = "923334911786";
export const WHATSAPP_URL = `https://wa.me/${CONTACT_PHONE_E164}`;
export const PHONE_URL = `tel:+${CONTACT_PHONE_E164}`;
export const MAILTO_URL = `mailto:${CONTACT_EMAIL}`;

export const DEVELOPER_CREDIT = {
  name: "Zulqarnain Basher",
  company: "YFC Solution",
  companyUrl: "https://yfcsolution.com/",
  descriptor: "Digital products, websites and software solutions",
} as const;

export const SOCIAL_LINKS = [
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@AsgharaliMubarak/",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/Asgharali.Mubarak/",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/Asgharali.Mubarak/",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/asghar-ali-mubarak-a67abb29/",
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

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return url && url.length > 0 ? url : "http://localhost:3000";
}

export function getWordPressApiUrl(): string {
  const url = process.env.WORDPRESS_API_URL?.replace(/\/$/, "");
  if (!url) {
    throw new Error(
      "WORDPRESS_API_URL is not set. Add it to your environment variables.",
    );
  }
  return url;
}
