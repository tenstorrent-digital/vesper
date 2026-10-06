import type { DefaultClassGroupIds } from "tailwind-merge";

import fs from "node:fs/promises";

import { getGeneratedCodeWarning, resolvePackagePath } from "../utils";
import { TOKEN_VARIABLE_GROUPS, TAILWIND_UTILITY_GROUPS } from "./constants";
import {
  CUSTOM_UTILITY_CLASSGROUPS,
  EXTENDED_CLASSGROUPS,
  THEME_TOKEN_GROUPS,
} from "./tailwind-merge-config";
import {
  ClassGroupTokenGroup,
  UtilityGroupName,
  TokenGroupName,
} from "./types";
import { getVesperUtilityGroupId } from "./utils";

const AUTO_GENERATED_WARNING = getGeneratedCodeWarning(
  "yarn generate:tailwind",
);

const OUTPUT_FILE = "./src/utils/tailwind-merge.ts";

/**
 * Emits a union type of the class group ids for each of our custom utility
 * groups, so `mergeConfigs` accepts them alongside `tailwind-merge`'s default
 * class group ids.
 *
 * ```ts
 * type VesperClassGroupIds = "vesper.bg-vesper-dot-pattern" | ...
 * ```
 */
const createVesperClassGroupIds = () => {
  const ids = Object.keys(TAILWIND_UTILITY_GROUPS)
    .map((group) => `"${getVesperUtilityGroupId(group as UtilityGroupName)}"`)
    .join(" | ");

  return `type VesperClassGroupIds = ${ids}`;
};

/**
 * Emits an object that maps each token group to a `Set` of its token values,
 * along with a `lookup` function that checks whether a value is in that set.
 *
 * `tailwind-merge` calls the `lookup` functions to validate the value of a
 * vesper class (eg. `stone-500` in `bg-vesper-stone-500`), so only classes
 * with valid tokens get sorted into vesper class groups.
 *
 * ```ts
 * const TOKENS = {
 *   color: {
 *     set: new Set(["static-black", "static-white", ...]),
 *     lookup: (value: string) => TOKENS["color"].set.has(value),
 *   },
 *   radius: { ... },
 *   // etc.
 * }
 * ```
 */
const createTokenLookupMap = () => {
  const variables = Object.entries(TOKEN_VARIABLE_GROUPS).map(
    ([group, tokens]) => {
      const values = tokens.map((token) => token.value);

      const set = `new Set(${JSON.stringify(values)})`;
      const lookup = `(value: string) => TOKENS["${group}"].set.has(value)`;
      const value = `{ set: ${set}, lookup: ${lookup} }`;

      return { group, value };
    },
  );

  const lookupMap = `const TOKENS = {${variables.map((v) => `"${v.group}": ${v.value}`).join(",")}}`;

  return [lookupMap].join("\n");
};

/**
 * Returns a reference to a token group's `lookup` function within the
 * `TOKENS` object emitted by `createTokenLookupMap`.
 *
 * ```ts
 * console.log(getTokenLookupFn("color"));
 * // 'TOKENS["color"].lookup'
 * ```
 */
const getTokenLookupFn = (group: TokenGroupName) => `TOKENS["${group}"].lookup`;

/**
 * Emits the `extend.theme` configuration object, which adds vesper tokens to
 * each `tailwind-merge` theme scale in `THEME_TOKEN_GROUPS`.
 *
 * ```ts
 * {
 *   color: [{ vesper: [TOKENS["color"].lookup] }],
 *   radius: [{ vesper: [TOKENS["radius"].lookup] }],
 *   // etc.
 * }
 * ```
 */
const createExtendedTheme = () => {
  const entries = THEME_TOKEN_GROUPS.map((group) => {
    const lookupFn = getTokenLookupFn(group);
    return `${group}: [{ vesper: [${lookupFn}] }]`;
  });

  return `{ ${entries.join(", ")} }`;
};

/**
 * Emits `extend.classGroups` entries for token groups that do not map to a
 * `tailwind-merge` theme scale (see `EXTENDED_CLASSGROUPS`).
 *
 * ```ts
 * "border-w": [{ "border-vesper": [TOKENS["border-width"].lookup] }],
 * "border-w-x": [{ "border-x-vesper": [TOKENS["border-width"].lookup] }],
 * // etc.
 * ```
 */
const createExtendedClassGroups = () => {
  const groups: {
    [K in DefaultClassGroupIds]?: [prefix: string, lookupFn: string][];
  } = {};

  for (const key in EXTENDED_CLASSGROUPS) {
    const group = key as ClassGroupTokenGroup;
    const lookupFn = getTokenLookupFn(group);

    EXTENDED_CLASSGROUPS[group].forEach(([id, mapping]) => {
      const prefix = `${mapping}-vesper`;
      groups[id] = (groups[id] ?? []).concat([[prefix, lookupFn]]);
    });
  }

  const result: string[] = [];
  for (const group in groups) {
    const id = group as DefaultClassGroupIds;
    groups[id]?.forEach(([prefix, lookupFn]) => {
      result.push(`"${id}": [{ "${prefix}": [${lookupFn}] }]`);
    });
  }
  return result.join(", ");
};

/**
 * Emits `extend.classGroups` entries for each of our custom utility groups
 * (see `CUSTOM_UTILITY_CLASSGROUPS`), keyed by the group's vesper utility
 * group id (see `getVesperUtilityGroupId`).
 *
 * Utilities that accept an argument only match tokens from the token group
 * set in the utility group's `argument`, while utilities that don't accept an
 * argument only match their exact class name.
 *
 * ```ts
 * "vesper.bg-vesper-dot-pattern": [
 *   "bg-vesper-dot-pattern-primary",
 *   "bg-vesper-dot-pattern-secondary",
 *   { "bg-vesper-dot-pattern": [TOKENS["color"].lookup] },
 *   // etc.
 * ]
 * ```
 */
const createCustomUtilityClassGroups = () => {
  const entries = Object.entries(CUSTOM_UTILITY_CLASSGROUPS).map(
    ([key, metadata]) => {
      const group = key as UtilityGroupName;

      const id = getVesperUtilityGroupId(group);

      const classGroups = TAILWIND_UTILITY_GROUPS[group]
        .map((utility) => {
          if (utility.acceptsArgument && metadata.argument) {
            return `{ "${utility.name}": [${getTokenLookupFn(metadata.argument)}] }`;
          }
          return `"${utility.name}"`;
        })
        .join(", ");

      return `"${id}": [${classGroups}]`;
    },
  );

  return entries.join(", ");
};

/**
 * Emits the `extend.conflictingClassGroups` configuration object, which maps
 * each custom utility group id to the default class groups it overrides (see
 * `CUSTOM_UTILITY_CLASSGROUPS`).
 *
 * ```ts
 * {
 *   "vesper.bg-vesper-dot-pattern": ["bg-color", "bg-image", "bg-position", "bg-repeat"],
 * }
 * ```
 */
const createConflictingClassGroups = () => {
  const entries = Object.entries(CUSTOM_UTILITY_CLASSGROUPS).map(
    ([key, metadata]) => {
      const group = key as UtilityGroupName;

      const id = getVesperUtilityGroupId(group);
      return `"${id}": ${JSON.stringify(metadata.conflicts)}`;
    },
  );

  return `{ ${entries.join(", ")} }`;
};

/**
 * Generates `src/utils/tailwind-merge.ts`, which exports `withVesper`, a
 * `tailwind-merge` config extension that sorts vesper's theme token classes
 * and custom utilities into the correct class groups.
 */
export async function generateTailwindMerge() {
  const src = `import {
  type Config,
  type DefaultClassGroupIds,
  type DefaultThemeGroupIds,
  mergeConfigs,
} from "tailwind-merge";

type AnyConfig = Config<string, string>;

${createTokenLookupMap()}

${createVesperClassGroupIds()}

export const withVesper = (config: AnyConfig): AnyConfig =>
  mergeConfigs<
    DefaultClassGroupIds | VesperClassGroupIds,
    DefaultThemeGroupIds
  >(config, {
    extend: {
      theme: ${createExtendedTheme()},
      classGroups: {
        // theme variable namespaces without a tailwind-merge theme scale
        ${createExtendedClassGroups()},
        // custom utilities
        ${createCustomUtilityClassGroups()},
      },
      // class groups which override the class groups
      // (or parts of them) that come before them
      conflictingClassGroups: ${createConflictingClassGroups()},
    },
  })
`;

  const contents = [AUTO_GENERATED_WARNING, src].join("\n\n");

  return await fs.writeFile(resolvePackagePath(OUTPUT_FILE), contents);
}
