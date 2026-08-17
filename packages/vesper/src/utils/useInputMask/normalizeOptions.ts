import { normalizeReplacement } from "./normalizeReplacement";
import { MaskOptions, NormalizedOptions } from "./types";

export function normalizeOptions(options: MaskOptions): NormalizedOptions {
  return {
    mask: options.mask ?? "",
    replacement: normalizeReplacement(options.replacement ?? {}),
  };
}
