import type { DefaultClassGroupIds } from "tailwind-merge";

import fs from "node:fs/promises";

import { getGeneratedCodeWarning, resolvePackagePath } from "../utils";
import { TOKEN_VARIABLE_GROUPS, TAILWIND_UTILITY_GROUPS } from "./constants";
import {
  CUSTOM_UTILITY_CLASSGROUPS,
  EXTENDED_CLASSGROUP_PROPERTIES,
  THEME_TOKEN_GROUPS,
} from "./tailwind-merge-config";
import {
  ClassGroupTokenGroup,
  UtilityGroupName,
  TokenGroupName,
} from "./types";
import { getVesperUtilityGroupId } from "./utils";

const AUTO_GENERATED_WARNING = getGeneratedCodeWarning(
  "yarn generate:tailwind-merge",
);

const OUTPUT_FILE = "./src/utils/tailwind-merge.ts";

const createVesperClassGroupIds = () => {
  const ids = Object.keys(TAILWIND_UTILITY_GROUPS)
    .map((group) => `"${getVesperUtilityGroupId(group as UtilityGroupName)}"`)
    .join(" | ");

  return `type VesperClassGroupIds = ${ids}`;
};

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

const getTokenLookupFn = (group: TokenGroupName) => `TOKENS["${group}"].lookup`;

const createExtendedTheme = () => {
  const entries = THEME_TOKEN_GROUPS.map((group) => {
    const lookupFn = getTokenLookupFn(group);
    return `${group}: [{ vesper: [${lookupFn}] }]`;
  });

  return `{ ${entries.join(", ")} }`;
};

const createExtendedClassGroups = () => {
  const groups: {
    [K in DefaultClassGroupIds]?: [prefix: string, lookupFn: string][];
  } = {};

  for (const key in EXTENDED_CLASSGROUP_PROPERTIES) {
    const group = key as ClassGroupTokenGroup;
    const lookupFn = getTokenLookupFn(group);

    EXTENDED_CLASSGROUP_PROPERTIES[group].forEach(([id, mapping]) => {
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
