import { MaskitoOptions } from "@maskito/core";

import type { TextMaskingConfig } from "@/components/masked-input/masked-input";

export function getMaskitoOptions(mask?: TextMaskingConfig): MaskitoOptions {
  if (!mask) {
    return { mask: /./ };
  }

  if (typeof mask === "string") {
    return { mask: Array.from(mask, (c) => (c === "_" ? /./ : c)) };
  }

  if ("mask" in mask) {
    return mask;
  }

  if (typeof mask.replace === "string") {
    return {
      mask: Array.from(mask.format, (c) => (c === mask.replace ? /./ : c)),
    };
  }

  if (mask.replace instanceof RegExp) {
    const replacement = mask.replace;
    return {
      mask: Array.from(mask.format, (c) => (c === "_" ? replacement : c)),
    };
  }

  const replacements = mask.replace;
  return {
    mask: Array.from(mask.format, (c) => replacements[c] ?? c),
  };
}
