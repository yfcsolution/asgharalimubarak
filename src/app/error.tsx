"use client";

import Link from "next/link";
import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="status-page">
      <h1>Something went wrong</h1>
      <p>
        The page could not be loaded. Please try again, or return to the
        homepage.
      </p>
      <div className="lead-cta" style={{ justifyContent: "center" }}>
        <button type="button" className="btn-primary" onClick={reset}>
          Try again
        </button>
        <Link href="/" className="section-link">
          Back to home
        </Link>
      </div>
    </div>
  );
}
