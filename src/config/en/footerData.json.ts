import { type FooterDataProps } from "../types/configDataTypes";

const footerData: FooterDataProps = {
  description: "Astro-based SEO/GEO/AEO optimized web agency. We build systems that bring customers without ad spend.",
  columns: [
    {
      title: "Services",
      links: [
        { label: "Services", href: "/en/services" },
        { label: "Projects", href: "/en/projects" },
        { label: "Contact", href: "/en/contact" },
      ],
    },
    {
      title: "Content",
      links: [
        { label: "Blog", href: "/en/blog" },
        { label: "Categories", href: "/en/categories" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: "/en/terms-of-service" },
        { label: "Privacy Policy", href: "/en/privacy-policy" },
      ],
    },
  ],
  socials: [],
};

export default footerData;
