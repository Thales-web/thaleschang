/**
 * English documentation sidebar navigation configuration
 *
 * - tabs[].sections[].id must match folder names under src/docs/data/docs/en/
 * - tabs array order = tab display order
 * - sections array order = section display order
 * - Page order within sections is determined by each MDX file's frontmatter sidebar.order value.
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
