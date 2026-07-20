import type { Metadata } from "next";

import { ContactQuickLinks } from "@/components/WhatsAppFloat";
import { ShareButtons } from "@/components/ShareButtons";
import { SocialLinksList } from "@/components/SocialIcons";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  MAILTO_URL,
  SITE_NAME,
  WHATSAPP_URL,
  getActiveSocialLinks,
  getSiteUrl,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${SITE_NAME} for news tips, corrections, and collaboration.`,
};

export default function ContactPage() {
  const socialLinks = getActiveSocialLinks();

  return (
    <div className="page-shell">
      <header className="page-hero">
        <h1>Contact</h1>
        <p lang="ur" dir="rtl">
          رابطہ کریں
        </p>
        <p>
          Share a news tip, request a correction, or reach the newsroom for
          editorial collaboration.
        </p>
      </header>

      <div className="prose-page">
        <h2>Direct contact</h2>
        <ContactQuickLinks />
        <p>
          Email{" "}
          <a href={MAILTO_URL}>{CONTACT_EMAIL}</a>, call{" "}
          <a href={`tel:+923334911786`}>{CONTACT_PHONE_DISPLAY}</a>, or message
          on{" "}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          .
        </p>

        <h2>Follow</h2>
        <SocialLinksList links={socialLinks} className="footer-social" showLabels />

        <section className="share-block" aria-label="Share this page">
          <h2>Share this page</h2>
          <ShareButtons
            url={`${getSiteUrl()}/contact`}
            title={`Contact ${SITE_NAME}`}
            variant="page"
          />
        </section>

        <form className="contact-form" action={MAILTO_URL} method="get">
          <label htmlFor="name">
            Name
            <input id="name" name="name" type="text" autoComplete="name" required />
          </label>
          <label htmlFor="email">
            Email
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </label>
          <label htmlFor="message">
            Message
            <textarea id="message" name="body" rows={6} required />
          </label>
          <button type="submit" className="btn-primary">
            Send message
          </button>
        </form>
      </div>
    </div>
  );
}
