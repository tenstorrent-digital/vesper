import {
  Config,
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
  TokenGroup,
} from "./get-token-variable-groups";

/** longest common prefix of class names, by their dash-separated parts */
const getCommonPrefix = (names: string[]) => {
  const [first = [], ...rest] = names.map((name) => name.split("-"));
  const length = first.findIndex((part, index) =>
    rest.some((parts) => parts[index] !== part),
  );

  return first.slice(0, length === -1 ? undefined : length).join("-");
};

type UtilityConfig = {
  [K in UtilityGroup]: {
    name: K;
    tokenGroup?: TokenGroup;
    conflicts: DefaultClassGroupIds[];
  };
}[UtilityGroup];

const UTILITY_CONFIGS = [
  {
    name: "dot-pattern",
    tokenGroup: "colors",
    conflicts: ["bg-image", "bg-color", "bg-repeat", "bg-position"],
  },
] satisfies UtilityConfig[];

const utilityGroups = getTailwindUtilityGroups();
const utilityClassGroups = UTILITY_CONFIGS.map((config) => {
  const utilityGroup = utilityGroups[config.name];

  const groupId = `vesper.${getCommonPrefix(utilityGroup)}`;

  const utilityMatchers = utilityGroup.map((utility) => {
    if (!utility.endsWith("-*")) return utility;
    return `{ "${utility.slice(0, -2)}": [${config.tokenGroup}.has] }`;
  });

  const group = `"${groupId}": ${JSON.stringify(utilityMatchers)}`;

  const conflicts = `"${groupId}": ${JSON.stringify(config.conflicts)}`;

  return { group, conflicts };
});

const variableGroups = getTokenVariableGroups();
const tokenLookupSets = Object.entries(variableGroups)
  .map(
    ([key, tokens]) =>
      `const ${key} = new Set(${JSON.stringify(
        tokens.map((token) => {
          if (key === "colors") return token.name;
          return token.parts.slice(1).join("-");
        }),
      )});`,
  )
  .join("\n");

type DefaultConfig = ConfigExtension<
  DefaultClassGroupIds,
  DefaultThemeGroupIds
>;

type ThemeKey = keyof NonNullable<
  NonNullable<DefaultConfig["extend"]>["theme"]
>;

const THEME_EXTENSION_CONFIG: [ThemeKey, TokenGroup][] = [
  ["color", "colors"],
  ["spacing", "spacing"],
  ["radius", "radius"],
  ["tracking", "tracking"],
  ["leading", "leading"],
  ["font", "fonts"],
  ["shadow", "shadows"],
];

const extendedTheme = [
  "{",
  ...THEME_EXTENSION_CONFIG.map(
    ([key, group]) => `"${key}": [{ vesper: [${group}.has] }],`,
  ),
  "},",
].join("");

const src = `
import {
  type Config,
  type DefaultClassGroupIds,
  type DefaultThemeGroupIds,
  mergeConfigs,
} from "tailwind-merge";

type AnyConfig = Config<string, string>;

type VesperClassGroupIds = "vesper.bg-vesper-dot-pattern";

${tokenLookupSets}

export const withVesper = (config: AnyConfig): AnyConfig =>
  mergeConfigs<
    DefaultClassGroupIds | VesperClassGroupIds,
    DefaultThemeGroupIds
  >(config, {
    extend: {
      theme: ${extendedTheme},
      classGroups: {
        // theme variable namespaces without a tailwind-merge theme scale
        "border-w": [{ "border-vesper": [strokes.has] }],
        "border-w-x": [{ "border-x-vesper": [strokes.has] }],
        "border-w-y": [{ "border-y-vesper": [strokes.has] }],
        "border-w-s": [{ "border-s-vesper": [strokes.has] }],
        "border-w-e": [{ "border-e-vesper": [strokes.has] }],
        "border-w-bs": [{ "border-bs-vesper": [strokes.has] }],
        "border-w-be": [{ "border-be-vesper": [strokes.has] }],
        "border-w-t": [{ "border-t-vesper": [strokes.has] }],
        "border-w-r": [{ "border-r-vesper": [strokes.has] }],
        "border-w-b": [{ "border-b-vesper": [strokes.has] }],
        "border-w-l": [{ "border-l-vesper": [strokes.has] }],
        "divide-x": [{ "divide-x-vesper": [strokes.has] }],
        "divide-y": [{ "divide-y-vesper": [strokes.has] }],
        "outline-w": [{ "outline-vesper": [strokes.has] }],
        "duration": [{ "duration-vesper": [animations.has] }],
        // custom utilities
        "vesper.bg-vesper-dot-pattern": [
          "bg-vesper-dot-pattern-primary",
          "bg-vesper-dot-pattern-secondary",
          "bg-vesper-dot-pattern-tertiary",
          { "bg-vesper-dot-pattern": [isVesperColor] },
          "bg-vesper-dot-pattern-inverse",
          { "bg-vesper-dot-pattern-inverse": [isVesperColor] },
        ],
      },
      // class groups which override the class groups (or parts of them) that
      // come before them
      conflictingClassGroups: {
        "vesper.bg-vesper-dot-pattern": [
          "bg-color",
          "bg-image",
          "bg-position",
          "bg-repeat",
        ],
      },
    },
  });
`;

console.log(src);
