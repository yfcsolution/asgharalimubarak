"use client";

import { useCallback, useId, useMemo, useState, useSyncExternalStore } from "react";

import { trackEvent } from "@/lib/analytics";

export type ShareVariant = "full" | "compact" | "page";

type ShareButtonsProps = {
  url: string;
  title: string;
  variant?: ShareVariant;
  className?: string;
};

type SharePlatform = {
  id: string;
  label: string;
  href: (url: string, title: string) => string;
  icon: React.ReactNode;
};

function ShareIcon({ children }: { children: React.ReactNode }) {
  return <span className="share-icon" aria-hidden="true">{children}</span>;
}

const PLATFORMS: SharePlatform[] = [
  {
    id: "facebook",
    label: "Share on Facebook",
    href: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    icon: (
      <ShareIcon>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
      </ShareIcon>
    ),
  },
  {
    id: "x",
    label: "Share on X",
    href: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    icon: (
      <ShareIcon>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </ShareIcon>
    ),
  },
  {
    id: "linkedin",
    label: "Share on LinkedIn",
    href: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    icon: (
      <ShareIcon>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </ShareIcon>
    ),
  },
  {
    id: "whatsapp",
    label: "Share on WhatsApp",
    href: (url, title) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    icon: (
      <ShareIcon>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </ShareIcon>
    ),
  },
  {
    id: "telegram",
    label: "Share on Telegram",
    href: (url, title) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    icon: (
      <ShareIcon>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      </ShareIcon>
    ),
  },
  {
    id: "reddit",
    label: "Share on Reddit",
    href: (url, title) =>
      `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    icon: (
      <ShareIcon>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M12 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 01-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 01.042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 014.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 01.14-.188.347.347 0 01.238-.042l2.906.617a1.214 1.214 0 011.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 00-.231.094.33.33 0 000 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 000-.463.33.33 0 00-.463 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 00-.232-.095z" />
        </svg>
      </ShareIcon>
    ),
  },
  {
    id: "pinterest",
    label: "Share on Pinterest",
    href: (url, title) =>
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`,
    icon: (
      <ShareIcon>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
        </svg>
      </ShareIcon>
    ),
  },
  {
    id: "email",
    label: "Share by email",
    href: (url, title) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
    icon: (
      <ShareIcon>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      </ShareIcon>
    ),
  },
  {
    id: "blogger",
    label: "Share on Blogger",
    href: (url, title) =>
      `https://www.blogger.com/blog-this.g?u=${encodeURIComponent(url)}&n=${encodeURIComponent(title)}`,
    icon: (
      <ShareIcon>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M21.976 24H2.026C.908 24 0 23.092 0 21.974V2.026C0 .908.908 0 2.026 0h12.015l7.935 7.935v14.039C22.976 23.092 22.068 24 21.976 24zM6.048 10.448v3.104h3.104c.856 0 1.552-.696 1.552-1.552s-.696-1.552-1.552-1.552H6.048zm0 4.656v3.104h3.624c1.712 0 3.104-1.392 3.104-3.104 0-1.712-1.392-3.104-3.104-3.104H6.048zm7.448-4.656h4.656c.856 0 1.552-.696 1.552-1.552s-.696-1.552-1.552-1.552h-4.656v3.104zm0 4.656v3.104h4.656c.856 0 1.552-.696 1.552-1.552s-.696-1.552-1.552-1.552h-4.656v3.104z" />
        </svg>
      </ShareIcon>
    ),
  },
];

function cleanTitle(title: string): string {
  return title.replace(/\s+/g, " ").trim();
}

export function ShareButtons({
  url,
  title,
  variant = "full",
  className = "",
}: ShareButtonsProps) {
  const menuId = useId();
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const canNativeShare = useSyncExternalStore(
    () => () => {},
    () => typeof navigator !== "undefined" && typeof navigator.share === "function",
    () => false,
  );

  const shareTitle = useMemo(() => cleanTitle(title), [title]);
  const shareUrl = useMemo(() => url.trim(), [url]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      trackEvent("share_click", { platform: "copy_link", url: shareUrl });
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }, [shareUrl]);

  const handleNativeShare = useCallback(async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({ title: shareTitle, url: shareUrl });
      trackEvent("share_click", { platform: "native", url: shareUrl });
    } catch {
      // User cancelled or share failed — no action needed.
    }
  }, [shareTitle, shareUrl]);

  const visiblePlatforms =
    variant === "compact"
      ? PLATFORMS.filter((p) => ["facebook", "x", "whatsapp", "blogger"].includes(p.id))
      : variant === "page"
        ? PLATFORMS.filter((p) =>
            ["facebook", "x", "linkedin", "whatsapp", "email", "blogger", "copy"].includes(p.id),
          )
        : PLATFORMS;

  const toolbarClass =
    variant === "compact"
      ? "share-toolbar share-toolbar-compact"
      : variant === "page"
        ? "share-toolbar share-toolbar-page"
        : "share-toolbar share-toolbar-full";

  if (variant === "compact") {
    return (
      <div className={`share-menu ${className}`.trim()}>
        <button
          type="button"
          className="share-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          Share
        </button>
        {menuOpen ? (
          <ul id={menuId} className={`${toolbarClass} share-menu-panel`}>
            {visiblePlatforms.map((platform) => (
              <li key={platform.id}>
                <a
                  href={platform.href(shareUrl, shareTitle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platform.label}
                  title={platform.label}
                  onClick={() =>
                    trackEvent("share_click", { platform: platform.id, url: shareUrl })
                  }
                >
                  {platform.icon}
                  <span className="sr-only">{platform.label}</span>
                </a>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="share-copy-button"
                aria-label="Copy link"
                title="Copy link"
                onClick={handleCopy}
              >
                <ShareIcon>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                  </svg>
                </ShareIcon>
              </button>
            </li>
            {copied ? (
              <li className="share-copied" role="status">
                Link copied
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`${toolbarClass} ${className}`.trim()} role="group" aria-label="Share this page">
      <ul className="share-toolbar-list">
        {visiblePlatforms.map((platform) => (
          <li key={platform.id}>
            <a
              href={platform.href(shareUrl, shareTitle)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={platform.label}
              title={platform.label}
              onClick={() =>
                trackEvent("share_click", { platform: platform.id, url: shareUrl })
              }
            >
              {platform.icon}
              {variant === "full" ? <span>{platform.label.replace("Share on ", "").replace("Share by ", "")}</span> : null}
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            className="share-copy-button"
            aria-label="Copy link"
            title="Copy link"
            onClick={handleCopy}
          >
            <ShareIcon>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
              </svg>
            </ShareIcon>
            {variant === "full" ? <span>Copy link</span> : null}
          </button>
          {copied ? (
            <span className="share-copied" role="status">
              Link copied
            </span>
          ) : null}
        </li>
        {canNativeShare ? (
          <li>
            <button
              type="button"
              className="share-native-button"
              aria-label="Share using device menu"
              title="Share"
              onClick={handleNativeShare}
            >
              <ShareIcon>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.03-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                </svg>
              </ShareIcon>
              {variant === "full" ? <span>Share</span> : null}
            </button>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
