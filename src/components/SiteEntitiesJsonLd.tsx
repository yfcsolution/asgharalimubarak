import {
  organizationJsonLd,
  personJsonLd,
  toJsonLdGraph,
  websiteJsonLd,
} from "@/lib/seo";

/** Homepage / global entity graph for Organization, Person, and WebSite. */
export function SiteEntitiesJsonLd({
  authorBio,
}: {
  authorBio?: string;
}) {
  const graph = [
    organizationJsonLd(),
    personJsonLd({ description: authorBio }),
    websiteJsonLd(),
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
