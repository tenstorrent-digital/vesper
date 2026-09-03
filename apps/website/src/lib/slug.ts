import { Children, isValidElement, type ReactNode } from "react";

/**
 * flatten a react node down to its text content
 *
 * headings in `docs/` are authored in markdown, so their children arrive as a
 * mix of strings and elements (`### The \`as\` prop` is a string plus a `code`
 * element) — anchors need the plain text of the whole heading
 */
const textContent = (node: ReactNode): string =>
  Children.toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }

      if (isValidElement<{ children?: ReactNode }>(child)) {
        return textContent(child.props.children);
      }

      return "";
    })
    .join("");

/**
 * turn a heading's content into a url fragment, so every heading on a page is
 * linkable (`## The as prop` -> `the-as-prop`)
 *
 * @param {ReactNode} node - the heading's children
 *
 * @example
 * slugify("Getting Started"); // "getting-started"
 */
export const slugify = (node: ReactNode): string =>
  textContent(node)
    .trim()
    .toLowerCase()
    // strip anything that is not a word character, space or hyphen
    .replace(/[^\p{L}\p{N} -]+/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
