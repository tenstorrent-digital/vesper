/**
 * configuration shared by the `tailwind-merge` utility generator
 * (`generate-tailwind-merge.ts`) and its test generator
 * (`generate-tailwind-merge-test.ts`)
 */

import type {
  ConfigExtension,
  DefaultClassGroupIds,
  DefaultThemeGroupIds,
} from "tailwind-merge";

import {
  getTailwindUtilityGroups,
  type UtilityGroup,
} from "./get-tailwind-utility-groups";
import {
  getTokenVariableGroups,
  type TokenGroup,
} from "./get-token-variable-groups";

type DefaultExtension = ConfigExtension<
  DefaultClassGroupIds,
  DefaultThemeGroupIds
>;

type DefaultTheme = NonNullable<
  NonNullable<DefaultExtension["extend"]>["theme"]
>;

type DefaultThemeProperty = keyof DefaultTheme;

export type ClassGroupTokenGroup = Exclude<TokenGroup, DefaultThemeProperty>;

export const EXTENDED_CLASSGROUP_PROPERTIES: Record<
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

export type ThemeTokenGroup = Exclude<TokenGroup, ClassGroupTokenGroup>;

export const THEME_TOKEN_GROUPS = [
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

export const CUSTOM_UTILITY_CLASSGROUPS: Record<
  UtilityGroup,
  { conflicts: DefaultClassGroupIds[]; argument: TokenGroup | null }
> = {
  "dot-pattern": {
    conflicts: ["bg-color", "bg-image", "bg-position", "bg-repeat"],
    argument: "color",
  },
};

export const VARIABLE_GROUPS = getTokenVariableGroups();

export const UTILITY_GROUPS = getTailwindUtilityGroups();

export const getVesperUtilityGroupId = (group: UtilityGroup) => {
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
