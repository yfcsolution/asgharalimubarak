import type { Metadata } from "next";
import { Newsreader, Noto_Nastaliq_Urdu, Source_Sans_3 } from "next/font/google";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import {
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
  openGraph: {
    type: "website",
    locale: "en_PK",
    alternateLocale: ["ur_PK"],
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_NAME_UR}`,
    description: SITE_DESCRIPTION,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_NAME_UR}`,
    description: SITE_DESCRIPTION,
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
      </body>
    </html>
  );
}
