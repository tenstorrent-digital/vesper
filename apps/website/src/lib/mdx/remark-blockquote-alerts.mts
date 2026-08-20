/**
 * remark plugin that adds support for github's alert syntax, ie. a blockquote
 * whose first line is an alert marker:
 *
 * ```md
 * > [!WARNING]
 * > This can not be undone.
 * ```
 *
 * github renders those as coloured callouts, and this plugin makes the site do
 * the same: the marker is stripped from the content and the alert type is
 * handed to the `blockquote` component in `src/mdx-components.tsx` (as
 * `data-alert`), which maps it to an `Admonition` variant
 *
 * the mapping to a variant deliberately lives with the component rather than
 * here, so this stays a markdown concern and the design system stays the only
 * place that knows about variants
 *
 * a blockquote without a marker is untouched, and so is a marker that is not
 * the very first line of the blockquote (github ignores those too)
 */

import type { Blockquote, Nodes, Root } from "mdast";
import type { Transformer } from "unified";

/** alert types github supports - anything else is left as a plain blockquote */
const ALERT_TYPES = ["note", "tip", "important", "warning", "caution"] as const;

/** an alert type github supports, eg. `"warning"` for `> [!WARNING]` */
type AlertType = (typeof ALERT_TYPES)[number];

const isAlertType = (value: string): value is AlertType =>
  (ALERT_TYPES as readonly string[]).includes(value);

/**
 * an alert marker: `[!TYPE]` alone on the first line of a blockquote
 *
 * the trailing newline is part of the match so it is stripped along with the
 * marker - markdown keeps a soft line break inside the paragraph's text, so
 * `> [!NOTE]\n> Text` is a single text node valued `"[!NOTE]\nText"`
 */
const ALERT_MARKER = /^\[!([a-z]+)\][^\S\n]*(?:\n|$)/i;

/**
 * pull the alert type off the start of a blockquote, mutating its content
 *
 * returns `undefined` (leaving the blockquote alone) unless the first thing
 * inside it is a paragraph starting with a marker for a known alert type
 */
const takeAlertType = (blockquote: Blockquote): AlertType | undefined => {
  const [paragraph] = blockquote.children;
  if (paragraph?.type !== "paragraph") return;

  const [text] = paragraph.children;
  if (text?.type !== "text") return;

  const match = text.value.match(ALERT_MARKER);
  if (!match) return;

  const type = match[1]?.toLowerCase();
  if (!type || !isAlertType(type)) return;

  text.value = text.value.slice(match[0].length);

  // drop what the marker leaves behind, so the callout starts at its content
  if (!text.value) paragraph.children.shift();
  if (!paragraph.children.length) blockquote.children.shift();

  return type;
};

/**
 * `hProperties` is how an mdast node passes attributes to the element it
 * becomes in html, so the type survives as a prop on the `blockquote`
 * component
 */
const setAlertType = (blockquote: Blockquote, type: AlertType): void => {
  blockquote.data ??= {};
  blockquote.data.hProperties = {
    ...blockquote.data.hProperties,
    "data-alert": type,
  };
};

/** walk the tree, converting every blockquote that opens with a marker */
const convertAlerts = (node: Nodes): void => {
  if (!("children" in node) || !node.children.length) return;

  node.children.forEach(convertAlerts);

  if (node.type !== "blockquote") return;

  const type = takeAlertType(node);
  if (type) setAlertType(node, type);
};

export default function remarkBlockquoteAlerts(): Transformer<Root> {
  return (tree) => {
    convertAlerts(tree);
  };
}
