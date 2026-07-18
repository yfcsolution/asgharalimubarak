"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";

export type TickerHeadline = {
  id: number;
  href: string;
  label: string;
  dir: "ltr" | "rtl" | "auto";
  lang: "en" | "ur";
};

type LatestNewsTickerProps = {
  headlines: TickerHeadline[];
  updatedLabel: string;
  updatedIso: string;
};

export function LatestNewsTicker({
  headlines,
  updatedLabel,
  updatedIso,
}: LatestNewsTickerProps) {
  const labelId = useId();
  const unique = useMemo(() => {
    const seen = new Set<string>();
    return headlines.filter((item) => {
      const key = item.href;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [headlines]);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (unique.length <= 1 || paused) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % unique.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [paused, unique.length]);

  if (unique.length === 0) return null;

  const go = (direction: -1 | 1) => {
    setIndex((value) => (value + direction + unique.length) % unique.length);
  };

  const loop = [...unique, ...unique];

  return (
    <section
      className="latest-ticker"
      aria-labelledby={labelId}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
    >
      <div className="latest-ticker-inner">
        <div className="latest-ticker-meta">
          <span id={labelId} className="latest-ticker-badge">
            Latest News
          </span>
          <time className="latest-ticker-updated" dateTime={updatedIso}>
            Updated {updatedLabel}
          </time>
        </div>

        <div className="latest-ticker-track-wrap">
          <div
            className={
              paused || unique.length < 2
                ? "latest-ticker-marquee is-paused"
                : "latest-ticker-marquee"
            }
            aria-hidden="true"
          >
            <ul className="latest-ticker-marquee-list">
              {loop.map((item, loopIndex) => (
                <li key={`${item.id}-${loopIndex}`}>
                  <Link href={item.href} dir={item.dir} lang={item.lang} tabIndex={-1}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="latest-ticker-focus" aria-live="polite">
            <Link
              href={unique[index].href}
              dir={unique[index].dir}
              lang={unique[index].lang}
              className="latest-ticker-focus-link"
              title={unique[index].label}
            >
              {unique[index].label}
            </Link>
          </div>
        </div>

        <div className="latest-ticker-controls">
          <button
            type="button"
            className="latest-ticker-button"
            aria-label="Previous headline"
            onClick={() => go(-1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="latest-ticker-button"
            aria-label="Next headline"
            onClick={() => go(1)}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
