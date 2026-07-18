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

export const AUTHOR_LOCAL_PHOTO = "/images/asghar-ali-mubarak.jpg";

export const SOCIAL_LINKS = [
  {
    label: "YouTube",
    href: "https://www.youtube.com/@AsgharaliMubarak/",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/Asgharali.Mubarak/",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/Asgharali.Mubarak/",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/asghar-ali-mubarak-a67abb29/",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@asgharalimubarak2",
  },
] as const;

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
