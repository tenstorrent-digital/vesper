import { Heading } from "mdast";
import { toString } from "mdast-util-to-string";

import { getHeadingId, getMarkdownParser } from "../../mdx/markdown.mts";

import type { DocExtension, ToCItem } from "./types";

export const getToC = (markdown: string, ext: DocExtension): ToCItem[] => {
  return getMarkdownParser(ext)
    .parse(markdown)
    .children.filter((child): child is Heading => child.type === "heading")
    .map((heading) => {
      const text = toString(heading);
      const id = getHeadingId(text);

      return { id, text, depth: heading.depth };
    });
};
