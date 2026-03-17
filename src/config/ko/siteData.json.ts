import { type SiteDataProps } from "../types/configDataTypes";

// Update this file with your site specific information
const siteData: SiteDataProps = {
  name: "Thales Web",
  // Your website's title and description (meta fields)
  title:
    "Thales Web - Astro 기반 SEO/GEO/AEO 최적화 홈페이지 전문 에이전시",
  description:
    "Astro 프레임워크 기반 SEO, GEO, AEO 최적화 홈페이지 제작 전문 에이전시. 구글 검색 상위 노출부터 ChatGPT 인용까지, 마케팅 자동화 시스템 구축으로 광고비 없이 고객이 찾아오는 홈페이지를 만듭니다.",

  // Your information for blog post purposes
  author: {
    name: "Thales Web",
    email: "contact@thalesweb.com",
    twitter: "",
  },

  // default image for meta tags if the page doesn't have an image already
  defaultImage: {
    src: "/images/og-default.jpg",
    alt: "Thales Web - SEO/GEO/AEO 최적화 홈페이지 전문 에이전시",
  },
};

export default siteData;
