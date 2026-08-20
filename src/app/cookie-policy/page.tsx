import type { Metadata } from "next";
import Link from "next/link";

import { SITE_NAME } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `Cookie and local storage practices for ${SITE_NAME} (AAM News).`,
  alternates: {
    canonical: absoluteUrl("/cookie-policy"),
  },
};

export default function CookiePolicyPage() {
  return (
    <div className="page-shell prose-page">
      <header className="page-hero">
        <h1>Cookie Policy</h1>
      </header>
      <p>
        AAM News may use cookies or local browser storage for essential site
        functions, preference memory (such as article recommendations) and
        performance. You can clear cookies and site data through your browser
        settings at any time.
      </p>
      <p>
        For questions, contact the newsroom via the{" "}
        <Link href="/about-contact#contact">contact form</Link>.
      </p>
    </div>
  );
}
