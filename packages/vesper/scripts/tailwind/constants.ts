import { getTailwindUtilityGroups, getTokenVariableGroups } from "./utils";

/**
 * A list of file names in `src/styles/tailwind-utilities` without their `.css`
 * extensions.
 *
 * When we create a new tailwind utility file, we should update this constant
 * to include its filename so it gets picked up by `generate-tailwind-css.ts`,
 * `generate-tailwind-merge.ts`, and `generate-tailwind-merge-test.ts`.
 */
export const TAILWIND_UTILITY_FILE_NAMES = ["dot-pattern"] as const;

/**
 * A list of CSS token file names in `src/styles/` without their `.css`
 * extensions.
 *
 * If we add any new token files, we should update this constant to include
 * the new filesnames so it gets picked up by `generate-tailwind.css`
 */
export const TOKEN_FILE_NAMES = [
  "color",
  "font",
  "leading",
  "radius",
  "shadow",
  "spacing",
  "tracking",
  "transition-duration",
  "border-width",
  "outline-width",
] as const;

/**
 * Our custom tailwind utilities, bucketed into groups of metadata.
 * Each entry corresponds to a `UtilityGroupName` and contains an array
 * of `UtilityData` pertaining to the utilities within the group.
 *
 * ```ts
 * {
 *   "dot-pattern": [
 *     { name: "bg-vesper-dot-pattern", acceptsArgument: true },
 *     { name: "bg-vesper-dot-pattern-primary", acceptsArgument: false },
 *     { name: "bg-vesper-dot-pattern-secondary", acceptsArgument: false },
 *     // ...etc
 *   ],
 * }
 * ```
 */
export const TAILWIND_UTILITY_GROUPS = getTailwindUtilityGroups();

/**
 * Our css variables, bucketed into groups of tokens.
 * Each entry corresponds to a `TokenGroupName` and contains an array of
 * `TokenData` pertaining to the variables within the group.
 *
 * ```ts
 * {
 *   color: [
 *     {
 *       name: "--vesper-color-background-primary",
 *       group: "color",
 *       value: "background-primary",
 *     },
 *     {
 *       name: "--vesper-color-background-secondary",
 *       group: "color",
 *       value: "background-secondary",
 *     },
 *   ],
 *   radius: [...],
 *   spacing: [...],
 *   // etc.
 * }
 * ```
 */
export const TOKEN_VARIABLE_GROUPS = getTokenVariableGroups();
