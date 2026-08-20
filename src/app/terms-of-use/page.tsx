import type { Metadata } from "next";
import Link from "next/link";

import { SITE_NAME } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms of use for ${SITE_NAME} (AAM News).`,
  alternates: {
    canonical: absoluteUrl("/terms-of-use"),
  },
};

export default function TermsOfUsePage() {
  return (
    <div className="page-shell prose-page">
      <header className="page-hero">
        <h1>Terms of Use</h1>
      </header>
      <p>
        Content published by AAM News is provided for general information. Users
        may not republish material in a misleading way or present it as their
        own without appropriate attribution.
      </p>
      <p>
        Questions about reuse or syndication can be sent via the{" "}
        <Link href="/about-contact#contact">contact form</Link>.
      </p>
    </div>
  );
}
