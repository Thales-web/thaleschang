import { type FooterDataProps } from "../types/configDataTypes";

const footerData: FooterDataProps = {
  description: "Astro 기반 SEO/GEO/AEO 최적화 홈페이지 전문 에이전시. 광고비 없이도 고객이 찾아오는 시스템을 설계합니다.",
  columns: [
    {
      title: "서비스",
      links: [
        { label: "서비스 소개", href: "/services" },
        { label: "프로젝트", href: "/projects" },
        { label: "문의하기", href: "/contact" },
      ],
    },
    {
      title: "콘텐츠",
      links: [
        { label: "블로그", href: "/blog" },
        { label: "카테고리", href: "/categories" },
      ],
    },
    {
      title: "법적 고지",
      links: [
        { label: "이용약관", href: "/terms-of-service" },
        { label: "개인정보처리방침", href: "/privacy-policy" },
      ],
    },
  ],
  socials: [],
};

export default footerData;
