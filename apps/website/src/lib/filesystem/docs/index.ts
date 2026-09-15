import fs from "node:fs";
import path from "node:path";

import { readFrontmatter } from "./frontmatter";
import { getToC } from "./toc";
import { DocEntry, DocExtension } from "./types";

export const DOCS_DIR = path.join(
  process.cwd(), // `apps/website/`
  "..",
  "..",
  "docs"
);

/**
 * recursively walks the `docs/` directory, returning an array of `DocEntry` objects
 */
const docEntries = (dir: string, segments: string[] = []): DocEntry[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry): DocEntry[] => {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // `assets/` holds images, not documents
      if (entry.name === "assets") return [];
      return docEntries(entryPath, [...segments, entry.name]);
    }

    const [, name, ext] = /^(.*)\.(mdx?)$/.exec(entry.name) ?? [];
    if (!name || !ext) return [];

    // `README.md` documents the `docs/` folder itself on GitHub - it is not a page
    if (name.toLowerCase() === "readme") return [];

    const slug = [...segments, name];

    const raw = fs.readFileSync(path.join(entry.parentPath, entry.name), {
      encoding: "utf-8",
    });

    return [
      {
        raw,
        slug,
        href: `/${slug.join("/")}`,
        ext: ext as DocExtension,
        frontmatter: readFrontmatter(raw),
        toc: getToC(raw, ext as DocExtension),
      },
    ];
  });

const docSortOrder = (a: DocEntry, b: DocEntry) => {
  const [x, y] = [a.frontmatter.order, b.frontmatter.order];

  // sort by `order` (if avail)
  if (x !== undefined && y !== undefined && x !== y) return x - y;
  if (x !== undefined && y === undefined) return -1;
  if (y !== undefined && x === undefined) return 1;

  // then by title
  return a.href.localeCompare(b.href);
};

/**
 * documentation from `docs/` (prerendered at build time)
 */
export const docs: DocEntry[] = docEntries(DOCS_DIR).sort(docSortOrder);

/**
 * get a single doc by its slug (path relative to `docs/`)
 *
 * @param {string[]} slug - slug of the doc to get (note that we use an array of segments here, not a string)
 *
 * @example
 * const accordionDoc = getDoc(["components", "accordion"]);
 *
 * @see [`loadDoc`](apps/website/src/lib/filesystem/docs/load.ts) - for _loading_ the doc
 */
export const getDoc = (slug: string[]): DocEntry | undefined =>
  docs.find((doc) => doc.href === `/${slug.join("/")}`);

export interface DocGroup {
  /** the folder these docs came from, or `undefined` for top-level docs */
  folder?: string;
  docs: DocEntry[];
}

/**
 * get every doc in `docs/`, grouped by folder for navigation
 *
 * top-level docs come first, then each folder alphabetically
 *
 * docs inside a group are sorted by frontmatter `order` first, then
 * alphabetical
 *
 * @example
 * const tree = getDocTree();
 * // [{ docs: [getting-started] }, { folder: "components", docs: [...] }]
 */
export const getDocTree = (): DocGroup[] => {
  const groups = new Map<string, DocEntry[]>();

  docs.forEach((doc) => {
    // only the first segment groups a doc — `docs/a/b/c.mdx` groups under `a`
    const folder = doc.slug.length > 1 ? doc.slug[0]! : "";
    groups.set(folder, [...(groups.get(folder) ?? []), doc]);
  });

  return (
    [...groups.entries()]
      // sort top-level docs first, then folders alphabetically
      .sort(([a], [b]) => (a === "" ? -1 : b === "" ? 1 : a.localeCompare(b)))
      .map(([folder, docs]) => ({ folder: folder || undefined, docs }))
  );
};
