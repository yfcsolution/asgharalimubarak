import type { Metadata } from "next";
import { Newsreader, Noto_Nastaliq_Urdu, Source_Sans_3 } from "next/font/google";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import {
  DEFAULT_OG_IMAGE,
  NEWS_BANNER_ALT,
  NEWS_BANNER_HEIGHT,
  NEWS_BANNER_WIDTH,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_NAME_UR,
  getSiteUrl,
} from "@/lib/site";

import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

const notoNastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-noto-nastaliq",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} | ${SITE_NAME_UR}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
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
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_NAME_UR}`,
    description: SITE_DESCRIPTION,
    url: siteUrl,
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
    title: `${SITE_NAME} | ${SITE_NAME_UR}`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${sourceSans.variable} ${notoNastaliq.variable} h-full`}
    >
      <body className="site-shell antialiased">
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
