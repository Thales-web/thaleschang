import { type FooterDataProps } from "../types/configDataTypes";

const footerData: FooterDataProps = {
  description: "웹사이트 설명을 여기에 입력하세요.",
  columns: [
    {
      title: "서비스",
      links: [
        { label: "웹 개발", href: "/services" },
        { label: "SEO 최적화", href: "/services" },
        { label: "GEO 최적화", href: "/services" },
      ],
    },
    {
      title: "회사 소개",
      links: [
        { label: "소개", href: "/about" },
        { label: "블로그", href: "/blog" },
        { label: "프로젝트", href: "/projects" },
        { label: "채용", href: "/careers" },
      ],
    },
    {
      title: "고객 지원",
      links: [
        { label: "문의하기", href: "#" },
        { label: "이용약관", href: "#" },
        { label: "개인정보처리방침", href: "#" },
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
