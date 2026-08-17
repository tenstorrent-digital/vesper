import { MaskOptions, NormalizedOptions } from "../types";

import { normalizeReplacement } from "./normalizeReplacement";

export function normalizeOptions(options: MaskOptions): NormalizedOptions {
  return {
    mask: options.mask ?? "",
    replacement: normalizeReplacement(options.replacement ?? {}),
  };
}
