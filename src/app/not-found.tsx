import Link from "next/link";

export default function NotFound() {
  return (
    <div className="status-page">
      <h1>Page not found</h1>
      <p lang="ur" dir="rtl">
        صفحہ نہیں ملا
      </p>
      <p>
        The story or page you requested is unavailable. It may have been moved
        or unpublished.
      </p>
      <div className="lead-cta" style={{ justifyContent: "center" }}>
        <Link href="/" className="btn-primary">
          Go to homepage
        </Link>
        <Link href="/latest" className="section-link">
          Browse latest news
        </Link>
      </div>
    </div>
  );
}
