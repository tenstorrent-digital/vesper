import { MaskOptions } from "./types";

/** Compare whether two sets of options are functionally identical or not. @returns boolean */
export function compareOptions(a: MaskOptions, b: MaskOptions) {
  if (b === undefined && a === undefined) return true;
  if (b === undefined && a !== undefined) return false;
  if (a === undefined && b !== undefined) return false;
  if (a.mask !== b.mask) return false;

  if (a.replacement === undefined && b.replacement === undefined) {
    return true;
  }

  if (typeof a.replacement === "string" && typeof b.replacement === "string") {
    return a.replacement === b.replacement;
  }

  if (a.replacement instanceof RegExp && b.replacement instanceof RegExp) {
    return compareRegExps(a.replacement, b.replacement);
  }

  if (typeof a.replacement === "object" && typeof b.replacement === "object") {
    const keys = Array.from(
      new Set([...Object.keys(a.replacement), ...Object.keys(b.replacement)]),
    );

    return keys.every((key) => {
      const replacementA = a.replacement as Record<string, RegExp>;
      const replacementB = b.replacement as Record<string, RegExp>;

      const valueA = replacementA[key];
      const valueB = replacementB[key];
      if (!valueA || !valueB) return false;

      return compareRegExps(valueA, valueB);
    });
  }

  return false;
}

/** Compare whether RegExps are functionally identical or not. @returns boolean */
function compareRegExps(a: RegExp, b: RegExp) {
  return a.source === b.source && a.flags === b.flags;
}
