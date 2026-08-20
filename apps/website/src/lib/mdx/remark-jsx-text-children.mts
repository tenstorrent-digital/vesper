/**
 * remark plugin that stops the children of JSX elements from being treated as
 * markdown *flow* (block) content
 *
 * MDX parses anything that sits on its own line as flow content, so text
 * written inside a component becomes a markdown paragraph:
 *
 * ```mdx
 * <Typography variant="copy-lg">
 *   Some text.
 * </Typography>
 * ```
 *
 * that compiles to `<Typography><p>Some text.</p></Typography>`, and since
 * `p` is mapped to a component in `src/mdx-components.tsx`, the text ends up
 * wrapped in a second `Typography` (or an `Accordion`/`Admonition` renders a
 * paragraph it never asked for)
 *
 * this plugin unwraps those paragraphs so a component's children stay
 * *phrasing* (inline) content:
 *
 * ```mdx
 * <Typography variant="copy-lg">Some text.</Typography>
 * ```
 *
 * inline markdown (links, `code`, **strong**, nested JSX) is untouched, and so
 * are flow children that genuinely need to stay blocks (lists, headings, code
 * blocks, tables, nested components)
 *
 * the `ignore` option is the only way to opt a component's children back into
 * markdown flow - see `next.config.ts`
 */

import type { Nodes, Root, RootContent } from "mdast";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import type { Transformer } from "unified";

/** JSX element nodes that can hold flow (block) content */
const JSX_FLOW_ELEMENT = "mdxJsxFlowElement";

/**
 * text node inserted between two unwrapped paragraphs, so the blank line an
 * author wrote between them survives
 *
 * `Typography` renders with `white-space: pre-wrap`, so this stays a visual
 * break rather than collapsing into a single space
 *
 * (created per use - mdast nodes must not be shared between parents)
 */
const paragraphBreak = (): RootContent => ({ type: "text", value: "\n\n" });

/**
 * flatten a JSX element's flow children into phrasing content
 *
 * only paragraphs are unwrapped - they are the node MDX creates for loose text
 * and hold nothing but inline content, so unwrapping them loses nothing
 *
 * every other flow node (list, heading, code, table, nested JSX element) is
 * left alone, since it can not be represented as phrasing content
 *
 * mdast types a flow element's children as flow content, so the result is cast
 * back - holding phrasing content is the whole point of the plugin, and it is
 * what MDX compiles to JSX children either way
 */
const toPhrasingContent = (
  children: readonly RootContent[],
): MdxJsxFlowElement["children"] => {
  const phrasing: RootContent[] = [];
  let previousWasParagraph = false;

  children.forEach((child) => {
    if (child.type !== "paragraph") {
      phrasing.push(child);
      previousWasParagraph = false;
      return;
    }

    // keep the blank line between two paragraphs that both got unwrapped
    if (previousWasParagraph) phrasing.push(paragraphBreak());

    phrasing.push(...child.children);
    previousWasParagraph = true;
  });

  return phrasing as MdxJsxFlowElement["children"];
};

/**
 * walk the tree depth first, unwrapping the children of every JSX element
 *
 * ignored elements are skipped along with everything inside them, so opting
 * out applies to the whole subtree
 */
const unwrapJsxChildren = (node: Nodes, ignore: ReadonlySet<string>): void => {
  if (!("children" in node) || !node.children.length) return;

  const isJsxElement = node.type === JSX_FLOW_ELEMENT;
  if (isJsxElement && node.name !== null && ignore.has(node.name)) return;

  // handle nested elements first, so their children are phrasing content by
  // the time this element is flattened
  const children: readonly RootContent[] = node.children;
  children.forEach((child) => unwrapJsxChildren(child, ignore));

  if (isJsxElement) node.children = toPhrasingContent(children);
};

export interface RemarkJsxTextChildrenOptions {
  /**
   * names of JSX elements (eg. `["Tabs"]`) whose children - and whose
   * descendants' children - keep markdown flow parsing
   *
   * @default []
   */
  ignore?: string[];
}

/**
 * @param {RemarkJsxTextChildrenOptions} [options] - (optional) plugin options
 * @param {string[]} [options.ignore] - (optional) names of JSX elements (eg.
 *   `["Tabs"]`) whose children - and whose descendants' children - keep
 *   markdown flow parsing @default []
 */
export default function remarkJsxTextChildren({
  ignore = [],
}: RemarkJsxTextChildrenOptions = {}): Transformer<Root> {
  const ignored = new Set(ignore);

  return (tree) => {
    unwrapJsxChildren(tree, ignored);
  };
}
