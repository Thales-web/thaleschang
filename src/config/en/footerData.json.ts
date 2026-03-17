import { type FooterDataProps } from "../types/configDataTypes";

const footerData: FooterDataProps = {
  description: "AI Marketing System Architecture & Builder",
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
