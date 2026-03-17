import { type SiteDataProps } from "../types/configDataTypes";

// Update this file with your site specific information
const siteData: SiteDataProps = {
  name: "Thales Web",
  // Your website's title and description (meta fields)
  title:
    "Thales Web - Astro-based SEO/GEO/AEO Optimized Web Agency",
  description:
    "Web agency specializing in Astro framework-based SEO, GEO, AEO optimized websites. From Google top rankings to ChatGPT citations, we build websites that bring customers without ad spend.",

  // Your information for blog post purposes
  author: {
    name: "Thales Web",
    email: "contact@thalesweb.com",
    twitter: "",
  },

  // default image for meta tags if the page doesn't have an image already
  defaultImage: {
    src: "/images/og-default.jpg",
    alt: "Thales Web - SEO/GEO/AEO Optimized Web Agency",
  },
};

export default siteData;
