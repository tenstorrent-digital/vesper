/**
 * remark plugin that removes the lede a document repeats from its frontmatter
 *
 * every file in `docs/` opens the same way, so it reads correctly on GitHub:
 *
 * ```md
 * ---
 * title: Button
 * description: A versatile, polymorphic button component…
 * ---
 *
 * # Button
 *
 * A versatile, polymorphic button component…
 * ```
 *
 * the website renders that title and description itself, in the page header
 * above the document body (`src/components/doc/doc-header.tsx`), so without
 * this plugin every page would show both twice
 *
 * only two very specific nodes are dropped:
 *
 * 1. a level 1 heading, if it is the first block in the document
 * 2. the paragraph after it, but only when its text matches the frontmatter
 *    `description` — so a real opening paragraph (like the one in `tokens.mdx`)
 *    is left alone
 *
 * this runs on documents in `docs/` only: MDX files that are routes in their
 * own right (`src/app/**\/page.mdx`) have no frontmatter contract to dedupe
 * against
 */

import type { Nodes, Paragraph, Root } from "mdast";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Transformer } from "unified";

/** monorepo root `docs/` folder, resolved from this file rather than `cwd` */
const DOCS_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../../..",
  "docs",
);

/** the frontmatter block a document opens with */
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;

/**
 * the raw `description` from a document's frontmatter
 *
 * read off the original source (`file.value`) with a regex rather than from
 * the tree: `remark-mdx-frontmatter` has already turned the frontmatter into
 * an export by the time this runs, so the yaml node is gone
 *
 * only simple scalar values are supported, which is all the frontmatter
 * contract uses
 */
const frontmatterDescription = (source: string): string | undefined => {
  const block = FRONTMATTER.exec(source)?.[1];
  if (!block) return;

  const value = /^description:[^\S\n]*(.*)$/m.exec(block)?.[1]?.trim();
  if (!value) return;

  // strip the quotes yaml allows around a scalar
  return value.replace(/^["']|["']$/g, "");
};

/** a paragraph's plain text, for comparison against the description */
const paragraphText = (node: Nodes): string => {
  if (node.type === "text" || node.type === "inlineCode") return node.value;
  if (!("children" in node)) return "";

  return node.children.map(paragraphText).join("");
};

const normalise = (text: string) =>
  text
    .replace(/\s+/g, " ")
    .replace(/[.\s]+$/, "")
    .trim()
    .toLowerCase();

const isParagraph = (node: Nodes | undefined): node is Paragraph =>
  node?.type === "paragraph";

/**
 * node types that carry no rendered content and can sit above the title
 *
 * `remark-frontmatter` leaves the frontmatter as a `yaml` node, and
 * `remark-mdx-frontmatter` rewrites it into an `mdxjsEsm` export — either way
 * the heading is not the tree's first child
 */
const PREAMBLE = new Set(["yaml", "toml", "mdxjsEsm", "mdxFlowExpression"]);

export default function remarkDocLede(): Transformer<Root> {
  return (tree, file) => {
    if (!file.path || !path.resolve(file.path).startsWith(DOCS_DIR)) return;

    const start = tree.children.findIndex(
      (node) => !PREAMBLE.has(node.type as string),
    );
    if (start === -1) return;

    const title = tree.children[start];
    if (title?.type !== "heading" || title.depth !== 1) return;

    const description = frontmatterDescription(String(file.value));
    const lede = tree.children[start + 1];

    const dropLede =
      !!description &&
      isParagraph(lede) &&
      normalise(paragraphText(lede)) === normalise(description);

    tree.children.splice(start, dropLede ? 2 : 1);
  };
}
