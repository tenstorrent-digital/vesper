import type { Replacement } from "../types";

export function filter(
  value: string,
  {
    replacementChars,
    replacement,
  }: {
    replacementChars: string;
    replacement: Replacement;
  },
): string {
  let __replacementChars = replacementChars;

  let filteredValue = "";

  for (const char of value) {
    const isReplacementKey = Object.prototype.hasOwnProperty.call(
      replacement,
      char,
    );
    const isValidChar =
      !isReplacementKey && replacement[__replacementChars[0]!]?.test(char);

    if (isValidChar) {
      __replacementChars = __replacementChars.slice(1);
      filteredValue += char;
    }
  }

  return filteredValue;
}
