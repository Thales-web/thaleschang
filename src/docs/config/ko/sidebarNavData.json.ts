/**
 * 한국어 문서 사이드바 네비게이션 설정
 *
 * - tabs[].sections[].id 는 src/docs/data/docs/ko/ 하위 폴더명과 반드시 일치해야 합니다.
 * - tabs 배열 순서 = 탭 표시 순서
 * - sections 배열 순서 = 섹션 표시 순서
 * - 섹션 내 페이지 순서는 각 MDX 파일의 frontmatter sidebar.order 값으로 결정됩니다.
 */

import { type SidebarNavData } from "../types/docsConfigTypes";

const sidebarNavData: SidebarNavData = {
  tabs: [
    {
      id: "main",
      title: "Documentation",
      icon: "tabler/file-text",
      sections: [
        { id: "getting-started", title: "Getting Started" },
        { id: "components", title: "Components" },
        { id: "reference", title: "Reference" },
      ],
    },
    {
      id: "api",
      title: "API Reference",
      icon: "tabler/code",
      sections: [
        { id: "endpoints", title: "Endpoints" },
        { id: "authentication", title: "Authentication" },
      ],
    },
    {
      id: "tutorials",
      title: "Tutorials",
      icon: "tabler/school",
      sections: [
        { id: "tutorials", title: "Tutorials" },
      ],
    },
  ],
};

export default sidebarNavData;
