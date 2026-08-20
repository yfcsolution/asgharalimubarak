import {
  CONTACT_EMAIL,
  LINKEDIN_PROFILE_URL,
  X_PROFILE_URL,
} from "@/lib/site";
import {
  ORGANIZATION_DESCRIPTION,
  ORGANIZATION_NAME,
  absoluteUrl,
  breadcrumbJsonLd,
  getSameAsLinks,
  organizationJsonLd,
  personJsonLd,
  toJsonLdGraph,
} from "@/lib/seo";

type AboutStructuredDataProps = {
  authorBio: string;
};

export function AboutStructuredData({ authorBio }: AboutStructuredDataProps) {
  const aboutUrl = absoluteUrl("/about-contact");
  const sameAs = getSameAsLinks();

  const graph = [
    {
      ...organizationJsonLd(),
      email: CONTACT_EMAIL,
      description: ORGANIZATION_DESCRIPTION,
      sameAs,
    },
    {
      ...personJsonLd({ description: authorBio }),
      sameAs: Array.from(
        new Set([X_PROFILE_URL, LINKEDIN_PROFILE_URL, ...sameAs]),
      ),
    },
    {
      "@type": "WebPage",
      "@id": `${aboutUrl}#webpage`,
      url: aboutUrl,
      name: `About & Contact | ${ORGANIZATION_NAME}`,
      isPartOf: { "@id": `${absoluteUrl()}/#website` },
      about: { "@id": `${absoluteUrl()}/#person` },
      mainEntity: { "@id": `${absoluteUrl()}/#person` },
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "About & Contact", path: "/about-contact" },
    ]),
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(toJsonLdGraph(graph)),
      }}
    />
  );
}
