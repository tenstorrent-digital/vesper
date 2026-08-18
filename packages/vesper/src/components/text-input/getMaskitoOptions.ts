import { MaskitoOptions } from "@maskito/core";

export function getMaskitoOptions(
  mask:
    | undefined
    | MaskitoOptions
    | string
    | {
        format: string;
        replace: RegExp | string | { [key: string]: RegExp };
      },
  multiline?: boolean,
): MaskitoOptions {
  if (!mask || multiline) {
    return { mask: /./ };
  }
  if (typeof mask === "string") {
    return { mask: stringToMaskitoMask(mask) };
  }
  if ("mask" in mask) {
    return mask;
  }
  return { mask: stringToMaskitoMask(mask) };
}

function stringToMaskitoMask(
  options:
    | string
    | { format: string; replace: RegExp | string | { [key: string]: RegExp } },
): (string | RegExp)[] {
  if (typeof options === "string") {
    return options.split("").map((c) => (c === "_" ? /./ : c));
  }

  if (typeof options.replace === "string") {
    return options.format
      .split("")
      .map((c) => (c === options.replace ? /./ : c));
  }

  if (options.replace instanceof RegExp) {
    const replacement = options.replace;
    return options.format.split("").map((c) => (c === "_" ? replacement : c));
  }

  const replacements = options.replace;
  return options.format.split("").map((c) => replacements[c] ?? c);
}
