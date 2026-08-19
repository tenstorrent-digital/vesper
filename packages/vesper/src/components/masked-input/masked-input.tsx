import { useMemo } from "react";
import { MaskitoOptions } from "@maskito/core";
import { useMaskito } from "@maskito/react";

import {
  type SingleLineTextInputProps,
  TextInput,
} from "@/components/text-input/text-input";

import { getMaskitoOptions } from "./getMaskitoOptions";

export interface MaskedInputProps extends Omit<
  SingleLineTextInputProps,
  "multiline" | "type"
> {
  mask?:
    | MaskitoOptions
    | string
    | {
        format: string;
        replace: RegExp | string | { [key: string]: RegExp };
      };
  type?: "text" | "search" | "tel" | "email" | "url";
}

/**
 * MaskedInput component description, params, and example usage
 *
 * @param {ParamType} [props.optionalParam] - (optional) The prop description. @default value
 * @param {ParamType} props.requiredParam - The prop description
 *
 * @example
 * <MaskedInput />
 */
export function MaskedInput({ mask, inputRef, ...props }: MaskedInputProps) {
  const maskitoConfig = useMemo(
    () => ({ options: getMaskitoOptions(mask) }),
    [mask],
  );
  const maskitoRef = useMaskito(maskitoConfig);

  return (
    <TextInput
      inputRef={(instance) => {
        if (inputRef) {
          if (typeof inputRef === "function") inputRef(instance);
          else inputRef.current = instance;
        }
        maskitoRef(instance);
      }}
      {...props}
    />
  );
}
