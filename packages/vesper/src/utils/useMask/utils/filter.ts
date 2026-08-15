import type { Replacement } from "../types";

interface Options {
  replacementChars: string;
  replacement: Replacement;
}

/**
 * Фильтрует символы для соответствия значениям `replacement`
 * @param value
 * @param options
 * @returns
 */
export default function filter(
  value: string,
  { replacementChars, replacement }: Options,
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
