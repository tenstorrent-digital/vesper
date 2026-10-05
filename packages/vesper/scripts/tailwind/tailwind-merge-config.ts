/**
 * configuration shared by the `tailwind-merge` utility generator
 * (`generate-tailwind-merge.ts`) and its test generator
 * (`generate-tailwind-merge-test.ts`)
 */

import type { DefaultClassGroupIds } from "tailwind-merge";

import type {
  AssertNever,
  ClassGroupTokenGroup,
  ThemeTokenGroup,
  UtilityGroupName,
  VariableGroupName,
} from "./types";

export const THEME_TOKEN_GROUPS = [
  "color",
  "font",
  "leading",
  "radius",
  "shadow",
  "spacing",
  "tracking",
] as const satisfies ThemeTokenGroup[];

export type AssertEveryThemeTokenGroupAccountedFor = AssertNever<
  Exclude<ThemeTokenGroup, (typeof THEME_TOKEN_GROUPS)[number]>
>;

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

export const CUSTOM_UTILITY_CLASSGROUPS: Record<
  UtilityGroupName,
  { conflicts: DefaultClassGroupIds[]; argument: VariableGroupName | null }
> = {
  "dot-pattern": {
    conflicts: ["bg-color", "bg-image", "bg-position", "bg-repeat"],
    argument: "color",
  },
};
