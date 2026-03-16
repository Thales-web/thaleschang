// --------------------------------------------------------
// docs site settings types

/** Configuration for documentation-specific site settings */
export interface DocsSiteSettingsProps {
  /** Base route for documentation pages (e.g., "docs" → /docs/) */
  docsRoute: string;
  /** Enable previous/next page navigation at bottom of docs */
  pagination: boolean;
  /** Show copy-link buttons on headings */
  copyLinkButtons: boolean;
  /** Default table of contents settings applied when not overridden per-page */
  tableOfContents: {
    minHeadingLevel: number;
    maxHeadingLevel: number;
  };
}

// --------------------------------------------------------
// sidebar navigation types

/** Badge displayed next to a sidebar item (e.g., "New", "Updated") */
export interface SidebarBadge {
  text: string;
  variant?: "note" | "tip" | "caution" | "danger" | "info";
}

/** A section within a sidebar tab, corresponding to a content folder */
export interface SidebarSection {
  /** Must match the folder name under src/docs/data/docs/{lang}/ */
  id: string;
  /** Display label for this section in the sidebar */
  title: string;
}

/** A top-level tab in the sidebar navigation */
export interface SidebarTab {
  /** Unique identifier for this tab */
  id: string;
  /** Display label for this tab */
  title: string;
  /** Optional description shown as tooltip or subtitle */
  description?: string;
  /** Icon reference for astro-icon (e.g., "tabler/file-text") */
  icon?: string;
  /** Ordered list of sections within this tab */
  sections: SidebarSection[];
}

/** Complete sidebar navigation configuration */
export interface SidebarNavData {
  tabs: SidebarTab[];
}

// --------------------------------------------------------
// docs entry types (resolved from content collection + sidebar config)

/** A single documentation page entry with resolved navigation data */
export interface DocsEntry {
  /** Content collection entry ID */
  id: string;
  /** URL slug for routing */
  slug: string;
  /** Page title from frontmatter */
  title: string;
  /** Sidebar display label (falls back to title) */
  sidebarLabel: string;
  /** Sort order within its section */
  order: number;
  /** Section folder this entry belongs to */
  section: string;
  /** Optional badge metadata */
  badge?: SidebarBadge;
}

/** Navigation context for previous/next page links */
export interface DocsNavigation {
  prev: DocsEntry | null;
  next: DocsEntry | null;
}
