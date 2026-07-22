import Link from "next/link";

type SocialUnavailableProps = {
  platform: "YouTube" | "Facebook" | "Instagram";
  message: string;
  href: string;
  buttonLabel: string;
};

export function SocialUnavailable({
  platform,
  message,
  href,
  buttonLabel,
}: SocialUnavailableProps) {
  return (
    <section className="social-unavailable" aria-label={`${platform} unavailable`}>
      <span className={`social-source-badge social-source-${platform.toLowerCase()}`}>
        {platform.toUpperCase()}
      </span>
      <p>{message}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
      >
        {buttonLabel}
      </a>
      <p className="social-unavailable-note">
        <Link href="/about">About &amp; Contact</Link>
      </p>
    </section>
  );
}
