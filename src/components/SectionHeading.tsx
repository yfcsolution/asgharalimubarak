import Link from "next/link";
import type { ReactNode } from "react";

type SectionHeadingProps = {
  title: string;
  titleId?: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  dir?: "auto" | "ltr" | "rtl";
  children?: ReactNode;
};

export function SectionHeading({
  title,
  titleId,
  description,
  href,
  linkLabel = "View all",
  dir = "auto",
  children,
}: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <span className="section-heading__bar" aria-hidden="true" />
      <div className="section-heading__copy">
        <h2 id={titleId} dir={dir}>
          {title}
        </h2>
        {description ? <p>{description}</p> : null}
        {children}
      </div>
      <div className="section-heading__rule" aria-hidden="true" />
      {href ? (
        <Link href={href} className="section-link" dir={dir}>
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}
