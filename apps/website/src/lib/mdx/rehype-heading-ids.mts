import type { Root } from "hast";
import { toString } from "mdast-util-to-string";
import type { Transformer } from "unified";

import { getHeadingId } from "./utils.mts";

export default function rehypeHeadingIds(): Transformer<Root> {
  return (tree) => {
    tree.children.forEach((child) => {
      if (child.type === "element" && /^h[1-6]$/.test(child.tagName)) {
        const text = toString(child);
        const id = getHeadingId(text);
        child.properties.id = id;
      }
    });
  };
}
