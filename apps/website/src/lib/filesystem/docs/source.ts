/**
 * reads the *raw* source of a document in `docs/`
 *
 * everything here runs at build time on the server: the compiled MDX module is
 * what actually renders a page, but the raw text is what powers
 *
 * - the table of contents (`headings`)
 * - the command palette's search index
 * - the agent-facing endpoints (`/llms.txt`, `/llms-full.txt`, `*.md`)
 */

import fs from "node:fs";
import path from "node:path";

import { type DocEntry, DOCS_DIR } from ".";

/** absolute path to a doc's source file on disk */
export const docFilePath = ({ slug, ext }: DocEntry): string =>
  path.join(DOCS_DIR, `${slug.join("/")}.${ext}`);

/** a doc's raw source, frontmatter included */
export const readDocSource = (doc: DocEntry): string =>
  fs.readFileSync(docFilePath(doc), "utf8");

/** a doc's raw source with the frontmatter block removed */
export const readDocBody = (doc: DocEntry): string =>
  readDocSource(doc).replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");

/**
 * turns heading text into a URL fragment
 *
 * shared with `src/mdx-components.tsx` so the anchor a heading renders and the
 * anchor the table of contents links to are always the same string
 */
export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[`*_~]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * flattens the inline markdown inside a heading down to plain text
 *
 * `## The \`as\` prop [(see also)](/x)` -> `The as prop (see also)`
 *
 * this has to agree with `headingText` in
 * `src/lib/mdx/remark-heading-ids.mts`, which derives the same string from the
 * parsed tree — in particular, angle brackets are *not* stripped, because a
 * heading like ``#### `replace: Record<string, RegExp>` `` keeps them there
 */
const plainText = (markdown: string): string =>
  markdown
    // [label](href) -> label
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export interface DocHeading {
  /** heading level, 1-6 */
  depth: number;
  /** the heading's plain text */
  text: string;
  /** the `id` the heading renders with, and the fragment that links to it */
  id: string;
}

export interface DocSection {
  /** the heading that opens this section — absent for a document's lede */
  heading?: DocHeading;
  /** the raw markdown between this heading and the next one */
  body: string;
}

/**
 * a document, split into one section per heading
 *
 * this is the shape both the table of contents and the search index are built
 * from, so a content match always has a heading anchor to link to, and that
 * anchor is always the one the page actually renders
 *
 * fenced code blocks are skipped when looking for headings, so a `# comment`
 * inside a shell example never becomes a section of its own
 */
export const readDocOutline = (doc: DocEntry): DocSection[] => {
  const sections: DocSection[] = [{ body: "" }];
  const seen = new Map<string, number>();

  let fence: string | undefined;

  for (const line of readDocBody(doc).split(/\r?\n/)) {
    const fenceMatch = /^\s*(```+|~~~+)/.exec(line);

    if (fenceMatch?.[1]) {
      // a fence closes only on a fence of the same kind and at least as long
      if (!fence) fence = fenceMatch[1];
      else if (
        fenceMatch[1][0] === fence[0] &&
        fenceMatch[1].length >= fence.length
      ) {
        fence = undefined;
      }
    }

    const match = fence ? null : /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    const text = match?.[2] ? plainText(match[2]) : "";

    if (match?.[1] && text) {
      // de-duplicate repeated headings the same way GitHub does (`foo`, `foo-1`)
      const base = slugify(text);
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);

      sections.push({
        heading: {
          depth: match[1].length,
          text,
          id: count === 0 ? base : `${base}-${count}`,
        },
        body: "",
      });

      continue;
    }

    sections[sections.length - 1]!.body += `${line}\n`;
  }

  return sections;
};

/** every ATX heading in a document, in source order */
export const readDocHeadings = (doc: DocEntry): DocHeading[] =>
  readDocOutline(doc).flatMap(({ heading }) => (heading ? [heading] : []));
