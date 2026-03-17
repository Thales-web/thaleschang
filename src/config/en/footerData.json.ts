import { type FooterDataProps } from "../types/configDataTypes";

const footerData: FooterDataProps = {
  description: "Enter your website description here.",
  columns: [
    {
      title: "Services",
      links: [
        { label: "Web Development", href: "/services" },
        { label: "SEO Optimization", href: "/services" },
        { label: "GEO Optimization", href: "/services" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Projects", href: "/projects" },
        { label: "Careers", href: "/careers" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact", href: "#" },
        { label: "Terms of Service", href: "/en/terms-of-service" },
        { label: "Privacy Policy", href: "/en/privacy-policy" },
      ],
    },
  ],
  socials: [
    { href: "https://twitter.com/", icon: "tabler/brand-x", label: "twitter (x)" },
    { href: "https://instagram.com/", icon: "tabler/brand-instagram", label: "instagram" },
    { href: "https://github.com/", icon: "logos/github", label: "github" },
  ],
};

export default footerData;
