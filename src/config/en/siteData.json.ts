import { type SiteDataProps } from "../types/configDataTypes";

// Update this file with your site specific information
const siteData: SiteDataProps = {
  name: "Thales Web",
  // Your website's title and description (meta fields)
  title:
    "Thales Web - Professional web solutions for SaaS, Services, Portfolio, Blog, and more. Build your digital presence with ease.",
  description:
    "Create an amazing website for your business with our professional web solutions designed using Astro and Tailwind CSS. Perfect for businesses, startups, and enterprises.",

  // Your information for blog post purposes
  author: {
    name: "Thales Web",
    email: "contact@thalesweb.com",
    twitter: "ThalesWeb",
  },

  // default image for meta tags if the page doesn't have an image already
  defaultImage: {
    src: "/images/thalesweb-logo.jpg",
    alt: "Thales Web logo",
  },
};

export default siteData;
