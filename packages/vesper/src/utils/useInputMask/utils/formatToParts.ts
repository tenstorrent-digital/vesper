import type { MaskPart, NormalizedOptions } from "../types";

export function formatToParts(
  formattedValue: string,
  { mask, replacement }: NormalizedOptions,
): MaskPart[] {
  const result: MaskPart[] = [];

  for (let i = 0; i < mask.length; i++) {
    const value = (formattedValue[i] ?? mask[i])!;

    const isReplacementKey = Object.prototype.hasOwnProperty.call(
      replacement,
      value,
    );
    const type: MaskPart["type"] = isReplacementKey
      ? "replacement"
      : formattedValue[i] !== undefined && formattedValue[i] !== mask[i]
        ? "input"
        : "mask";

    result.push({ type, value, index: i });
  }

  return result;
}
