import type { Metadata } from "next";
import { Noto_Nastaliq_Urdu } from "next/font/google";

import { AnalyticsScript } from "@/components/AnalyticsScript";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import {
  DEFAULT_OG_IMAGE,
  NEWS_BANNER_ALT,
  NEWS_BANNER_HEIGHT,
  NEWS_BANNER_WIDTH,
  SITE_NAME,
  X_PROFILE_URL,
  getSiteUrl,
} from "@/lib/site";
import {
  HOMEPAGE_DESCRIPTION,
  HOMEPAGE_TITLE,
  WEBSITE_NAME,
  absoluteUrl,
} from "@/lib/seo";

import "./globals.css";

const notoNastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-noto-nastaliq",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl.includes("localhost") ? "https://asgharalimubarak.com" : siteUrl),
  title: {
    default: HOMEPAGE_TITLE,
    template: `%s | AAM News`,
  },
  description: HOMEPAGE_DESCRIPTION,
  applicationName: WEBSITE_NAME,
  authors: [{ name: SITE_NAME, url: absoluteUrl("/about-contact") }],
  creator: SITE_NAME,
  publisher: "AAM News",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    alternateLocale: ["ur_PK"],
    siteName: WEBSITE_NAME,
    title: HOMEPAGE_TITLE,
    description: HOMEPAGE_DESCRIPTION,
    url: absoluteUrl(),
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: NEWS_BANNER_WIDTH,
        height: NEWS_BANNER_HEIGHT,
        alt: NEWS_BANNER_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOMEPAGE_TITLE,
    description: HOMEPAGE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
    site: "@ASGHARMUBARAK",
    creator: "@ASGHARMUBARAK",
  },
  alternates: {
    canonical: absoluteUrl(),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
  other: {
    "x:url": X_PROFILE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${notoNastaliq.variable} h-full`}>
      <body className="site-shell antialiased">
        <AnalyticsScript />
        <Header />
        <main id="main-content" className="site-main">
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
