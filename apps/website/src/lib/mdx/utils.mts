import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import slugify from "slugify";
import { unified } from "unified";

import type { DocExtension } from "../filesystem/docs/types";

export const markdownParser = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkFrontmatter);

export const mdxParser = markdownParser().use(remarkMdx);

export const getMarkdownParser = (filetype: DocExtension) =>
  filetype === "md" ? markdownParser : mdxParser;

export const getHeadingId = (text: string) =>
  slugify(text, { lower: true, strict: true });

/**
 * creates a `getHeadingId` for one document that keeps every id unique,
 * suffixing repeated ids the same way github does (eg. a changelog's
 * `patch-changes`, `patch-changes-1`, `patch-changes-2`)
 *
 * headings have to be passed in document order
 */
export const createHeadingIds = () => {
  const ids = new Set<string>();

  return (text: string) => {
    const base = getHeadingId(text);

    let id = base;
    for (let count = 1; ids.has(id); count++) id = `${base}-${count}`;

    ids.add(id);
    return id;
  };
};
