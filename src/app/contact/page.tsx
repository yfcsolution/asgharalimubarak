import type { Metadata } from "next";

import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${SITE_NAME} for news tips, corrections, and collaboration.`,
};

export default function ContactPage() {
  return (
    <div className="page-wrap">
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
        <p>
          Email the newsroom at{" "}
          <a href="mailto:asgharalimubarak@example.com">
            asgharalimubarak@example.com
          </a>
          . Replace this address with your production inbox before launch.
        </p>

        <form className="contact-form" action="mailto:asgharalimubarak@example.com" method="get">
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
