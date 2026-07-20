import type { ReactNode } from "react";

import type { SocialLink } from "@/lib/site";

type IconProps = {
  className?: string;
  title?: string;
};

function SvgShell({
  children,
  className,
  title,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function YouTubeIcon(props: IconProps) {
  return (
    <SvgShell {...props}>
      <path
        fill="currentColor"
        d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.8 15.5v-7l6.3 3.5-6.3 3.5z"
      />
    </SvgShell>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <SvgShell {...props}>
      <path
        fill="currentColor"
        d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm11.2 1.3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2.2A2.8 2.8 0 1 0 12 14.8 2.8 2.8 0 0 0 12 9.2z"
      />
    </SvgShell>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <SvgShell {...props}>
      <path
        fill="currentColor"
        d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.5 1.6-1.5H16.8V4.6A22 22 0 0 0 14.1 4c-2.6 0-4.4 1.6-4.4 4.5v2.4H7v3.1h2.7v8h3.8z"
      />
    </SvgShell>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <SvgShell {...props}>
      <path
        fill="currentColor"
        d="M4.98 3.5A2.5 2.5 0 1 1 4.97 8.5 2.5 2.5 0 0 1 4.98 3.5zM3 9.8h4v10.7H3V9.8zm7 0h3.8v1.5h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6v5.2h-4v-4.6c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4v4.7H10V9.8z"
      />
    </SvgShell>
  );
}

export function XIcon(props: IconProps) {
  return (
    <SvgShell {...props}>
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </SvgShell>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <SvgShell {...props}>
      <path
        fill="currentColor"
        d="M16.7 3c.6 2 2.1 3.5 4.1 4v2.5a6.7 6.7 0 0 1-4.1-1.4v6.6a5.8 5.8 0 1 1-5.8-5.8c.3 0 .6 0 .9.1v2.7a3.1 3.1 0 1 0 2.2 3V3h2.7z"
      />
    </SvgShell>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <SvgShell {...props}>
      <path
        fill="currentColor"
        d="M12 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.3-1.4A9.9 9.9 0 1 0 12 2zm0 1.8a8.1 8.1 0 0 1 6.9 12.2l-.3.4.8 3-3.1-.8-.4.2A8.1 8.1 0 0 1 12 3.8zm4.6 11.6c-.2.6-1.2 1.1-1.7 1.2-.4.1-.9.2-1.5 0-.3-.1-.8-.2-1.3-.5a8.5 8.5 0 0 1-3.2-2.9 4.4 4.4 0 0 1-.9-2.3c0-.7.4-1.3.7-1.5.2-.1.4-.2.6-.2h.5c.2 0 .4 0 .5.4l.7 1.7c.1.2 0 .4-.1.5l-.3.4c-.1.1-.3.3-.1.5.1.3.6 1.1 1.3 1.7.9.8 1.6 1 1.9 1.1.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.5-.1l1.6.8c.2.1.3.2.4.3 0 .2 0 .7-.2 1.2z"
      />
    </SvgShell>
  );
}

const ICON_MAP = {
  youtube: YouTubeIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  linkedin: LinkedInIcon,
  tiktok: TikTokIcon,
  x: XIcon,
} as const;

export function SocialIcon({
  id,
  className,
}: {
  id: SocialLink["id"];
  className?: string;
}) {
  const Icon = ICON_MAP[id];
  return <Icon className={className} />;
}

export function SocialLinksList({
  links,
  className = "social-links",
  showLabels = false,
}: {
  links: SocialLink[];
  className?: string;
  showLabels?: boolean;
}) {
  if (links.length === 0) return null;

  return (
    <ul className={className} aria-label="Social profiles">
      {links.map((link) => (
        <li key={link.id}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow on ${link.label}`}
            title={`Follow on ${link.label}`}
            className="social-icon-link"
          >
            <SocialIcon id={link.id} />
            {showLabels ? <span>{link.label}</span> : null}
          </a>
        </li>
      ))}
    </ul>
  );
}
