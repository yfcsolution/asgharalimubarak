"use client";

import Link from "next/link";
import { useId, useState } from "react";

type NavItem = {
  href: string;
  label: string;
  labelUr: string;
};

export function MobileNav({ items }: { items: readonly NavItem[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="mobile-nav">
      <button
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <span aria-hidden="true">{open ? "✕" : "☰"}</span>
      </button>

      {open ? (
        <div id={panelId} className="mobile-nav-panel" role="dialog" aria-label="Mobile navigation">
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="mobile-nav-link"
                  onClick={() => setOpen(false)}
                >
                  <span>{item.label}</span>
                  <span lang="ur" dir="rtl">
                    {item.labelUr}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
