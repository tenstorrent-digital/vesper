import fs from "node:fs";
import path from "node:path";
import type {
  ConfigExtension,
  DefaultClassGroupIds,
  DefaultThemeGroupIds,
} from "tailwind-merge";

import {
  getTailwindUtilityGroups,
  UtilityGroup,
} from "./get-tailwind-utility-groups";
import {
  getTokenVariableGroups,
  type TokenGroup,
} from "./get-token-variable-groups";
import { getGeneratedCodeWarning } from "./utils";

const AUTO_GENERATED_WARNING = getGeneratedCodeWarning(
  "yarn generate:tailwind-merge",
);

const OUTPUT_FILE = "src/utils/tailwind-merge.ts";

type DefaultExtension = ConfigExtension<
  DefaultClassGroupIds,
  DefaultThemeGroupIds
>;

type DefaultTheme = NonNullable<
  NonNullable<DefaultExtension["extend"]>["theme"]
>;

type DefaultThemeProperty = keyof DefaultTheme;

type ClassGroupTokenGroup = Exclude<TokenGroup, DefaultThemeProperty>;

const EXTENDED_CLASSGROUP_PROPERTIES: Record<
  ClassGroupTokenGroup,
  [group: DefaultClassGroupIds, mapping: string][]
> = {
  "border-width": [
    ["border-w", "border"],
    ["border-w-x", "border-x"],
    ["border-w-y", "border-y"],
    ["border-w-s", "border-s"],
    ["border-w-e", "border-e"],
    ["border-w-bs", "border-bs"],
    ["border-w-be", "border-be"],
    ["border-w-t", "border-t"],
    ["border-w-r", "border-r"],
    ["border-w-b", "border-b"],
    ["border-w-l", "border-l"],
    ["divide-x", "divide-x"],
    ["divide-y", "divide-y"],
  ],
  "outline-width": [["outline-w", "outline"]],
  "transition-duration": [["duration", "duration"]],
};

type ThemeTokenGroup = Exclude<TokenGroup, ClassGroupTokenGroup>;

const THEME_TOKEN_GROUPS = [
  "color",
  "font",
  "leading",
  "radius",
  "shadow",
  "spacing",
  "tracking",
] as const satisfies ThemeTokenGroup[];

type AssertNever<T extends never> = T;

export type AssertEveryThemeTokenGroupAccountedFor = AssertNever<
  Exclude<ThemeTokenGroup, (typeof THEME_TOKEN_GROUPS)[number]>
>;

const CUSTOM_UTILITY_CLASSGROUPS: Record<
  UtilityGroup,
  { conflicts: DefaultClassGroupIds[]; argument: TokenGroup | null }
> = {
  "dot-pattern": {
    conflicts: ["bg-color", "bg-image", "bg-position", "bg-repeat"],
    argument: "color",
  },
};

const VARIABLE_GROUPS = getTokenVariableGroups();

const UTILITY_GROUPS = getTailwindUtilityGroups();

const getVesperUtilityGroupId = (group: UtilityGroup) => {
  const names = UTILITY_GROUPS[group].map((u) => u.name);

  const [first = [], ...rest] = names.map((name) => name.split("-"));
  const length = first.findIndex((part, index) =>
    rest.some((parts) => parts[index] !== part),
  );

  /** longest common prefix of class names, by their dash-separated parts */
  const commonPrefix = first
    .slice(0, length === -1 ? undefined : length)
    .join("-");

  return `vesper.${commonPrefix}`;
};
const createVesperClassGroupIds = () => {
  const ids = Object.keys(UTILITY_GROUPS)
    .map((group) => `"${getVesperUtilityGroupId(group as UtilityGroup)}"`)
    .join(" | ");

  return `type VesperClassGroupIds = ${ids}`;
};

const createTokenLookupMap = () => {
  const entries = Object.entries(VARIABLE_GROUPS).map(([group, tokens]) => {
    const values = tokens.map((token) => token.value);
    const lookup = `new Set(${JSON.stringify(values)})`;

    return `"${group}": ${lookup}`;
  });

  return `const lookup = { ${entries.join(", ")} }`;
};

const getTokenLookupFn = (group: TokenGroup) =>
  `lookup["${group}"].has` as const;

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
      const group = key as UtilityGroup;

      const id = getVesperUtilityGroupId(group);

      const classGroups = UTILITY_GROUPS[group]
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
      const group = key as UtilityGroup;

      const id = getVesperUtilityGroupId(group);

      return `"${id}": ${JSON.stringify(metadata.conflicts)}`;
    },
  );

  return `{ ${entries.join(", ")} }`;
};

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

fs.writeFileSync(
  path.resolve(import.meta.dirname, "..", OUTPUT_FILE),
  contents,
);
