import Link from "next/link";

export function BrandBar() {
  return (
    <div className="brand-bar" aria-label="AAM News brand bar">
      <div className="brand-bar-inner">
        <Link href="/" className="brand-bar-mark" aria-label="Go to AAM News homepage">
          <span className="brand-bar-en">AAM NEWS</span>
          <span className="brand-bar-ur" lang="ur" dir="rtl">
            اے اے ایم نیوز
          </span>
        </Link>
      </div>
    </div>
  );
}
