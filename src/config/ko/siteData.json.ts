import { type SiteDataProps } from "../types/configDataTypes";

// Update this file with your site specific information
const siteData: SiteDataProps = {
  name: "Thales Chang",
  // Your website's title and description (meta fields)
  title:
    "Thales Chang - AI 마케팅 시스템 설계 & 구축 전문가",
  description:
    "AI 마케팅 시스템 아키텍트 Thales Chang. SEO, GEO(생성형 엔진 최적화), AEO(답변 엔진 최적화) 전략 수립부터 N8N/MAKE 기반 마케팅 자동화 시스템 구축까지. AI 검색 시대에 발견되고 인용되는 비즈니스를 만듭니다.",

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
