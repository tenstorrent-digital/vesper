import type { DefaultClassGroupIds } from "tailwind-merge";

import fs from "node:fs";
import path from "node:path";

import type {
  ClassGroupTokenGroup,
  ThemeTokenGroup,
  UtilityGroupName,
  TokenGroupName,
} from "./types";

import { getGeneratedCodeWarning, resolvePackagePath } from "../utils";
import { TOKEN_VARIABLE_GROUPS, TAILWIND_UTILITY_GROUPS } from "./constants";
import {
  CUSTOM_UTILITY_CLASSGROUPS,
  EXTENDED_CLASSGROUP_PROPERTIES,
  THEME_TOKEN_GROUPS,
} from "./tailwind-merge-config";
import { getVesperUtilityGroupId } from "./utils";

const AUTO_GENERATED_WARNING = getGeneratedCodeWarning(
  "yarn generate:tailwind-merge",
);

const OUTPUT_FILE = "./src/utils/tailwind-merge.test.ts";

/**
 * utilities to test each theme token group against, as tuples of:
 * - the utility, ie. the class name without its `-vesper-{token}` suffix
 * - the tailwind-merge class group that the utility belongs to
 *
 * vesper extends tailwind-merge theme scales, which are shared by many class
 * groups (eg. `color` is used by `bg-color`, `text-color`, `border-color`, etc.),
 * so we test a representative selection of the class groups for each scale
 */
const THEME_TOKEN_GROUP_UTILITIES: Record<
  ThemeTokenGroup,
  [utility: string, group: DefaultClassGroupIds][]
> = {
  color: [
    ["bg", "bg-color"],
    ["text", "text-color"],
    ["border", "border-color"],
    ["divide", "divide-color"],
    ["outline", "outline-color"],
    ["ring", "ring-color"],
    ["fill", "fill"],
    ["stroke", "stroke"],
  ],
  font: [["font", "font-family"]],
  leading: [["leading", "leading"]],
  radius: [
    ["rounded", "rounded"],
    ["rounded-t", "rounded-t"],
  ],
  shadow: [["shadow", "shadow"]],
  spacing: [
    ["p", "p"],
    ["m", "m"],
    ["gap", "gap"],
    ["w", "w"],
    ["h", "h"],
    ["inset", "inset"],
  ],
  tracking: [["tracking", "tracking"]],
};

/**
 * a class from tailwind's default theme for every tailwind-merge class group
 * that vesper extends (or conflicts with), used to assert that vesper classes
 * are sorted into the correct class group
 */
const CLASS_GROUP_SAMPLES: { [K in DefaultClassGroupIds]?: string } = {
  // theme: color
  "bg-color": "bg-red-500",
  "text-color": "text-red-500",
  "border-color": "border-red-500",
  "divide-color": "divide-red-500",
  "outline-color": "outline-red-500",
  "ring-color": "ring-red-500",
  fill: "fill-red-500",
  stroke: "stroke-red-500",
  // theme: font
  "font-family": "font-sans",
  // theme: leading
  leading: "leading-6",
  // theme: radius
  rounded: "rounded-md",
  "rounded-t": "rounded-t-md",
  // theme: shadow
  shadow: "shadow-lg",
  // theme: spacing
  p: "p-2",
  m: "m-2",
  gap: "gap-2",
  w: "w-2",
  h: "h-2",
  inset: "inset-2",
  // theme: tracking
  tracking: "tracking-wide",
  // class groups: border-width
  "border-w": "border-2",
  "border-w-x": "border-x-2",
  "border-w-y": "border-y-2",
  "border-w-s": "border-s-2",
  "border-w-e": "border-e-2",
  "border-w-bs": "border-bs-2",
  "border-w-be": "border-be-2",
  "border-w-t": "border-t-2",
  "border-w-r": "border-r-2",
  "border-w-b": "border-b-2",
  "border-w-l": "border-l-2",
  "divide-x": "divide-x-2",
  "divide-y": "divide-y-2",
  // class groups: outline-width
  "outline-w": "outline-2",
  // class groups: transition-duration
  duration: "duration-150",
  // custom utility conflicts
  "bg-image": "bg-none",
  "bg-position": "bg-top",
  "bg-repeat": "bg-no-repeat",
};

const q = (value: string) => JSON.stringify(value);

const getClassGroupSample = (group: DefaultClassGroupIds) => {
  const sample = CLASS_GROUP_SAMPLES[group];
  if (!sample) {
    throw new Error(
      `missing sample class for tailwind-merge class group "${group}", please add one to CLASS_GROUP_SAMPLES in ${path.basename(import.meta.filename)}`,
    );
  }
  return sample;
};

/**
 * emits a test for each token in a token group, asserting that the vesper
 * class (`{utility}-vesper-{token}`) conflicts with a default tailwind class
 * from the same tailwind-merge class group
 */
const createTokenConflictTests = (
  tokenGroup: TokenGroupName,
  utility: string,
  classGroup: DefaultClassGroupIds,
) => {
  const sample = getClassGroupSample(classGroup);
  const name = `${utility}-vesper-%s conflicts with ${sample} (${classGroup})`;

  return `test.each(tokens[${q(tokenGroup)}])(${q(name)}, (token) => {
    expectConflict(${q(sample)}, \`${utility}-vesper-\${token}\`);
  });`;
};

const createTokenLists = () => {
  const entries = Object.entries(TOKEN_VARIABLE_GROUPS).map(
    ([group, tokens]) => {
      const values = tokens.map((token) => token.value);
      return `${q(group)}: ${JSON.stringify(values)}`;
    },
  );

  return `const tokens = { ${entries.join(", ")} }`;
};

const createThemeTests = () =>
  THEME_TOKEN_GROUPS.map((group) => {
    const tests = THEME_TOKEN_GROUP_UTILITIES[group].map(
      ([utility, classGroup]) =>
        createTokenConflictTests(group, utility, classGroup),
    );

    return `describe(${q(group)}, () => { ${tests.join("\n\n")} });`;
  }).join("\n\n");

const createClassGroupTests = () =>
  Object.entries(EXTENDED_CLASSGROUP_PROPERTIES)
    .map(([key, properties]) => {
      const group = key as ClassGroupTokenGroup;

      const tests = properties.map(([classGroup, mapping]) =>
        createTokenConflictTests(group, mapping, classGroup),
      );

      return `describe(${q(group)}, () => { ${tests.join("\n\n")} });`;
    })
    .join("\n\n");

const createCustomUtilityTests = () =>
  Object.entries(CUSTOM_UTILITY_CLASSGROUPS)
    .map(([key, metadata]) => {
      const group = key as UtilityGroupName;
      const id = getVesperUtilityGroupId(group);
      const { argument } = metadata;

      /** every class name that the utilities in this group can produce */
      const classNames = TAILWIND_UTILITY_GROUPS[group].map((utility) => {
        if (utility.acceptsArgument && argument) {
          return `...tokens[${q(argument)}].map((token) => \`${utility.name}-\${token}\`)`;
        }
        return q(utility.name);
      });

      /** a single class name for each utility in this group */
      const representatives = TAILWIND_UTILITY_GROUPS[group].map((utility) => {
        const token = argument && TOKEN_VARIABLE_GROUPS[argument][0]?.value;
        if (utility.acceptsArgument && token) {
          return q(`${utility.name}-${token}`);
        }
        return q(utility.name);
      });

      const overrideTests = metadata.conflicts.map((classGroup) => {
        const sample = getClassGroupSample(classGroup);
        const name = `%s overrides ${sample} (${classGroup})`;

        return `test.each(classNames)(${q(name)}, (className) => {
          expectOverride(${q(sample)}, className);
        });`;
      });

      const conflictTest = `test.each(classNames)(${q(`%s conflicts with other ${id} utilities`)}, (className) => {
        representatives
          .filter((representative) => representative !== className)
          .forEach((representative) => {
            expectConflict(representative, className);
          });
      });`;

      return `describe(${q(id)}, () => {
        const classNames = [${classNames.join(", ")}];

        const representatives = [${representatives.join(", ")}];

        ${[...overrideTests, conflictTest].join("\n\n")}
      });`;
    })
    .join("\n\n");

const src = `import { extendTailwindMerge } from "tailwind-merge";
import { describe, expect, test } from "vitest";

import { withVesper } from "@/utils/tailwind-merge";

const twMerge = extendTailwindMerge(withVesper);

${createTokenLists()}

/**
 * asserts that \`a\` and \`b\` are in the same class group,
 * ie. whichever class comes last wins
 */
const expectConflict = (a: string, b: string) => {
  expect(twMerge(\`\${a} \${b}\`), \`\${a} \${b}\`).toBe(b);
  expect(twMerge(\`\${b} \${a}\`), \`\${b} \${a}\`).toBe(a);
};

/**
 * asserts that \`b\` overrides \`a\` when it comes after it,
 * but that \`a\` does not override \`b\` when it comes after it
 */
const expectOverride = (a: string, b: string) => {
  expect(twMerge(\`\${a} \${b}\`), \`\${a} \${b}\`).toBe(b);
  expect(twMerge(\`\${b} \${a}\`), \`\${b} \${a}\`).toBe(\`\${b} \${a}\`);
};

describe("withVesper", () => {
  // theme scales extended with vesper tokens
  describe("theme", () => {
    ${createThemeTests()}
  });

  // theme variable namespaces without a tailwind-merge theme scale
  describe("class groups", () => {
    ${createClassGroupTests()}
  });

  // custom utilities
  describe("custom utilities", () => {
    ${createCustomUtilityTests()}
  });
});
`;

const contents = [AUTO_GENERATED_WARNING, src].join("\n\n");

fs.writeFileSync(resolvePackagePath(OUTPUT_FILE), contents);
