import fs from "node:fs/promises";

import type {
  ClassGroupTokenGroup,
  SampleClassGroupIds,
  TokenGroupName,
  UtilityGroupName,
} from "./types";

import { getGeneratedCodeWarning, resolvePackagePath } from "../utils";
import { TOKEN_VARIABLE_GROUPS, TAILWIND_UTILITY_GROUPS } from "./constants";
import {
  CLASS_GROUP_SAMPLES,
  CUSTOM_UTILITY_CLASSGROUPS,
  EXTENDED_CLASSGROUPS,
  THEME_TOKEN_GROUP_UTILITIES,
  THEME_TOKEN_GROUPS,
} from "./tailwind-merge-config";
import { getVesperUtilityGroupId } from "./utils";

const AUTO_GENERATED_WARNING = getGeneratedCodeWarning(
  "yarn generate:tailwind",
);

const OUTPUT_FILE = "./src/utils/tailwind-merge.test.ts";

/**
 * Emits a test for each token in a token group, asserting that the vesper
 * class (`{utility}-vesper-{token}`) conflicts with a default tailwind class
 * from the same `tailwind-merge` class group.
 */
const createTokenConflictTests = (
  tokenGroup: TokenGroupName,
  utility: string,
  classGroup: SampleClassGroupIds,
) => {
  const sample = CLASS_GROUP_SAMPLES[classGroup];
  const name = `${utility}-vesper-%s conflicts with ${sample}`;

  return `test.each(tokens["${tokenGroup}"])("${name}", (token) => {
    expectConflict("${sample}", \`${utility}-vesper-\${token}\`);
  });`;
};

/**
 * Creates an object with lists of token values for each token group.
 *
 * ```ts
 * const tokens = {
 *   color: ["background-primary", "background-secondary", ...]
 *   radius: ["half", "1", "2", ...]
 *   leading: [...],
 *   // etc.
 * }
 * ```
 */
const createTokenLists = () => {
  const entries = Object.entries(TOKEN_VARIABLE_GROUPS).map(
    ([group, tokens]) => {
      const values = tokens.map((token) => token.value);
      return `"${group}": ${JSON.stringify(values)}`;
    },
  );

  return `const tokens = { ${entries.join(", ")} }`;
};

/**
 * Emits a `describe` test block for each theme token group. The `describe`
 * block contains tests that assert every token in its group conflicts with
 * its corresponding utility classes.
 *
 * For example, given the token group `color`, the describe block would be
 * `describe("color", () => { ... })`, and the tests within the describe block
 * would assert that `bg-vesper-background-primary` conflicts with `bg-red-500`,
 * `text-vesper-text-primary` conflicts with `text-red-500`, etc.
 */
const createThemeTests = () =>
  THEME_TOKEN_GROUPS.map((tokenGroup) => {
    const tests = THEME_TOKEN_GROUP_UTILITIES[tokenGroup].map(
      ([utility, classGroup]) =>
        createTokenConflictTests(tokenGroup, utility, classGroup),
    );

    return `describe("${tokenGroup}", () => { ${tests.join("\n\n")} });`;
  }).join("\n\n");

/**
 * Emits a `describe` test block for each extended class group. The `describe`
 * block contains tests that assert every token in the extended group conflicts with
 * its corresponding utility classes.
 *
 * For example, given the class group `border-width`, the describe block would be
 * `describe("border-width", () => { ... })`, and the tests within the describe block
 * would assert that `vesper-border-strong` conflicts with `border-2`, etc.
 */
const createClassGroupTests = () =>
  Object.entries(EXTENDED_CLASSGROUPS)
    .map(([key, properties]) => {
      const tokenGroup = key as ClassGroupTokenGroup;

      const tests = properties.map(([classGroup, utility]) =>
        createTokenConflictTests(tokenGroup, utility, classGroup),
      );

      return `describe("${tokenGroup}", () => { ${tests.join("\n\n")} });`;
    })
    .join("\n\n");

/**
 * Emits a `describe` test block for each custom utility group. The `describe`
 * block contains tests that asserts two things:
 * 1. Each utility within its group conflicts with itself
 *    (ie. `bg-vesper-dot-pattern-*` conflicts with `bg-vesper-dot-pattern-primary`)
 * 2. Each utility within its group overrides the class groups it conflicts with
 *    (ie. `bg-vesper-dot-pattern-*` overrides `bg-color`, but not the other way around)
 */
const createCustomUtilityTests = () =>
  Object.entries(CUSTOM_UTILITY_CLASSGROUPS)
    .map(([key, metadata]) => {
      const group = key as UtilityGroupName;
      const id = getVesperUtilityGroupId(group);
      const { argument } = metadata;

      /** every class name that the utilities in this group can produce */
      const classNames = TAILWIND_UTILITY_GROUPS[group].map((utility) => {
        if (utility.acceptsArgument && argument) {
          return `...tokens["${argument}"].map((token) => \`${utility.name}-\${token}\`)`;
        }
        return `"${utility.name}"`;
      });

      /** a single class name for each utility in this group */
      const representatives = TAILWIND_UTILITY_GROUPS[group].map((utility) => {
        const token = argument && TOKEN_VARIABLE_GROUPS[argument][0]?.value;
        if (utility.acceptsArgument && token) {
          return `"${utility.name}-${token}"`;
        }
        return `"${utility.name}"`;
      });

      /** tests that assert conflicting class groups get overridden */
      const overrideTests = metadata.conflicts.map((classGroup) => {
        const sample = CLASS_GROUP_SAMPLES[classGroup];
        const name = `%s overrides ${sample} (${classGroup})`;

        return `test.each(classNames)("${name}", (className) => {
          expectOverride("${sample}", className);
        });`;
      });

      /** tests that assert the utility conflicts with itself */
      const conflictTest = `test.each(classNames)("%s conflicts with other ${id} utilities", (className) => {
        representatives
          .filter((representative) => representative !== className)
          .forEach((representative) => {
            expectConflict(representative, className);
          });
      });`;

      /** the full describe block with override and conflict tests */
      return `describe("${id}", () => {
        const classNames = [${classNames.join(", ")}];

        const representatives = [${representatives.join(", ")}];

        ${[...overrideTests, conflictTest].join("\n\n")}
      });`;
    })
    .join("\n\n");

/**
 * Generates `src/utils/tailwind-merge.test.ts`, which tests that `withVesper`
 * (generated by `generate-tailwind-merge.ts`) sorts vesper classes into the
 * correct `tailwind-merge` class groups.
 */
export async function generateTailwindMergeTest() {
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

  return await fs.writeFile(resolvePackagePath(OUTPUT_FILE), contents);
}
