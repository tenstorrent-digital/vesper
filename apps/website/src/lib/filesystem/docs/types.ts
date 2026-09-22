import type { ComponentType } from "react";

export type DocExtension = "md" | "mdx";

export type TOCItem = {
  id: string;
  text: string;
  depth: 1 | 2 | 3 | 4 | 5 | 6;
};

/**
 * frontmatter fields
 *
 * every field is optional so missing values don't fail builds
 */
export interface Frontmatter {
  /** page title, used for `<title>`, the sidebar, and breadcrumbs */
  title?: string;
  /** short summary, used for `<meta name="description">` */
  description?: string;
  /** sort weight within the doc's folder - unordered docs sort alphabetically */
  order?: number;
}

export interface DocEntry {
  /** raw text content of the doc file, without frontmatter */
  markdown: string;
  /**
   * array of path segments relative to `docs/`
   *
   * for example, for `docs/components/accordion.mdx`, the slug would
   * be `["components", "accordion"]`
   */
  slug: string[];
  /** route for this doc, eg. `/components/accordion` */
  href: string;
  /** doc's file extension (we need to resolve the right dynamic import) */
  ext: DocExtension;
  frontmatter: Frontmatter;
  toc: TOCItem[];
}

export interface DocModule {
  default: ComponentType;
  frontmatter?: Frontmatter;
}
