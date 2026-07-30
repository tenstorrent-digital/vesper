import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

export const DOCS_DIR = path.join(
  process.cwd(), // `apps/docs/`
  "..",
  "..",
  "docs",
);

export type DocExtension = "md" | "mdx";

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
}

/**
 * regex for frontmatter
 */
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;

/**
 * read frontmatter straight off disk rather than from the compiled MDX module
 * (keeps out of the module graph)
 */
const readFrontmatter = (filePath: string): Frontmatter => {
  const match = FRONTMATTER.exec(fs.readFileSync(filePath, "utf8"));
  if (!match?.[1]) return {};

  const parsed: unknown = parse(match[1]);
  return typeof parsed === "object" && parsed !== null
    ? (parsed as Frontmatter)
    : {};
};

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

    const slug = [...segments, name];

    return [
      {
        slug,
        href: `/${slug.join("/")}`,
        ext: ext as DocExtension,
        frontmatter: readFrontmatter(entryPath),
      },
    ];
  });

const docSortOrder = (a: DocEntry, b: DocEntry) => {
  const [x, y] = [a.frontmatter.order, b.frontmatter.order];

  // sort by `order` (if avail)
  if (x !== undefined && y !== undefined) return x - y;
  if (x !== undefined) return -1;
  if (y !== undefined) return 1;

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
 * @see [`loadDoc`](apps/docs/src/lib/filesystem/docs/load.ts) - for _loading_ the doc
 */
export const getDoc = (slug: string[]): DocEntry | undefined =>
  docs.find((doc) => doc.href === `/${slug.join("/")}`);

/**
 * get docs directly inside a given folder from `docs/`
 *
 * @param {string} folder - folder name from `docs/`
 *
 * @example
 * const componentsDocs = getDocsInFolder("components");
 */
export const getDocsInFolder = (folder: string): DocEntry[] =>
  docs.filter((doc) => doc.slug.length === 2 && doc.slug[0] === folder);
