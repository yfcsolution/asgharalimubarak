import { LINKEDIN_PROFILE_URL, MAILTO_URL, CONTACT_EMAIL } from "@/lib/site";

/** Public contact links — LinkedIn + email only (no phone / WhatsApp). */
export function ContactQuickLinks({
  className = "contact-quick-links",
}: {
  className?: string;
}) {
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
