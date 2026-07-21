import {
  CONTACT_EMAIL,
  CONTACT_PHONE_E164,
  SITE_NAME,
  SITE_NAME_UR,
  getSiteUrl,
} from "@/lib/site";

type AboutStructuredDataProps = {
  authorBio: string;
};

export function AboutStructuredData({ authorBio }: AboutStructuredDataProps) {
  const siteUrl = getSiteUrl();
  const aboutUrl = `${siteUrl}/about`;

  const graph = [
    {
      "@type": "NewsMediaOrganization",
      "@id": `${siteUrl}/#organization`,
      name: "AAM News",
      alternateName: SITE_NAME,
      url: siteUrl,
      email: CONTACT_EMAIL,
      telephone: `+${CONTACT_PHONE_E164}`,
      description:
        "Independent bilingual news platform delivering factual reporting and analysis in English and Urdu from Pakistan.",
      sameAs: [
        "https://www.facebook.com/Asgharali.Mubarak/",
        "https://www.youtube.com/@AsgharaliMubarak/",
        "https://www.linkedin.com/in/asghar-ali-mubarak-a67abb29/",
        "https://www.instagram.com/Asgharali.Mubarak/",
        "https://www.tiktok.com/@asgharalimubarak2",
      ],
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: SITE_NAME,
      alternateName: SITE_NAME_UR,
      jobTitle: "Journalist and Editor",
      description: authorBio,
      url: aboutUrl,
      worksFor: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${aboutUrl}#webpage`,
      url: aboutUrl,
      name: "About & Contact | Asghar Ali Mubarak",
      isPartOf: { "@id": `${siteUrl}/#organization` },
      about: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "About & Contact",
          item: aboutUrl,
        },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
    />
  );
}
