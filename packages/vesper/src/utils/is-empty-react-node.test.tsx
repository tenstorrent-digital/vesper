import type { ReactNode } from "react";

import { describe, expect, test } from "vitest";

import { isEmptyReactNode } from "@/utils/is-empty-react-node";

const EMPTY_NODES: [label: string, node: ReactNode][] = [
  ["null", null],
  ["undefined", undefined],
  ["true", true],
  ["false", false],
  ["an empty string", ""],
  ["an empty array", []],
  ["an array of empty nodes", [null, undefined, true, false, ""]],
  ["nested arrays of empty nodes", [[], [null, [false, [""]]]]],
];

const NON_EMPTY_NODES: [label: string, node: ReactNode][] = [
  ["a string", "text"],
  ["a whitespace string", " "],
  ["a number", 42],
  ["zero", 0],
  ["a bigint", 0n],
  ["an element", <span key="element" />],
  ["an empty fragment", <></>],
  ["an array containing a string", [null, "text"]],
  ["an array containing zero", [false, 0]],
  ["a nested array containing an element", [[], [null, [<span key="a" />]]]],
  ["a non-array iterable", new Set<ReactNode>()],
];

function* generateText() {
  yield "text";
}

describe("isEmptyReactNode", () => {
  test.each(EMPTY_NODES)("returns true for %s", (_, node) => {
    expect(isEmptyReactNode(node)).toBe(true);
  });

  test.each(NON_EMPTY_NODES)("returns false for %s", (_, node) => {
    expect(isEmptyReactNode(node)).toBe(false);
  });

  test("returns false for a promise, without suspending", () => {
    expect(isEmptyReactNode(new Promise<string>(() => {}))).toBe(false);
  });

  test("does not consume one-shot iterators", () => {
    const iterator = generateText();

    expect(isEmptyReactNode(iterator)).toBe(false);
    expect([...iterator]).toEqual(["text"]);
  });
});
