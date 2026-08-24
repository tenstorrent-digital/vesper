"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  maskitoInitialCalibrationPlugin,
  type MaskitoOptions,
} from "@maskito/core";
import { useMaskito } from "@maskito/react";

import {
  TextInput,
  type TextInputProps,
} from "@/components/text-input/text-input";

import { useMergedRefs } from "@/utils/hooks/useMergedRefs";

import { getMaskitoOptions } from "./getMaskitoOptions";

/**
 * The text masking configuration for a `MaskedInput`, which can take one of three shapes:
 *
 * - `string`: a fixed-length pattern where every `_` is a placeholder that accepts any character, eg. `"____-____-____"`.
 * - `{ format, replace }`: a fixed-length pattern where `replace` determines the placeholder characters and what they accept.
 *   Pass a `RegExp` to keep `_` as the placeholder but restrict accepted characters, a single-character `string` to use a
 *   different placeholder that accepts any character, or a `Record<string, RegExp>` to map each placeholder character in
 *   `format` to the expression validating it.
 * - `MaskitoOptions`: a full [maskito](https://maskito.dev) configuration, for behavior the shorthands can't express, eg.
 *   dynamic (variable-length) masks, pre/post-processing hooks, or overwrite mode.
 *
 * Any character in a `string` or `format` pattern that is not a placeholder is treated as a literal and inserted automatically as the user types.
 */
export type TextMaskingConfig =
  | MaskitoOptions
  | string
  | {
      format: string;
      replace: RegExp | string | { [key: string]: RegExp };
    };

export interface MaskedInputProps extends Omit<TextInputProps, "type"> {
  /** The text masking configuration, which determines the shape and formatting of the masked text. When omitted, no masking is applied and the field behaves like a regular `TextInput`. */
  mask?: TextMaskingConfig;
  /** The HTML input type. Restricted to the types that can be masked. @default text */
  type?: "text" | "search" | "tel" | "email" | "url";
  /** When `true`, the initial value of the input is formatted to match the `mask` on mount. @default false */
  formatOnMount?: boolean;
  /** When `true`, the current value of the input is reformatted to match the `mask` whenever the `mask` prop changes. @default true */
  formatOnMaskChange?: boolean;
}

/**
 * A `TextInput` that restricts and formats its value as the user types, via a text mask.
 *
 * @param {TextMaskingConfig} [props.mask] - (optional) The text masking configuration. Accepts a `string` pattern, a `{ format, replace }` object, or a `MaskitoOptions` object. When omitted, no masking is applied
 * @param {string} [props.type] - (optional) The HTML input type, restricted to `"text" | "search" | "tel" | "email" | "url"`. @default text
 * @param {boolean} [props.formatOnMount] - (optional) When `true`, the initial value of the input is formatted to match the `mask` on mount. @default false
 * @param {boolean} [props.formatOnMaskChange] - (optional) When `true`, the current value of the input is reformatted to match the `mask` whenever the `mask` prop changes. @default false
 *
 * You may also pass any additional props supported by the `TextInput` component including `size`, `variant`, `iconLeft`, `iconRight`, and `dropdown`
 *
 * @example
 * <MaskedInput label="Activation code" mask="____-____-____" />
 *
 * @example
 * <MaskedInput
 *   label="Phone number"
 *   placeholder="ex: +1 (222) 333-4444"
 *   mask={{ format: "+1 (___) ___-____", replace: /\d/ }}
 * />
 *
 * @example
 * <MaskedInput
 *   label="Postal code"
 *   placeholder="ex: A0A 1B1"
 *   mask={{ format: "ABA BAB", replace: { A: /[a-zA-Z]/, B: /\d/ } }}
 * />
 *
 * @example
 * <MaskedInput
 *   label="Activation code"
 *   mask="____-____-____"
 *   defaultValue="123456789012"
 *   formatOnMount
 * />
 */
export function MaskedInput({
  mask,
  inputRef,
  formatOnMount = false,
  formatOnMaskChange = false,
  ...props
}: MaskedInputProps) {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
  }, []);

  const maskitoConfig = useMemo(() => {
    const options = getMaskitoOptions(mask);

    const shouldFormat = mounted.current ? formatOnMaskChange : formatOnMount;
    if (!shouldFormat) return { options };

    return {
      options: {
        ...options,
        plugins: [
          ...(options.plugins ?? []),
          maskitoInitialCalibrationPlugin(),
        ],
      },
    };
  }, [mask, formatOnMount, formatOnMaskChange]);

  const maskitoRef = useMaskito(maskitoConfig);

  const mergedInputRef = useMergedRefs(inputRef, maskitoRef);

  return <TextInput inputRef={mergedInputRef} {...props} />;
}
