import { type SiteDataProps } from "../types/configDataTypes";

// Update this file with your site specific information
const siteData: SiteDataProps = {
  name: "Thales Chang",
  // Your website's title and description (meta fields)
  title:
    "Thales Chang - AI Marketing System Architecture & Builder",
  description:
    "Expert in AI marketing system architecture and implementation. Specializing in SEO, GEO, AEO optimization and marketing automation for business growth.",

  // Your information for blog post purposes
  author: {
    name: "Thales Chang",
    email: "info@funnelhacker.co.kr",
    twitter: "",
  },

  // default image for meta tags if the page doesn't have an image already
  defaultImage: {
    src: "/images/og-default.jpg",
    alt: "Thales Chang - AI Marketing System Architect",
  },
};

export default siteData;
