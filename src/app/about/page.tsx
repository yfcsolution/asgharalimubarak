import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { getSiteAuthor, resolveAuthorPhoto } from "@/lib/author";
import { ShareButtons } from "@/components/ShareButtons";
import { getSiteUrl, SITE_NAME, SITE_NAME_UR, SOCIAL_LINKS } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE_NAME} — bilingual English and Urdu news coverage.`,
};

export default async function AboutPage() {
  const author = await getSiteAuthor();
  const photo = resolveAuthorPhoto(author);
  const paragraphs = author.description
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 6);

  return (
    <div className="page-shell">
      <header className="page-hero about-hero">
        {photo ? (
          <Image
            src={photo.src}
            alt={photo.alt}
            width={120}
            height={120}
            className="author-photo about-hero-photo"
            priority
          />
        ) : null}
        <div>
          <h1>About {SITE_NAME}</h1>
          <p lang="ur" dir="rtl">
            {SITE_NAME_UR} کے بارے میں
          </p>
        </div>
      </header>

      <div className="prose-page">
        {paragraphs.length > 0 ? (
          paragraphs.map((paragraph) => <p key={paragraph.slice(0, 48)}>{paragraph}</p>)
        ) : (
          <>
            <p>{author.shortBio}</p>
            <p lang="ur" dir="rtl">
              {SITE_NAME_UR} ایک آزاد دو لسانی نیوز پلیٹ فارم ہے جو سیاست، کھیل،
              معیشت، سفارت کاری اور عوامی امور پر انگریزی و اردو میں رپورٹنگ پیش
              کرتا ہے۔
            </p>
          </>
        )}

        <h2>Follow</h2>
        <ul className="footer-social">
          {SOCIAL_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <section className="share-block" aria-label="Share this page">
          <h2>Share this page</h2>
          <ShareButtons
            url={`${getSiteUrl()}/about`}
            title={`About ${SITE_NAME}`}
            variant="page"
          />
        </section>

        <p>
          <Link href="/contact" className="section-link">
            Contact the newsroom
          </Link>
        </p>
      </div>
    </div>
  );
}
