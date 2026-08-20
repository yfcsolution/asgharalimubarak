import type { Metadata } from "next";
import Link from "next/link";

import { SITE_NAME } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description: `Editorial standards and newsroom principles for ${SITE_NAME} (AAM News).`,
  alternates: {
    canonical: absoluteUrl("/editorial-policy"),
  },
};

export default function EditorialPolicyPage() {
  return (
    <div className="page-shell prose-page">
      <header className="page-hero">
        <h1>Editorial Policy</h1>
      </header>
      <p>
        AAM News is committed to factual, timely and responsible journalism in
        English and Urdu. We aim for accuracy, fairness, independence and clear
        distinction between news reporting and opinion.
      </p>
      <p>
        Corrections and clarifications may be requested through the{" "}
        <Link href="/about-contact#contact">contact form</Link>.
      </p>
    </div>
  );
}
