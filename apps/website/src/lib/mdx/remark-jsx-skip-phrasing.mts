/**
 * remark plugin that skips parsing of phrasing content for the children of
 * specified JSX elements
 *
 * MDX parses plain text inside of flow content as phrasing content, so text
 * written inside a component gets transformed:
 *
 * ```mdx
 * <Typography variant="copy-lg">
 *   **curl** https://api.example.com/data
 * </Typography>
 * ```
 *
 * compiles to:
 *
 * ```
 * <Typography>
 *   <strong>curl</strong>{" "}<a href="https://api.example.com/data">https://api.example.com/data</a>
 * </Typography>
 * ```
 *
 * This plugin opts out of parsing phrasing content for specified nodes
 */

import type { Nodes, Root } from "mdast";
import type { Transformer } from "unified";

export interface RemarkJsxSkipPhrasingOptions {
  /**
   * names of JSX elements (eg. `["Tabs"]`) whose children - and whose
   * descendants' children - opt out of phrasing content parsing
   *
   * @default []
   */
  include?: string[];
}

const getText = (node: Nodes): string | null => {
  switch (node.type) {
    case "text":
    case "inlineCode":
      return node.value;

    case "break":
      return "\n";

    case "link":
    case "linkReference":
    case "strong":
    case "emphasis":
    case "delete":
      return node.children.reduce<string | null>((text, child) => {
        if (text === null) return null;

        const value = getText(child);
        return value === null ? null : text + value;
      }, "");

    case "paragraph":
      return node.children.reduce<string | null>((text, child) => {
        if (text === null) return null;

        const value = getText(child);
        return value === null ? null : text + value;
      }, "");

    default:
      return null;
  }
};

const visit = (node: Nodes, options?: RemarkJsxSkipPhrasingOptions): void => {
  if (!("children" in node)) return;

  node.children.forEach((child) => visit(child, options));

  const include = options?.include ?? [];
  if (
    !include.some(
      (name) => node.type === "mdxJsxFlowElement" && node.name === name,
    )
  )
    return;

  const text = node.children.reduce<string | null>((acc, child) => {
    if (acc === null) return null;

    const value = getText(child);
    return value === null ? null : acc + value;
  }, "");

  if (text === null) return;
  node.children = [{ type: "text", value: text.trim() }];
};

export default function remarkSnippetPlainText(
  options: RemarkJsxSkipPhrasingOptions = {},
): Transformer<Root> {
  return (node) => visit(node, options);
}
