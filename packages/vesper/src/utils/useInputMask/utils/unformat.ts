import type { NormalizedOptions } from "../types";

export function unformat(
  formattedValue: string,
  {
    start = 0,
    end,
    options: { mask, replacement },
  }: {
    start?: number;
    end?: number;
    options: NormalizedOptions;
  },
): string {
  const slicedFormattedValue = formattedValue.slice(start, end);
  const slicedMask = mask.slice(start, end);

  let unformattedValue = "";

  for (let i = 0; i < slicedMask.length; i++) {
    const isReplacementKey = Object.prototype.hasOwnProperty.call(
      replacement,
      slicedMask[i]!,
    );

    if (
      isReplacementKey &&
      slicedFormattedValue[i] !== undefined &&
      slicedFormattedValue[i] !== slicedMask[i]
    ) {
      unformattedValue += slicedFormattedValue[i];
    }
  }

  return unformattedValue;
}
