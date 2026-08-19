import { MaskitoOptions } from "@maskito/core";

import type { TextMaskingConfig } from "@/components/masked-input/masked-input";

export function getMaskitoOptions(mask?: TextMaskingConfig): MaskitoOptions {
  if (!mask) {
    return { mask: /./ };
  }

  if (typeof mask === "string") {
    return { mask: mask.split("").map((c) => (c === "_" ? /./ : c)) };
  }

  if ("mask" in mask) {
    return mask;
  }

  if (typeof mask.replace === "string") {
    return {
      mask: mask.format.split("").map((c) => (c === mask.replace ? /./ : c)),
    };
  }

  if (mask.replace instanceof RegExp) {
    const replacement = mask.replace;
    return {
      mask: mask.format.split("").map((c) => (c === "_" ? replacement : c)),
    };
  }

  const replacements = mask.replace;
  return {
    mask: mask.format.split("").map((c) => replacements[c] ?? c),
  };
}
