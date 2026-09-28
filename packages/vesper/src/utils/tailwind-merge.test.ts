/// <reference types="vite/client" />

import { extendTailwindMerge } from "tailwind-merge";
import { describe, expect, test } from "vitest";

import { withVesper } from "@/utils/tailwind-merge";

import tailwindCss from "@/styles/tailwind.css?raw";
import tailwindUtilitiesCss from "@/styles/tailwind-utilities.css?raw";

const twMerge = extendTailwindMerge(withVesper);

type TestCaseComparison = [input: string, expected: string];

/**
 * theme variables in `tailwind.css`, grouped by namespace
 *
 * eg. `--color-vesper-stone-500` -> `{ color: ["stone-500"] }`
 */
const themeTokens = new Map<string, string[]>();

for (const [, namespace, token] of tailwindCss.matchAll(
  /^\s*--([a-z-]+?)-vesper-([a-z0-9-]+)\s*:/gm,
)) {
  themeTokens.set(namespace!, [...(themeTokens.get(namespace!) ?? []), token!]);
}

/**
 * custom utilities in `tailwind-utilities.css`, with functional utilities
 * (eg. `bg-vesper-dot-pattern-*`) expanded to every theme value they accept
 */
const utilities: string[] = [];

for (const [, name, isFunctional, body] of tailwindUtilitiesCss.matchAll(
  /@utility\s+([a-z0-9-]+?)(-\*)?\s*\{([^}]*)\}/g,
)) {
  if (!isFunctional) {
    utilities.push(name!);
    continue;
  }

  const namespace = body!.match(/--value\(--([a-z-]+?)-vesper-\*\)/)?.[1];
  const tokens = themeTokens.get(namespace!) ?? [];

  utilities.push(...tokens.map((token) => `${name}-${token}`));
}

/**
 * test cases for each theme variable namespace in `tailwind.css`
 *
 * when adding a new namespace to `tailwind.css`, add support for it in
 * `withVesper`, then add test cases for it here
 */
const THEME_CASES: Record<string, (token: string) => TestCaseComparison[]> = {
  color: (token) => [
    [`text-red-500 text-vesper-${token}`, `text-vesper-${token}`],
    [
      `bg-vesper-dot-pattern-primary bg-vesper-dot-pattern-${token}`,
      `bg-vesper-dot-pattern-${token}`,
    ],
    [
      `border-vesper-base border-vesper-${token}`,
      `border-vesper-base border-vesper-${token}`,
    ],
  ],
  spacing: (token) => [
    [`p-1 p-vesper-${token}`, `p-vesper-${token}`],
    [`p-vesper-${token} px-1`, `p-vesper-${token} px-1`],
    [`-mt-1 -mt-vesper-${token}`, `-mt-vesper-${token}`],
  ],
  "border-width": (token) => [
    [`border-2 border-vesper-${token}`, `border-vesper-${token}`],
    [`border-x-2 border-x-vesper-${token}`, `border-x-vesper-${token}`],
    [`divide-y-2 divide-y-vesper-${token}`, `divide-y-vesper-${token}`],
    [
      `border-vesper-${token} border-vesper-border-primary`,
      `border-vesper-${token} border-vesper-border-primary`,
    ],
  ],
  "outline-width": (token) => [
    [`outline-2 outline-vesper-${token}`, `outline-vesper-${token}`],
    [
      `outline-vesper-${token} outline-vesper-border-focus`,
      `outline-vesper-${token} outline-vesper-border-focus`,
    ],
  ],
  radius: (token) => [
    [`rounded-md rounded-vesper-${token}`, `rounded-vesper-${token}`],
    [`rounded-t-md rounded-t-vesper-${token}`, `rounded-t-vesper-${token}`],
  ],
  tracking: (token) => [
    [`tracking-wide tracking-vesper-${token}`, `tracking-vesper-${token}`],
  ],
  leading: (token) => [
    [`leading-5 leading-vesper-${token}`, `leading-vesper-${token}`],
  ],
  font: (token) => [
    [`font-mono font-vesper-${token}`, `font-vesper-${token}`],
    [`font-vesper-${token} font-bold`, `font-vesper-${token} font-bold`],
  ],
  shadow: (token) => [
    [`shadow-md shadow-vesper-${token}`, `shadow-vesper-${token}`],
    [
      `shadow-vesper-${token} shadow-vesper-stone-500`,
      `shadow-vesper-${token} shadow-vesper-stone-500`,
    ],
  ],
  "transition-duration": (token) => [
    [`duration-100 duration-vesper-${token}`, `duration-vesper-${token}`],
  ],
};

/**
 * test cases for each custom utility in `tailwind-utilities.css`, by prefix
 *
 * when adding a new utility to `tailwind-utilities.css`, add support for it in
 * `withVesper`, then add test cases for it here
 */
const UTILITY_CASES: Record<string, (utility: string) => TestCaseComparison[]> =
  {
    "bg-vesper-dot-pattern": (utility) => [
      // overrides any background image, repeat, position, and color before it
      [`bg-none bg-repeat-x bg-bottom bg-red-500 ${utility}`, utility],
      [`bg-vesper-dot-pattern-primary ${utility}`, utility],
      // can be refined by the background classes which come after it
      [`${utility} bg-red-500`, `${utility} bg-red-500`],
      [`${utility} bg-no-repeat`, `${utility} bg-no-repeat`],
      [`${utility} bg-center`, `${utility} bg-center`],
      [`${utility} bg-none`, `${utility} bg-none`],
    ],
  };

describe("withVesper", () => {
  test("finds theme variables and utilities to test", () => {
    expect(themeTokens.size).toBeGreaterThan(0);
    expect(utilities.length).toBeGreaterThan(0);
  });

  describe.each([...themeTokens])("--%s-vesper-*", (namespace, tokens) => {
    test("has test cases", () => {
      expect(THEME_CASES).toHaveProperty([namespace]);
    });

    test.each(tokens)("%s", (token) => {
      for (const [input, expected] of THEME_CASES[namespace]?.(token) ?? []) {
        expect(twMerge(input), input).toBe(expected);
      }
    });
  });

  describe("tailwind-utilities.css", () => {
    test.each(utilities)("%s", (utility) => {
      const prefix = Object.keys(UTILITY_CASES).find((key) =>
        utility.startsWith(`${key}-`),
      );

      expect(prefix, `no test cases for "${utility}"`).toBeDefined();

      for (const [input, expected] of UTILITY_CASES[prefix!]!(utility)) {
        expect(twMerge(input), input).toBe(expected);
      }
    });
  });

  test("does not change the merging of default tailwind classes", () => {
    expect(twMerge("p-2 p-4 bg-red-500 bg-blue-500")).toBe("p-4 bg-blue-500");
    expect(twMerge("border-2 border-red-500")).toBe("border-2 border-red-500");
    expect(twMerge("shadow-md shadow-red-500")).toBe(
      "shadow-md shadow-red-500",
    );
  });

  test("can be combined with other config extensions", () => {
    const customTwMerge = extendTailwindMerge(
      { extend: { theme: { spacing: ["gutter"] } } },
      withVesper,
    );

    expect(customTwMerge("p-gutter p-vesper-4")).toBe("p-vesper-4");
    expect(customTwMerge("p-vesper-4 p-gutter")).toBe("p-gutter");
  });
});
