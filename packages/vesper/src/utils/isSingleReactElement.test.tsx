import type { ReactNode } from "react";
import { describe, expect, test } from "vitest";

import { isSingleReactElement } from "@/utils/isSingleReactElement";

function Component() {
  return <span>component</span>;
}

const NON_ELEMENT_NODES: [label: string, node: ReactNode][] = [
  ["null", null],
  ["undefined", undefined],
  ["true", true],
  ["false", false],
  ["a string", "text"],
  ["an empty string", ""],
  ["a number", 42],
  ["zero", 0],
];

describe("isSingleReactElement", () => {
  test("returns true for a single host element", () => {
    expect(isSingleReactElement(<span>text</span>)).toBe(true);
  });

  test("returns true for a single component element", () => {
    expect(isSingleReactElement(<Component />)).toBe(true);
  });

  test("returns false for a fragment", () => {
    expect(isSingleReactElement(<>text</>)).toBe(false);
  });

  test("returns false for an array of elements", () => {
    expect(isSingleReactElement([<span key="a" />, <span key="b" />])).toBe(
      false,
    );
  });

  test.each(NON_ELEMENT_NODES)("returns false for %s", (_, node) => {
    expect(isSingleReactElement(node)).toBe(false);
  });
});
