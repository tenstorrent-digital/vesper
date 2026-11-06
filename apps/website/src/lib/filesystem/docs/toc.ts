import { Heading } from "mdast";
import { toString } from "mdast-util-to-string";

import { createUniqueHeadingId, getMarkdownParser } from "@/lib/mdx/utils.mts";

import type { DocExtension, TOCItem } from "./types";

/**
 * @param markdown - the doc's markdown, without frontmatter
 * @param ext - the doc's extension
 * @param maxDepth - (optional) deepest heading level to list
 * @default 6
 */
export const getTOC = (
  markdown: string,
  ext: DocExtension,
  maxDepth = 6,
): TOCItem[] => {
  // every heading gets an id (even unlisted ones) so ids match the rendered doc
  const getHeadingId = createUniqueHeadingId();

  return getMarkdownParser(ext)
    .parse(markdown)
    .children.filter((child): child is Heading => child.type === "heading")
    .map((heading) => {
      const text = toString(heading);
      const id = getHeadingId(text);

      return { id, text, depth: heading.depth };
    })
    .filter(({ depth }) => depth <= maxDepth);
};
