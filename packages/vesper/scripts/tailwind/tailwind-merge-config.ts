/**
 * configuration shared by the `tailwind-merge` utility generator
 * (`generate-tailwind-merge.ts`) and its test generator
 * (`generate-tailwind-merge-test.ts`)
 */

import type { DefaultClassGroupIds } from "tailwind-merge";

import type {
  AssertNever,
  ClassGroupTokenGroup,
  SampleClassGroupIds,
  ThemeTokenGroup,
  TokenGroupName,
  UtilityGroupName,
} from "./types";

/**
 * A list of theme token group names that can be directly mapped to
 * `tailwind-merge`'s `extend.theme` configuration object.
 *
 * This list is exhaustive; if we are missing a token group name, we will
 * encounter a type error.
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
export const EXTENDED_CLASSGROUPS = {
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
} as const satisfies Record<
  ClassGroupTokenGroup,
  [group: DefaultClassGroupIds, mapping: string][]
>;

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
export const CUSTOM_UTILITY_CLASSGROUPS = {
  "dot-pattern": {
    conflicts: ["bg-color", "bg-image", "bg-position", "bg-repeat"],
    argument: "color",
  },
} as const satisfies Record<
  UtilityGroupName,
  { conflicts: DefaultClassGroupIds[]; argument: TokenGroupName | null }
>;

/**
 * Utilities to test each theme token group against, as tuples of:
 * - the utility, ie. the class name without its `-vesper-{token}` suffix
 * - the `tailwind-merge` class group that the utility belongs to
 *
 * Vesper extends `tailwind-merge` theme scales, which are shared by many class
 * groups (eg. `color` is used by `bg-color`, `text-color`, `border-color`, etc.),
 * so we test a representative selection of the class groups for each token group
 */
export const THEME_TOKEN_GROUP_UTILITIES = {
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
} as const satisfies Record<
  ThemeTokenGroup,
  [utility: string, group: DefaultClassGroupIds][]
>;

/**
 * A class from tailwind's default theme for every `tailwind-merge` class group
 * that vesper extends (or conflicts with), used to assert that vesper classes
 * are sorted into the correct class group.
 *
 * These samples are exhaustive; if any class group id used in `EXTENDED_CLASSGROUPS`,
 * `CUSTOM_UTILITY_CLASSGROUPS`, or `THEME_TOKEN_GROUP_UTILITIES` is missing,
 * we will encounter a type error.
 */
export const CLASS_GROUP_SAMPLES = {
  "bg-color": "bg-red-500",
  "text-color": "text-red-500",
  "border-color": "border-red-500",
  "divide-color": "divide-red-500",
  "outline-color": "outline-red-500",
  "ring-color": "ring-red-500",
  fill: "fill-red-500",
  stroke: "stroke-red-500",
  "font-family": "font-sans",
  leading: "leading-6",
  rounded: "rounded-md",
  "rounded-t": "rounded-t-md",
  shadow: "shadow-lg",
  p: "p-2",
  m: "m-2",
  gap: "gap-2",
  w: "w-2",
  h: "h-2",
  inset: "inset-2",
  tracking: "tracking-wide",
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
  "outline-w": "outline-2",
  duration: "duration-150",
  "bg-image": "bg-none",
  "bg-position": "bg-top",
  "bg-repeat": "bg-no-repeat",
} as const satisfies { [K in SampleClassGroupIds]: string };
