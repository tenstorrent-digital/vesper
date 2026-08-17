import type { Replacement } from "./types";

export function normalizeReplacement(
  replacement: string | RegExp | Replacement,
): Replacement {
  if (typeof replacement === "string") {
    return replacement.length > 0 ? { [replacement]: /./ } : {};
  }
  if (replacement instanceof RegExp) {
    return { _: replacement };
  }
  return replacement;
}
