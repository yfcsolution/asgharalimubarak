"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { trackEvent } from "@/lib/analytics";
import { PIZZA_PROMO, isPromoConfigured } from "@/lib/site";

export function HeaderPromoBanner() {
  useEffect(() => {
    if (!isPromoConfigured(PIZZA_PROMO)) return;
    trackEvent("ad_impression", { ad_id: "pizza-header-promo", placement: "header" });
  }, []);

  if (!PIZZA_PROMO.enabled || !isPromoConfigured(PIZZA_PROMO)) return null;

  return (
    <div className="header-promo-row">
      <div className="header-promo-inner">
        <aside className="header-promo-ad" aria-label="Sponsored advertisement">
          <Link
            href={PIZZA_PROMO.href}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="header-promo-link"
            aria-label={PIZZA_PROMO.alt}
            onClick={() =>
              trackEvent("ad_click", { ad_id: "pizza-header-promo", placement: "header" })
            }
          >
            <span className="header-promo-label">{PIZZA_PROMO.label}</span>
            <Image
              src={PIZZA_PROMO.image}
              alt={PIZZA_PROMO.alt}
              width={PIZZA_PROMO.width}
              height={PIZZA_PROMO.height}
              className="header-promo-image"
            />
          </Link>
        </aside>
      </div>
    </div>
  );
}
