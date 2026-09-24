import fs from "node:fs";
import path from "node:path";

import { readFrontmatter, stripFrontmatter } from "./frontmatter";
import { getTOC } from "./toc";
import { DocEntry, DocExtension } from "./types";

const DOCS_DIR = path.join(
  process.cwd(), // `apps/website/`
  "..",
  "..",
  "docs",
);

const getDocsPaths = () =>
  fs
    .readdirSync(DOCS_DIR, { withFileTypes: true, recursive: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name !== "README.md" &&
        /\.(md|mdx)$/.test(entry.name),
    )
    .map((entry) => path.join(entry.parentPath, entry.name));

const getDocSlug = (path: string) =>
  path
    .replace(/\.[^/.]+$/, "")
    .slice(DOCS_DIR.length + 1)
    .split("/");

const getDocExt = (path: string) =>
  path.slice(path.lastIndexOf(".") + 1) as DocExtension;

const getRawDoc = (path: string) =>
  fs.readFileSync(path, { encoding: "utf-8" });

export const parseDoc = (path: string): DocEntry => {
  const slug = getDocSlug(path);
  const ext = getDocExt(path);
  const raw = getRawDoc(path);
  const markdown = stripFrontmatter(raw);
  const frontmatter = readFrontmatter(raw);
  const toc = getTOC(markdown, ext);
  const href = `/${slug.join("/")}`;

  return { toc, slug, ext, markdown, frontmatter, href };
};

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
export const getDoc = (slug: string[]) => {
  const path = getDocsPaths().find(
    (path) => slug.join("/") === getDocSlug(path).join("/"),
  );
  if (!path) return undefined;

  return parseDoc(path);
};

export const docsSortOrder = (a: DocEntry, b: DocEntry) => {
  const [x, y] = [a.frontmatter.order, b.frontmatter.order];

  // sort by `order` (if avail)
  if (x !== undefined && y !== undefined && x !== y) return x - y;
  if (x !== undefined && y === undefined) return -1;
  if (y !== undefined && x === undefined) return 1;

  // then by title
  return a.href.localeCompare(b.href);
};

const getAllDocs = () => getDocsPaths().map(parseDoc);

export const getDocsSlugs = () => getDocsPaths().map(getDocSlug);

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
export const getDocTree = () => {
  const groups = new Map<string, string[]>();

  getDocsPaths().forEach((path) => {
    const slug = getDocSlug(path);

    // only the first segment groups a doc — `docs/a/b/c.mdx` groups under `a`
    const folder = slug.length > 1 ? slug[0]! : "";
    groups.set(folder, [...(groups.get(folder) ?? []), path]);
  });

  return (
    [...groups.entries()]
      // sort top-level docs first, then folders alphabetically
      .sort(([a], [b]) => (a === "" ? -1 : b === "" ? 1 : a.localeCompare(b)))
      .map(([folder, docPaths]) => ({ folder: folder || undefined, docPaths }))
  );
};

export const getSidebarData = () =>
  getDocTree().map(({ folder, docPaths }) => ({
    folder,
    pages: docPaths
      .map(parseDoc)
      .sort(docsSortOrder)
      .map(({ href, frontmatter }) => ({
        href,
        title: frontmatter.title,
      })),
  }));

export const getPageTitles = () =>
  Object.fromEntries(
    getAllDocs().flatMap(({ href, frontmatter }) =>
      frontmatter.title ? [[href, frontmatter.title]] : [],
    ),
  );

export const markdownFileAsPrompt = (title: string, markdown: string) =>
  [
    `You are helping me use Vesper, Tenstorrent's React design system.`,
    `Below is the full documentation for "${title}".`,
    `Answer using only these APIs, and prefer the documented defaults.`,
    ``,
    `---`,
    ``,
    markdown,
  ].join("\n");
