import Link from "next/link";

type BreakingStripProps = {
  items: Array<{ href: string; label: string; dir?: string; lang?: string }>;
};

export function BreakingStrip({ items }: BreakingStripProps) {
  if (items.length === 0) return null;

  return (
    <div className="breaking-strip" aria-label="Latest headlines">
      <div className="breaking-strip-inner">
        <span className="breaking-label">Latest</span>
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href} dir={item.dir} lang={item.lang}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
