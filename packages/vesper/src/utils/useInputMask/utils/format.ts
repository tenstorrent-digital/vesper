import type { NormalizedOptions } from "../types";

export function format(
  input: string,
  { mask, replacement }: NormalizedOptions,
): string {
  let position = 0;
  let formattedValue = "";

  for (const char of mask) {
    if (input[position] === undefined) {
      break;
    }

    const isReplacementKey = Object.prototype.hasOwnProperty.call(
      replacement,
      char,
    );

    if (isReplacementKey) {
      formattedValue += input[position++];
    } else {
      formattedValue += char;
    }
  }

  return formattedValue;
}
