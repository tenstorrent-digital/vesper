/**
 * remark plugin that gives every heading a stable `id`
 *
 * the site's table of contents (and the deep links the command palette hands
 * out) need an anchor per heading. `src/mdx-components.tsx` maps headings to
 * `Typography`, which forwards whatever props it is given — so the id is set
 * here, on the mdast node, rather than in the component
 *
 * > [!IMPORTANT]
 * > the slug and the de-duplication counter must match
 * > `readDocHeadings` in `src/lib/filesystem/docs/source.ts`, which derives the
 * > same list straight from the markdown source for the table of contents.
 * > the logic is duplicated (rather than imported) because this file is loaded
 * > by `@next/mdx` through node's type stripping, which resolves imports
 * > itself and knows nothing about the app's `@/` path alias
 */

import type { Heading, Nodes, Root } from "mdast";
import type { Transformer } from "unified";

/** turns heading text into a URL fragment */
const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[`*_~]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * the plain text of a heading
 *
 * `inlineCode` carries its content as a value rather than a child, so the two
 * are collected the same way: `### \`addToast\` (Options)` -> "addToast (Options)"
 */
const headingText = (node: Nodes): string => {
  if (node.type === "text" || node.type === "inlineCode") return node.value;
  if (!("children" in node)) return "";

  return node.children.map(headingText).join("");
};

/** attach the id as an html attribute on the element the heading becomes */
const setId = (heading: Heading, id: string): void => {
  heading.data ??= {};
  heading.data.hProperties = { ...heading.data.hProperties, id };
};

export default function remarkHeadingIds(): Transformer<Root> {
  return (tree) => {
    /** how many times each slug has been used, for `foo`, `foo-1`, `foo-2`… */
    const seen = new Map<string, number>();

    const assign = (node: Nodes): void => {
      if (node.type === "heading") {
        const text = headingText(node).trim();

        if (text) {
          const base = slugify(text);
          const count = seen.get(base) ?? 0;
          seen.set(base, count + 1);

          setId(node, count === 0 ? base : `${base}-${count}`);
        }
      }

      if ("children" in node) node.children.forEach(assign);
    };

    assign(tree);
  };
}
