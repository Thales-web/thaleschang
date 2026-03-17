import { type CollectionEntry } from "astro:content";

import { clientConfig } from "@/config/clientConfig";
import { defaultLocale } from "@/config/siteSettings.json";
import { type FaqItem, type navItem, type navLinkItem } from "@/config/types/configDataTypes";
import { getTranslatedData } from "@/js/translationUtils";

const siteData = getTranslatedData("siteData", defaultLocale);

// ============================================================
// Types
// ============================================================

interface GeneralProps {
  type: "general";
}

export interface BlogProps {
  type: "blog";
  postFrontmatter: CollectionEntry<"blog">["data"];
  image: ImageMetadata;
  authors: CollectionEntry<"authors">[];
  canonicalUrl: URL;
  locale?: string;
}

interface ServiceProps {
  type: "service";
  service: CollectionEntry<"services">;
}

interface PersonProps {
  type: "person";
  person: CollectionEntry<"authors">;
}

interface FaqProps {
  type: "faq";
  faqItems: FaqItem[];
}

export type JsonLDProps =
  | GeneralProps
  | BlogProps
  | ServiceProps
  | PersonProps
  | FaqProps;

// ============================================================
// Schema Generators
// ============================================================

function getSameAsLinks(): string[] {
  const links: string[] = [];
  const { social } = clientConfig;
  if (social.twitter) links.push(`https://twitter.com/${social.twitter}`);
  if (social.facebook) links.push(social.facebook);
  if (social.instagram) links.push(social.instagram);
  if (social.linkedin) links.push(social.linkedin);
  if (social.youtube) links.push(social.youtube);
  if (social.github) links.push(social.github);
  if (social.naver) links.push(social.naver);
  return links;
}

export function generateOrganizationSchema(): object {
  const { business } = clientConfig;
  const sameAs = getSameAsLinks();

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": business.type,
    name: business.name,
    url: business.url,
    logo: business.logo.startsWith("http")
      ? business.logo
      : `${business.url}${business.logo}`,
    description: business.description,
  };

  if (business.legalName) schema.legalName = business.legalName;
  if (business.foundingDate) schema.foundingDate = business.foundingDate;
  if (business.email) schema.email = business.email;
  if (business.phone) schema.telephone = business.phone;
  if (business.image) {
    schema.image = business.image.startsWith("http")
      ? business.image
      : `${business.url}${business.image}`;
  }
  if (sameAs.length > 0) schema.sameAs = sameAs;

  // LocalBusiness-specific fields
  if (clientConfig.seo.enableLocalBusiness) {
    if (business.address) {
      schema.address = {
        "@type": "PostalAddress",
        streetAddress: business.address.streetAddress,
        addressLocality: business.address.city,
        addressRegion: business.address.region,
        postalCode: business.address.postalCode,
        addressCountry: business.address.country,
      };
    }
    if (business.priceRange) schema.priceRange = business.priceRange;
    if (business.openingHours)
      schema.openingHoursSpecification = business.openingHours;
    if (business.geo) {
      schema.geo = {
        "@type": "GeoCoordinates",
        latitude: business.geo.latitude,
        longitude: business.geo.longitude,
      };
    }
  }

  return schema;
}

export function generateWebSiteSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteData.title,
    url: import.meta.env.SITE,
  };
}

export function generateBreadcrumbSchema(
  breadcrumbs: { name: string; url: string }[],
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateBlogPostingSchema(props: BlogProps): object {
  const { postFrontmatter, image, authors, canonicalUrl, locale } = props;

  const authorsArray = authors.map((author) => {
    const person: Record<string, unknown> = {
      "@type": "Person",
      name: author.data.name,
      url: author.data.authorLink,
    };
    if (author.data.jobTitle) person.jobTitle = author.data.jobTitle;
    if (author.data.sameAs && author.data.sameAs.length > 0) {
      person.sameAs = author.data.sameAs;
    }
    return person;
  });

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl.toString(),
    },
    headline: postFrontmatter.title,
    description: postFrontmatter.description,
    image: image.src,
    author: authorsArray.length === 1 ? authorsArray[0] : authorsArray,
    datePublished: postFrontmatter.pubDate,
    dateModified: postFrontmatter.updatedDate,
    publisher: {
      "@type": "Organization",
      name: clientConfig.business.name,
      logo: {
        "@type": "ImageObject",
        url: clientConfig.business.logo.startsWith("http")
          ? clientConfig.business.logo
          : `${clientConfig.business.url}${clientConfig.business.logo}`,
      },
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [
        ".tldr-block",
        ".key-takeaways",
        ".citation-capsule",
        "#blog-post-content > p:first-of-type",
      ],
    },
  };

  // GEO enhancements
  if (locale) schema.inLanguage = locale;
  if (postFrontmatter.categories && postFrontmatter.categories.length > 0) {
    schema.articleSection = postFrontmatter.categories[0];
  }

  return schema;
}

export function generateFaqPageSchema(faqItems: FaqItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function generateServiceSchema(
  service: CollectionEntry<"services">,
): object {
  const { business } = clientConfig;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.data.title,
    description: service.data.description,
    provider: {
      "@type": business.type,
      name: business.name,
      url: business.url,
    },
  };

  if (service.data.image) {
    schema.image = service.data.image;
  }

  return schema;
}

export function generatePersonSchema(
  person: CollectionEntry<"authors">,
): object {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.data.name,
    description: person.data.about,
  };

  if (person.data.email) schema.email = person.data.email;
  if (person.data.authorLink) schema.url = person.data.authorLink;
  if (person.data.jobTitle) schema.jobTitle = person.data.jobTitle;
  if (person.data.knowsAbout && person.data.knowsAbout.length > 0) {
    schema.knowsAbout = person.data.knowsAbout;
  }
  if (person.data.worksFor) {
    schema.worksFor = {
      "@type": "Organization",
      name: person.data.worksFor,
    };
  }
  if (person.data.sameAs && person.data.sameAs.length > 0) {
    schema.sameAs = person.data.sameAs;
  }
  if (person.data.avatar) {
    schema.image = person.data.avatar;
  }

  return schema;
}

export function generateSiteNavigationSchema(
  navItems: navItem[],
): object {
  const { business } = clientConfig;

  function extractLinks(items: navItem[]): { name: string; url: string }[] {
    const links: { name: string; url: string }[] = [];
    for (const item of items) {
      if ("link" in item) {
        links.push({
          name: (item as navLinkItem).text,
          url: `${business.url}${(item as navLinkItem).link}`,
        });
      } else if ("dropdown" in item) {
        for (const dropItem of item.dropdown) {
          links.push({
            name: dropItem.text,
            url: `${business.url}${dropItem.link}`,
          });
        }
      } else if ("megaMenuColumns" in item) {
        for (const col of item.megaMenuColumns) {
          for (const colItem of col.items) {
            links.push({
              name: colItem.text,
              url: `${business.url}${colItem.link}`,
            });
          }
        }
      }
    }
    return links;
  }

  const links = extractLinks(navItems);

  return {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: links.map((l) => l.name),
    url: links.map((l) => l.url),
  };
}

// ============================================================
// Helper: wrap schema object into script tag
// ============================================================

function toScriptTag(schema: object): string {
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

// ============================================================
// Main Generator
// ============================================================

export default function jsonLDGenerator(props: JsonLDProps): string {
  const scripts: string[] = [];

  // Organization schema on every page
  scripts.push(toScriptTag(generateOrganizationSchema()));

  if (props.type === "blog") {
    scripts.push(toScriptTag(generateBlogPostingSchema(props)));
  } else if (props.type === "service") {
    scripts.push(toScriptTag(generateWebSiteSchema()));
    scripts.push(toScriptTag(generateServiceSchema(props.service)));
  } else if (props.type === "person") {
    scripts.push(toScriptTag(generateWebSiteSchema()));
    scripts.push(toScriptTag(generatePersonSchema(props.person)));
  } else if (props.type === "faq") {
    scripts.push(toScriptTag(generateWebSiteSchema()));
    scripts.push(toScriptTag(generateFaqPageSchema(props.faqItems)));
  } else {
    // general
    scripts.push(toScriptTag(generateWebSiteSchema()));
  }

  return scripts.join("\n");
}
