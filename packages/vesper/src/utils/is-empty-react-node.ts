import type { ReactNode } from "react";

/**
 * Whether a React node is empty: `null`, `undefined`, a boolean, an empty
 * string, or an array containing only empty nodes (at any depth)
 *
 * Numbers (including `0`) count as content. Elements, fragments, promises, and
 * non-array iterables also count as content, since checking what they render
 * would mean rendering or consuming them
 *
 * Unlike `Children.toArray`, this leaves one-shot iterators untouched, and
 * doesn't throw (suspend) when given a promise
 *
 * @example
 * isEmptyReactNode([null, false, ""]) // true
 * isEmptyReactNode(0) // false
 * isEmptyReactNode(<span />) // false
 */
export function isEmptyReactNode(node: ReactNode): boolean {
  if (Array.isArray(node)) return node.every(isEmptyReactNode);
  return node == null || typeof node === "boolean" || node === "";
}
