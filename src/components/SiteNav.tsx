"use client";

import Link from "next/link";
import { useId, useState } from "react";

export type NavItem = {
  href: string;
  label: string;
  dir?: "auto" | "ltr" | "rtl";
};

export function DesktopNav({
  primary,
  more,
}: {
  primary: NavItem[];
  more: NavItem[];
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  return (
    <nav aria-label="Primary" className="primary-nav">
      <ul className="primary-nav-list">
        {primary.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="nav-link" dir={item.dir ?? "auto"}>
              {item.label}
            </Link>
          </li>
        ))}
        {more.length > 0 ? (
          <li className="nav-more">
            <button
              type="button"
              className="nav-link nav-more-button"
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((value) => !value)}
              onBlur={(event) => {
                if (!event.currentTarget.parentElement?.contains(event.relatedTarget as Node)) {
                  setOpen(false);
                }
              }}
            >
              More
            </button>
            {open ? (
              <ul id={menuId} className="nav-more-menu" role="menu">
                {more.map((item) => (
                  <li key={item.href} role="none">
                    <Link
                      href={item.href}
                      className="nav-more-link"
                      role="menuitem"
                      dir={item.dir ?? "auto"}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ) : null}
      </ul>
    </nav>
  );
}

export function MobileNav({ items }: { items: NavItem[] }) {
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
        <div
          id={panelId}
          className="mobile-nav-panel"
          role="dialog"
          aria-label="Mobile navigation"
        >
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="mobile-nav-link"
                  dir={item.dir ?? "auto"}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
