/**
 * the command palette's search index
 *
 * built on the server from `navSections` and handed to the client as plain
 * data, so ⌘K works instantly and offline without an API round trip
 *
 * only `##`/`###` headings are included: `#` duplicates the page title, and
 * anything deeper is noise in a result list
 */

import { navSections } from "@/lib/nav";

export interface SearchHeading {
  id: string;
  text: string;
}

export interface SearchEntry {
  href: string;
  title: string;
  description?: string;
  /** the sidebar section this page belongs to, shown as a result's eyebrow */
  section: string;
  headings: SearchHeading[];
}

export const searchIndex: SearchEntry[] = navSections.flatMap((section) =>
  section.pages.map(({ href, title, description, headings }) => ({
    href,
    title,
    description,
    section: section.label,
    headings: headings
      .filter(({ depth }) => depth === 2 || depth === 3)
      .map(({ id, text }) => ({ id, text })),
  })),
);
