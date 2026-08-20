import { WhatsAppIcon } from "@/components/SocialIcons";
import { LINKEDIN_PROFILE_URL, MAILTO_URL, CONTACT_EMAIL, WHATSAPP_URL } from "@/lib/site";

export function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <WhatsAppIcon className="whatsapp-float-icon" />
      <span className="sr-only">Open WhatsApp chat with AAM News</span>
      <span className="whatsapp-float-label" aria-hidden="true">
        WhatsApp
      </span>
    </a>
  );
}

/** Public contact links — LinkedIn + email only (no phone numbers). */
export function ContactQuickLinks({ className = "contact-quick-links" }: { className?: string }) {
  return (
    <ul className={className}>
      <li>
        <a href={MAILTO_URL}>{CONTACT_EMAIL}</a>
      </li>
      <li>
        <a
          href={LINKEDIN_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Connect on LinkedIn
        </a>
      </li>
    </ul>
  );
}
