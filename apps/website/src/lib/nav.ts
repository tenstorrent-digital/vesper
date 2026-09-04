/**
 * the site's navigation model
 *
 * `docs/` is the source of truth for page content, but the site also has a few
 * routes of its own (`/components`, `/agents`, …). this module merges the two
 * into one ordered list that the sidebar, the command palette, the prev/next
 * footer, and the agent endpoints all read from, so a new document in `docs/`
 * shows up everywhere at once
 */

import { type DocEntry, docs, getDocTree } from "@/lib/filesystem/docs";
import { type DocHeading, readDocHeadings } from "@/lib/filesystem/docs/source";
import { convertKebabToTitleCase } from "@/lib/filesystem/utils";

export interface NavPage {
  href: string;
  title: string;
  description?: string;
  /** the folder in `docs/` this page came from, if any */
  group?: string;
  /** `route` pages are built by the app, `doc` pages come from `docs/` */
  kind: "doc" | "route";
  /** every heading on the page, for the table of contents and search */
  headings: DocHeading[];
}

export interface NavSection {
  /** stable id, used as a react key and for the section's anchor */
  id: string;
  label: string;
  pages: NavPage[];
}

const titleFor = (doc: DocEntry) =>
  doc.frontmatter.title ??
  convertKebabToTitleCase(doc.slug[doc.slug.length - 1] ?? "");

const toNavPage = (doc: DocEntry): NavPage => ({
  href: doc.href,
  title: titleFor(doc),
  description: doc.frontmatter.description,
  group: doc.slug.length > 1 ? doc.slug[0] : undefined,
  kind: "doc",
  headings: readDocHeadings(doc),
});

/** app-owned routes that are not backed by a file in `docs/` */
const ROUTES: Record<string, NavPage[]> = {
  overview: [
    {
      href: "/",
      title: "Introduction",
      description: "Tenstorrent's design system for the web.",
      kind: "route",
      headings: [],
    },
  ],
  components: [
    {
      href: "/components",
      title: "All components",
      description: "Every component in the system, at a glance.",
      group: "components",
      kind: "route",
      headings: [],
    },
  ],
  agents: [
    {
      href: "/agents",
      title: "Agent Console",
      description:
        "Machine-readable entrypoints, cheat sheets, and prompt packs for AI agents reading these docs.",
      kind: "route",
      headings: [],
    },
  ],
};

/**
 * the sidebar's sections, in display order
 *
 * - `Overview` — the home page plus any top-level document in `docs/`
 * - one section per folder in `docs/`
 * - `For Agents` — routes that only exist on the website
 */
export const navSections: NavSection[] = (() => {
  const tree = getDocTree();

  const topLevel = tree.find((group) => !group.folder)?.docs ?? [];
  const folders = tree.filter((group) => !!group.folder);

  return [
    {
      id: "overview",
      label: "Overview",
      pages: [...ROUTES.overview!, ...topLevel.map(toNavPage)],
    },
    ...folders.map(({ folder, docs }) => ({
      id: folder!,
      label: convertKebabToTitleCase(folder!),
      pages: [...(ROUTES[folder!] ?? []), ...docs.map(toNavPage)],
    })),
    {
      id: "agents",
      label: "For Agents",
      pages: ROUTES.agents!,
    },
  ];
})();

/** every page on the site, flattened in sidebar order */
export const navPages: NavPage[] = navSections.flatMap(
  (section) => section.pages,
);

export const getNavPage = (href: string): NavPage | undefined =>
  navPages.find((page) => page.href === href);

/** the pages before and after `href`, for the prev/next footer */
export const getNavNeighbours = (
  href: string,
): { previous?: NavPage; next?: NavPage } => {
  const index = navPages.findIndex((page) => page.href === href);
  if (index === -1) return {};

  return {
    previous: navPages[index - 1],
    next: navPages[index + 1],
  };
};

/** page titles keyed by route, so client components can label a path segment */
export const navTitles: Record<string, string> = Object.fromEntries(
  navPages.map(({ href, title }) => [href, title]),
);

/** how many documents live in `docs/` (used on the home page) */
export const docCount = docs.length;

/**
 * how many components are documented
 *
 * counted from `docs/components/` rather than from the showcase registry:
 * the registry is a client module, so a server component that imports it gets
 * a client reference back, and `SHOWCASE.length` is `0`
 */
export const componentCount = docs.filter(
  (doc) => doc.slug[0] === "components",
).length;
