import type { Metadata } from "next";

import { SocialIcon, SocialLinksList, WhatsAppIcon } from "@/components/SocialIcons";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  MAILTO_URL,
  PHONE_URL,
  SITE_NAME,
  WHATSAPP_URL,
  getActiveSocialLinks,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${SITE_NAME} by email, phone, WhatsApp, or social media.`,
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
          Reach the newsroom directly by email, phone, or WhatsApp, or follow
          published coverage on official social accounts.
        </p>
      </header>

      <div className="prose-page contact-page">
        <section className="contact-panel" aria-labelledby="direct-contact-heading">
          <h2 id="direct-contact-heading">Direct contact</h2>
          <p>
            Use these channels for news tips, interview requests, corrections,
            and editorial collaboration.
          </p>

          <ul className="contact-detail-list">
            <li>
              <span className="contact-detail-label">Email</span>
              <a href={MAILTO_URL}>{CONTACT_EMAIL}</a>
            </li>
            <li>
              <span className="contact-detail-label">Phone</span>
              <a href={PHONE_URL}>{CONTACT_PHONE_DISPLAY}</a>
            </li>
            <li>
              <span className="contact-detail-label">WhatsApp</span>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon />
                <span>{CONTACT_PHONE_DISPLAY}</span>
              </a>
            </li>
          </ul>
        </section>

        <section className="contact-panel" aria-labelledby="social-accounts-heading">
          <h2 id="social-accounts-heading">Social accounts</h2>
          <p>
            Official profiles for {SITE_NAME}. Follow for published reports,
            video updates, and public announcements.
          </p>

          <ul className="contact-social-grid">
            {socialLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-card"
                  aria-label={`Open ${link.label} profile ${link.handle}`}
                  title={`${link.label} — ${link.handle}`}
                >
                  <span className="contact-social-icon" aria-hidden="true">
                    <SocialIcon id={link.id} />
                  </span>
                  <span className="contact-social-copy">
                    <strong>{link.label}</strong>
                    <span>{link.handle}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="contact-social-compact">
            <p className="contact-social-compact-label">Quick follow</p>
            <SocialLinksList
              links={socialLinks}
              className="social-links contact-social-icons"
              showLabels
            />
          </div>
        </section>

        <section className="contact-panel" aria-labelledby="message-heading">
          <h2 id="message-heading">Send a message</h2>
          <p>
            This form opens your email app addressed to{" "}
            <a href={MAILTO_URL}>{CONTACT_EMAIL}</a>.
          </p>

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
        </section>
      </div>
    </div>
  );
}
