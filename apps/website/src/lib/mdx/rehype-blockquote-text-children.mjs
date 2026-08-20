/**
 * rehype plugin that stops the children of a blockquote from being treated as
 * block content
 *
 * markdown parses everything inside a blockquote as *flow* (block) content, so
 * its text becomes one paragraph per block:
 *
 * ```md
 * > Some text.
 * >
 * > Some more text.
 * ```
 *
 * that compiles to `<blockquote><p>…</p><p>…</p></blockquote>`, and since both
 * `blockquote` and `p` are mapped to components in `src/mdx-components.tsx`,
 * an `Admonition` ends up rendering a `Typography` per paragraph *inside* the
 * `Typography` it already wraps its children in (so copy in an admonition gets
 * the wrong variant)
 *
 * this plugin unwraps those paragraphs, so a blockquote's children are
 * forwarded to `Admonition` as *phrasing* (inline) content:
 *
 * ```jsx
 * <Admonition>Some text.{"\n\n"}Some more text.</Admonition>
 * ```
 *
 * inline markdown (links, `code`, **strong**, nested JSX) is untouched, and so
 * are flow children that genuinely need to stay blocks (lists, headings, code
 * blocks, tables, nested components)
 *
 * this has to run on hast rather than mdast (ie. it can not be a remark plugin
 * like `remark-jsx-text-children.mjs`): `mdast-util-to-hast` re-wraps the
 * children of a blockquote with `\n` text nodes when markdown is turned into
 * html, which `white-space: pre-wrap` would render as line breaks between
 * every unwrapped node
 */

/** hast element nodes, ie. anything that became an html tag */
const ELEMENT = "element";

/** hast text nodes, ie. the string content between tags */
const TEXT = "text";

/**
 * text node inserted between two unwrapped paragraphs, so the blank line an
 * author wrote between them survives
 *
 * `Typography` renders with `white-space: pre-wrap`, so this stays a visual
 * break rather than collapsing into a single space
 *
 * (created per use - hast nodes must not be shared between parents)
 */
const paragraphBreak = () => ({ type: TEXT, value: "\n\n" });

const isElement = (node, tagName) =>
  node.type === ELEMENT && node.tagName === tagName;

/**
 * `mdast-util-to-hast` pads the children of block elements with `\n` text
 * nodes for readable html - inside a blockquote every direct child is block
 * content, so a whitespace-only text node is always one of those separators
 */
const isFormattingWhitespace = (node) =>
  node.type === TEXT && !node.value.trim();

/**
 * flatten a blockquote's children into phrasing content
 *
 * only paragraphs are unwrapped - they are the node markdown creates for loose
 * text and hold nothing but inline content, so unwrapping them loses nothing
 *
 * every other element (list, heading, `pre`, table, nested blockquote or JSX
 * element) is left alone, since it can not be represented as phrasing content
 */
const toPhrasingContent = (children) => {
  const phrasing = [];
  let previousWasParagraph = false;

  children.forEach((child) => {
    // drop the separators to-hast added between block children
    if (isFormattingWhitespace(child)) return;

    if (!isElement(child, "p")) {
      phrasing.push(child);
      previousWasParagraph = false;
      return;
    }

    // keep the blank line between two paragraphs that both got unwrapped
    if (previousWasParagraph) phrasing.push(paragraphBreak());

    phrasing.push(...child.children);
    previousWasParagraph = true;
  });

  return phrasing;
};

/**
 * walk the tree depth first, flattening the children of every blockquote
 *
 * nested blockquotes are flattened from the inside out - a blockquote is block
 * content, so it stays in place inside its parent rather than being unwrapped
 */
const unwrapBlockquoteChildren = (node) => {
  const children = node.children;
  if (!children?.length) return;

  children.forEach(unwrapBlockquoteChildren);

  if (isElement(node, "blockquote"))
    node.children = toPhrasingContent(children);
};

export default function rehypeBlockquoteTextChildren() {
  return (tree) => {
    unwrapBlockquoteChildren(tree);
  };
}
