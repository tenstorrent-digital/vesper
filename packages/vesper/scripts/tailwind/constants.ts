import { getTailwindUtilityGroups, getTokenVariableGroups } from "./utils";

/**
 * A list of file names in `src/styles/tailwind-utilities` without their `.css`
 * extensions.
 *
 * When we create a new tailwind utility file, we should update this constant
 * to include its filename so it gets picked up by `generate-tailwind-merge.css`
 * and `generate-tailwind-merge-test.ts`.
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
 */
export const TAILWIND_UTILITY_GROUPS = getTailwindUtilityGroups();

/**
 * Our css variables, bucketed into groups of tokens.
 * Each entry corresponds to a `TokenGroupName` and contains an array of
 * `TokenData` pertaining to the variables within the group.
 */
export const TOKEN_VARIABLE_GROUPS = getTokenVariableGroups();
