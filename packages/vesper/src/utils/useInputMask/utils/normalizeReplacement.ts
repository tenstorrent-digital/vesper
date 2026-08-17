import type { Replacement } from "../types";

export function normalizeReplacement(
  replacement: string | Replacement,
): Replacement {
  if (typeof replacement === "string") {
    return replacement.length > 0 ? { [replacement]: /./ } : {};
  }
  return replacement;
}
