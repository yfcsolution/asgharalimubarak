import type { Metadata } from "next";
import Link from "next/link";

import { SITE_NAME, getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy practices for ${SITE_NAME} (AAM News).`,
  alternates: {
    canonical: `${getSiteUrl()}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="page-shell prose-page">
      <header className="page-hero">
        <h1>Privacy Policy</h1>
      </header>
      <p>
        AAM News respects reader privacy. This website may use essential
        technical storage and analytics required to operate the newsroom site,
        remember preferences such as recommendations, and improve performance.
      </p>
      <p>
        For privacy questions, use the{" "}
        <Link href="/about-contact#contact">contact form</Link>.
      </p>
    </div>
  );
}
