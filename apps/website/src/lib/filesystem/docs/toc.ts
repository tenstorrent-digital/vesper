import { Heading } from "mdast";
import { toString } from "mdast-util-to-string";

import { getHeadingId, getMarkdownParser } from "@/lib/mdx/utils.mts";

import type { DocExtension, TOCItem } from "./types";

export const getTOC = (markdown: string, ext: DocExtension): TOCItem[] => {
  return getMarkdownParser(ext)
    .parse(markdown)
    .children.filter((child): child is Heading => child.type === "heading")
    .map((heading) => {
      const text = toString(heading);
      const id = getHeadingId(text);

      return { id, text, depth: heading.depth };
    });
};
