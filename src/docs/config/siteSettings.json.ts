/**
 * Documentation-specific site settings
 * Isolated from main site settings to maintain modularity
 */

import { type DocsSiteSettingsProps } from "./types/docsConfigTypes";

export const docsSiteSettings: DocsSiteSettingsProps = {
  /** Base route — generates pages under /{docsRoute}/{section}/{slug} */
  docsRoute: "docs",
  /** Show previous/next page navigation at the bottom of each doc page */
  pagination: true,
  /** Show copy-link button on hover for each heading */
  copyLinkButtons: true,
  /** Default TOC heading levels (can be overridden per-page via frontmatter) */
  tableOfContents: {
    minHeadingLevel: 2,
    maxHeadingLevel: 3,
  },
};

export default docsSiteSettings;
