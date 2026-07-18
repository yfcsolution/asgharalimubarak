import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  MAILTO_URL,
  PHONE_URL,
  WHATSAPP_URL,
} from "@/lib/site";
import { WhatsAppIcon } from "@/components/SocialIcons";

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
      <span className="sr-only">
        WhatsApp {CONTACT_PHONE_DISPLAY}. Email {CONTACT_EMAIL}. Call{" "}
        {CONTACT_PHONE_DISPLAY}.
      </span>
      <span className="whatsapp-float-label" aria-hidden="true">
        WhatsApp
      </span>
    </a>
  );
}

export function ContactQuickLinks({ className = "contact-quick-links" }: { className?: string }) {
  return (
    <ul className={className}>
      <li>
        <a href={MAILTO_URL}>{CONTACT_EMAIL}</a>
      </li>
      <li>
        <a href={PHONE_URL}>{CONTACT_PHONE_DISPLAY}</a>
      </li>
      <li>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          WhatsApp {CONTACT_PHONE_DISPLAY}
        </a>
      </li>
    </ul>
  );
}
