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
  TokenGroupName,
  UtilityGroupName,
} from "./types";

/**
 * A list of theme token group names that can be directly mapped to
 * `tailwind-merge`'s `extend.theme` configuration object.
 *
 * This list is exhaustive; if we are missing a token group name, we will
 * encounter a build-time error.
 *
 * @see AssertEveryThemeTokenGroupAccountedFor
 * */
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

/**
 * Property overrides for token groups that do not map to a property in
 * `tailwind-merge`'s `extend.theme` configuration object.
 *
 * Each class group in this mapping is represented by a list of tuples,
 * each comprised of:
 * 1. The class group id
 * 2. The corresponding class prefix
 *
 * For example, the `border-width` token group cannot map to a property in
 * `extend.theme`, so it must be configured here. `border-width` theme
 * variables map to `border-{variable}`, as well as `border-{t,r,b,l}-{variable}`,
 * all of which we have to provide class group id override mappings for.
 */
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

/**
 * Configuration for custom utilities to generate their class groups, as well
 * as their conflicting class groups. Each entry in this record should have two
 * properties:
 *
 * 1. `conflicts` – represents class group ids that are affected by the utility
 * 2. `argument` – if the utility accepts an argument, the generated `tailwind-merge`
 *    class group config will verify against the given token group name. Leave `null`
 *    if the utility does not accept any arguments.
 */
export const CUSTOM_UTILITY_CLASSGROUPS: Record<
  UtilityGroupName,
  { conflicts: DefaultClassGroupIds[]; argument: TokenGroupName | null }
> = {
  "dot-pattern": {
    conflicts: ["bg-color", "bg-image", "bg-position", "bg-repeat"],
    argument: "color",
  },
};
