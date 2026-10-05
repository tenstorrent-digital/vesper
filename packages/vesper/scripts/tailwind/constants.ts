import { getTailwindUtilityGroups, getTokenVariableGroups } from "./utils";

export const TW_UTILITY_FILE_NAMES = ["dot-pattern"] as const;

export const VARIABLE_FILE_NAMES = [
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

export const TW_UTILITY_GROUPS = getTailwindUtilityGroups();

export const TOKEN_VARIABLE_GROUPS = getTokenVariableGroups();
