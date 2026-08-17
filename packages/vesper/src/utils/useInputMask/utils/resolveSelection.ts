import type { InputType, NormalizedOptions } from "../types";

import { formatToParts } from "./formatToParts";

interface ResolveSelectionParam {
  inputType: InputType;
  value: string;
  addedValue: string;
  beforeChangeValue: string;
  options: NormalizedOptions;
}

export function resolveSelection({
  inputType,
  value,
  addedValue,
  beforeChangeValue,
  options,
}: ResolveSelectionParam): number {
  const parts = formatToParts(value, options);
  const unformattedChars = parts.filter(({ type }) => type === "input");

  const lastAddedValueIndex =
    unformattedChars[beforeChangeValue.length + addedValue.length - 1]?.index;
  const lastBeforeChangeValueIndex =
    unformattedChars[beforeChangeValue.length - 1]?.index;
  const firstAfterChangeValueIndex =
    unformattedChars[beforeChangeValue.length + addedValue.length]?.index;

  if (inputType === "insert") {
    if (lastAddedValueIndex !== undefined) return lastAddedValueIndex + 1;
    if (firstAfterChangeValueIndex !== undefined)
      return firstAfterChangeValueIndex;
    if (lastBeforeChangeValueIndex !== undefined)
      return lastBeforeChangeValueIndex + 1;
  }

  if (inputType === "deleteForward") {
    if (firstAfterChangeValueIndex !== undefined)
      return firstAfterChangeValueIndex;
    if (lastBeforeChangeValueIndex !== undefined)
      return lastBeforeChangeValueIndex + 1;
  }

  if (inputType === "deleteBackward") {
    if (lastBeforeChangeValueIndex !== undefined)
      return lastBeforeChangeValueIndex + 1;
    if (firstAfterChangeValueIndex !== undefined)
      return firstAfterChangeValueIndex;
  }

  const replacementCharIndex = value
    .split("")
    .findIndex((char) =>
      Object.prototype.hasOwnProperty.call(options.replacement, char),
    );

  return replacementCharIndex !== -1 ? replacementCharIndex : value.length;
}
