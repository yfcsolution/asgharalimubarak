"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

export type NavItem = {
  href: string;
  label: string;
  dir?: "auto" | "ltr" | "rtl";
};

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopNav({
  primary,
  more,
}: {
  primary: NavItem[];
  more: NavItem[];
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const pathname = usePathname();
  const moreRef = useRef<HTMLLIElement>(null);
  const moreActive = more.some((item) => isActivePath(pathname, item.href));

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: MouseEvent) => {
      if (!moreRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  return (
    <nav aria-label="Primary" className="primary-nav">
      <ul className="primary-nav-list">
        {primary.map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`nav-link${active ? " is-active" : ""}`}
                dir={item.dir ?? "auto"}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
        {more.length > 0 ? (
          <li className="nav-more" ref={moreRef}>
            <button
              type="button"
              className={`nav-link nav-more-button${moreActive ? " is-active" : ""}`}
              aria-expanded={open}
              aria-controls={menuId}
              aria-haspopup="menu"
              onClick={() => setOpen((value) => !value)}
            >
              More
            </button>
            {open ? (
              <ul id={menuId} className="nav-more-menu" role="menu">
                {more.map((item) => {
                  const active = isActivePath(pathname, item.href);
                  return (
                    <li key={item.href} role="none">
                      <Link
                        href={item.href}
                        className={`nav-more-link${active ? " is-active" : ""}`}
                        role="menuitem"
                        dir={item.dir ?? "auto"}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
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
  const pathname = usePathname();

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
            {items.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`mobile-nav-link${active ? " is-active" : ""}`}
                    dir={item.dir ?? "auto"}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
