/**
 * the search index
 *
 * built on the server from `navSections` and `docs/`, in two sizes:
 *
 * - {@link searchIndex} — titles, descriptions, and headings. small enough to
 *   ride along in the HTML of every page, so ⌘K works on the first keystroke
 * - {@link fullSearchIndex} — the above plus every page's prose, split by
 *   heading. served as one static file from `/api/search/index.json`, fetched
 *   by the palette when the browser is idle, and used directly by `/api/search`
 *
 * both are plain data and both are produced at build time: there is no search
 * service, no runtime indexing, and nothing to keep in sync — a new file in
 * `docs/` is searchable the moment it is committed
 */

import { docs } from "@/lib/filesystem/docs";
import { readDocOutline } from "@/lib/filesystem/docs/source";
import { navSections } from "@/lib/nav";

import { toPlainText } from "./plain";
import type { SearchEntry, SearchSection } from "./query";

export * from "./query";

/**
 * a page's prose, one entry per heading
 *
 * only pages backed by a file in `docs/` have any: `/`, `/components`, and
 * `/agents` are built by the app, and are matched on their title and
 * description alone
 */
const sectionsFor = (href: string): SearchSection[] | undefined => {
  const doc = docs.find((entry) => entry.href === href);
  if (!doc) return undefined;

  return readDocOutline(doc).flatMap(({ heading, body }) => {
    const text = toPlainText(body);
    if (!text) return [];

    return [{ id: heading?.id, heading: heading?.text, text }];
  });
};

const entries = (withContent: boolean): SearchEntry[] =>
  navSections.flatMap((section) =>
    section.pages.map(({ href, title, description, headings }) => ({
      href,
      title,
      description,
      section: section.label,
      // `#` duplicates the page title, and anything below `###` is noise
      headings: headings
        .filter(({ depth }) => depth === 2 || depth === 3)
        .map(({ id, text }) => ({ id, text })),
      ...(withContent ? { sections: sectionsFor(href) } : {}),
    })),
  );

/** titles, descriptions, and headings — inlined into every page */
export const searchIndex: SearchEntry[] = entries(false);

/** the above plus full text — served from `SEARCH_INDEX_PATH` */
export const fullSearchIndex: SearchEntry[] = entries(true);
