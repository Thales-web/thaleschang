import { type SiteDataProps } from "../types/configDataTypes";

// Update this file with your site specific information
const siteData: SiteDataProps = {
  name: "Thales Web",
  // Your website's title and description (meta fields)
  title:
    "Thales Web - SaaS, 서비스, 포트폴리오, 블로그 등을 위한 전문 웹 솔루션. 손쉽게 디지털 프레즌스를 구축하세요.",
  description:
    "Astro와 Tailwind CSS로 제작된 전문 웹 솔루션으로 비즈니스를 위한 멋진 웹사이트를 만드세요. 기업, 스타트업, 엔터프라이즈에 최적화되어 있습니다.",

  // Your information for blog post purposes
  author: {
    name: "Thales Web",
    email: "contact@thalesweb.com",
    twitter: "ThalesWeb",
  },

  // default image for meta tags if the page doesn't have an image already
  defaultImage: {
    src: "/images/thalesweb-logo.jpg",
    alt: "Thales Web 로고",
  },
};

export default siteData;
