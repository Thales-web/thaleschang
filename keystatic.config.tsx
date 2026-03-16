/**
 * * This is the Keystatic configuration file. It is used to define the collections and fields that will be used in the Keystatic CMS.
 *
 * ! This works in conjunction with Astro content collections. If you update one, you must update the other.
 *
 * Access keystatic interface at /admin or /keystatic
 * This works in local mode in dev, then cloud mode in prod
 * Cloud deployment is free to sign up (up to 3 users per team)
 * Docs: https://keystatic.com/docs/cloud
 * Create a Keystatic Cloud account here: https://keystatic.cloud/
 */

import { config } from "@keystatic/core";

import Collections from "@/components/keystatic-components/Collections";

export default config({
  // works in local mode in dev, then cloud mode in prod
  storage: import.meta.env.DEV === true ? { kind: "local" } : { kind: "cloud" },
  // cloud deployment is free to sign up (up to 3 users per team)
  // docs: https://keystatic.com/docs/cloud
  // create a Keystatic Cloud account here: https://keystatic.cloud/
  cloud: { project: "cosmic-themes/starter" },
  ui: {
    brand: { name: "Thales Web" },
  },
  collections: {
    // 콘텐츠
    blogKO: Collections.Blog("ko"),
    blogEN: Collections.Blog("en"),
    authors: Collections.Authors(""),
    categories: Collections.Categories(),
    // 서비스 & 프로젝트
    servicesKO: Collections.Services("ko"),
    servicesEN: Collections.Services("en"),
    projectsKO: Collections.Projects("ko"),
    projectsEN: Collections.Projects("en"),
    // 기타 페이지
    otherPagesKO: Collections.OtherPages("ko"),
    otherPagesEN: Collections.OtherPages("en"),
    careersKO: Collections.Careers("ko"),
    careersEN: Collections.Careers("en"),
  },

  singletons: {
    clientSettings: Collections.ClientSettings(),
    faqDataKO: Collections.FaqData("ko"),
    faqDataEN: Collections.FaqData("en"),
    resumeKO: Collections.Resume("ko"),
    resumeEN: Collections.Resume("en"),
  },
});
