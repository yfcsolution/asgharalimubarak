import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AboutStructuredData } from "@/components/AboutStructuredData";
import { SocialIcon } from "@/components/SocialIcons";
import {
  ABOUT_COMMITMENT_EN,
  ABOUT_COMMITMENT_UR,
  ABOUT_INTRO_EN,
  ABOUT_INTRO_UR,
  ABOUT_TITLE,
  ABOUT_TITLE_UR,
  AUTHOR_ROLE,
  CONTACT_INTRO,
  CORRECTIONS_EN,
  CORRECTIONS_UR,
  EXTENDED_PROFILE_GROUPS,
  MISSION_EN,
  MISSION_UR,
  PROFESSIONAL_PROFILE_SUMMARY,
  PUBLICATIONS_SUMMARY,
  SHOW_EXTENDED_PROFILE,
} from "@/lib/about-content";
import { getSiteAuthor, resolveAuthorPhoto } from "@/lib/author";
import {
  AUTHOR_ABOUT_PHOTO,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  MAILTO_URL,
  PHONE_URL,
  SITE_NAME,
  SITE_NAME_UR,
  WHATSAPP_URL,
  getActiveSocialLinks,
  getSiteUrl,
} from "@/lib/site";
import { categoryPath, decodeHtml, displayTitleForPost, postPath } from "@/lib/utils";
import { getNavCategories, getPosts } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "About AAM News & Contact",
  description:
    "Learn about AAM News, the professional profile of Asghar Ali Mubarak, coverage areas and how to contact the newsroom.",
  alternates: {
    canonical: `${getSiteUrl()}/about`,
  },
  openGraph: {
    title: "About AAM News & Contact | Asghar Ali Mubarak",
    description:
      "Learn about AAM News, the professional profile of Asghar Ali Mubarak, coverage areas and how to contact the newsroom.",
    url: `${getSiteUrl()}/about`,
    type: "website",
  },
};

export default async function AboutPage() {
  const [author, categories, { posts: latestPosts }] = await Promise.all([
    getSiteAuthor(),
    getNavCategories(),
    getPosts({ page: 1, perPage: 5, mode: "light" }),
  ]);

  const photo = resolveAuthorPhoto(author);
  const portraitSrc = photo?.isLocal ? AUTHOR_ABOUT_PHOTO : photo?.src;
  const socialLinks = getActiveSocialLinks();
  const authorBio =
    author.shortBio ||
    `${SITE_NAME} is a bilingual journalist covering politics, sports, diplomacy, and current affairs for AAM News.`;

  return (
    <div className="page-shell about-contact-page">
      <AboutStructuredData authorBio={authorBio} />

      <header className="about-contact-hero">
        <h1>{ABOUT_TITLE}</h1>
        <p className="about-contact-hero-ur" lang="ur" dir="rtl">
          {ABOUT_TITLE_UR}
        </p>
      </header>

      <section className="about-card" aria-labelledby="about-aam-heading">
        <h2 id="about-aam-heading">About AAM News</h2>
        <div className="about-bilingual-grid">
          <div className="about-bilingual-col">
            <p>{ABOUT_INTRO_EN}</p>
            <p>{ABOUT_COMMITMENT_EN}</p>
          </div>
          <div className="about-bilingual-col about-bilingual-col-ur" lang="ur" dir="rtl">
            <p>{ABOUT_INTRO_UR}</p>
            <p>{ABOUT_COMMITMENT_UR}</p>
          </div>
        </div>
      </section>

      <section className="about-card" aria-labelledby="mission-heading">
        <h2 id="mission-heading">Editorial Mission</h2>
        <div className="about-bilingual-grid">
          <p className="about-bilingual-col">{MISSION_EN}</p>
          <p className="about-bilingual-col about-bilingual-col-ur" lang="ur" dir="rtl">
            {MISSION_UR}
          </p>
        </div>
      </section>

      <section className="about-card about-author-section" aria-labelledby="author-heading">
        <h2 id="author-heading">About Asghar Ali Mubarak</h2>
        <div className="about-author-profile">
          {portraitSrc ? (
            <Image
              src={portraitSrc}
              alt={`Portrait of ${SITE_NAME}`}
              width={160}
              height={160}
              className="about-author-portrait"
              priority
            />
          ) : null}
          <div className="about-author-copy">
            <p className="about-author-name">{SITE_NAME}</p>
            <p className="about-author-name-ur" lang="ur" dir="rtl">
              {SITE_NAME_UR}
            </p>
            <p className="about-author-role">{AUTHOR_ROLE}</p>
            <p>{authorBio}</p>
            {latestPosts.length > 0 ? (
              <div className="about-latest-links">
                <p className="about-latest-label">Latest articles</p>
                <ul>
                  {latestPosts.map((post) => {
                    const title = displayTitleForPost(post);
                    return (
                      <li key={post.id}>
                        <Link
                          href={postPath(post.slug)}
                          dir={title.dir}
                          lang={title.lang}
                          title={title.fullText}
                        >
                          {title.text}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <Link href="/latest" className="section-link">
                  View all latest news
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="about-card" aria-labelledby="profile-heading">
        <h2 id="profile-heading">Professional Profile</h2>
        <p>{PROFESSIONAL_PROFILE_SUMMARY}</p>
      </section>

      {SHOW_EXTENDED_PROFILE ? (
        <section className="about-card" aria-labelledby="education-heading">
          <h2 id="education-heading">Education and Public Service</h2>
          <div className="about-profile-groups">
            {EXTENDED_PROFILE_GROUPS.map((group) => (
              <div key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="about-card" aria-labelledby="education-heading">
          <h2 id="education-heading">Education and Public Service</h2>
          <p>
            A structured education and public-service timeline is prepared and can
            be enabled after client verification of the supplied biography details.
          </p>
        </section>
      )}

      <section className="about-card" aria-labelledby="publications-heading">
        <h2 id="publications-heading">Publications</h2>
        <p>{PUBLICATIONS_SUMMARY}</p>
      </section>

      {categories.length > 0 ? (
        <section className="about-card" aria-labelledby="coverage-heading">
          <h2 id="coverage-heading">Coverage Areas</h2>
          <ul className="about-coverage-grid">
            {categories.map((category) => (
              <li key={category.id}>
                <Link href={categoryPath(category.slug)} className="about-coverage-card" dir="auto">
                  <span className="about-coverage-accent" aria-hidden="true" />
                  <span className="about-coverage-name">{decodeHtml(category.name)}</span>
                  <span className="about-coverage-count">{category.count} stories</span>
                </Link>
              </li>
            ))}
          </ul>
          <p>
            <Link href="/categories" className="section-link">
              View all news sections
            </Link>
          </p>
        </section>
      ) : null}

      <section className="about-card" id="contact" aria-labelledby="contact-heading">
        <h2 id="contact-heading">Contact Information</h2>
        <p>{CONTACT_INTRO}</p>
        <ul className="about-contact-list">
          <li>
            <span className="about-contact-label">Email</span>
            <a href={MAILTO_URL}>{CONTACT_EMAIL}</a>
          </li>
          <li>
            <span className="about-contact-label">Phone</span>
            <a href={PHONE_URL}>{CONTACT_PHONE_DISPLAY}</a>
          </li>
          <li>
            <span className="about-contact-label">WhatsApp</span>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              {CONTACT_PHONE_DISPLAY}
            </a>
          </li>
        </ul>
      </section>

      <section className="about-card" aria-labelledby="corrections-heading">
        <h2 id="corrections-heading">Corrections and News Tips</h2>
        <div className="about-bilingual-grid">
          <p className="about-bilingual-col">{CORRECTIONS_EN}</p>
          <p className="about-bilingual-col about-bilingual-col-ur" lang="ur" dir="rtl">
            {CORRECTIONS_UR}
          </p>
        </div>
      </section>

      {socialLinks.length > 0 ? (
        <section className="about-card" aria-labelledby="social-heading">
          <h2 id="social-heading">Social Media</h2>
          <ul className="about-social-grid">
            {socialLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-social-button"
                  aria-label={`Follow on ${link.label}`}
                >
                  <SocialIcon id={link.id} />
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <ul className="about-social-grid" style={{ marginTop: "0.75rem" }}>
            <li>
              <Link href="/videos" className="about-social-button">
                YouTube Videos
              </Link>
            </li>
            <li>
              <Link href="/facebook" className="about-social-button">
                Facebook
              </Link>
            </li>
            <li>
              <Link href="/instagram" className="about-social-button">
                Instagram
              </Link>
            </li>
          </ul>
        </section>
      ) : null}
    </div>
  );
}
