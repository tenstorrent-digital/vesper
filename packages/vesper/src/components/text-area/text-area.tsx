"use client";

import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";
import { FormInputProps } from "@/utils/splitFormInputProps";

export const TEXT_AREA_SIZES = ["sm", "md", "lg"] as const;

export const TEXT_AREA_VARIANTS = [
  "default",
  "warning",
  "success",
  "error",
] as const;

export type TextAreaSize = (typeof TEXT_AREA_SIZES)[number];

export type TextAreaVariant = (typeof TEXT_AREA_VARIANTS)[number];

export interface TextAreaProps extends FormInputProps<"textarea", "textarea"> {
  /** The fixed height of the textarea in pixels, scaling with base rem size. @default 104 */
  height?: number;
  /** Whether to allow vertical resizing of the underling `textarea` element. @default false */
  resizeable?: boolean;
  /** The size of the textarea. Affects padding and typography. @default md */
  size?: TextAreaSize;
  /** The visual variant of the text input, which determines its color scheme and message icon. @default default */
  variant?: TextAreaVariant;
}

const TEXTAREA_TYPOGRAPHY: { [S in TextAreaSize]: TypographyVariant } = {
  sm: "copy-xs",
  md: "copy-sm",
  lg: "copy-md",
};

/**
 * A form-ready textarea component supporting labels, validation messages, and variants.
 *
 * @param {TextAreaSize} [props.size] - (optional) The size of the text input. @default md
 * @param {TextAreaVariant} [props.variant] - (optional) The visual variant determining color scheme and message icon. @default default
 * @param {string} [props.placeholder] - (optional) Placeholder text for the input
 * @param {number} [props.height] - (optional) The fixed height of the textarea in pixels, scaling with base rem size. @default 104
 *
 * You may also pass any additional props to the underlying `div` wrapper or `textarea` element

 * @example
 * <TextArea label="Bio" height={120} maxLength={500} />
 */
export function TextArea(props: TextAreaProps) {
  const {
    variant = "default",
    size = "md",
    resizeable = false,
    // props that should get forwarded to the textarea element
    height = 104,
    className,
    placeholder = " ",
    style,
    ...rest
  } = props;

  return (
    <Typography
      {...rest}
      className={cn(
        "vesper-text-area",
        `vesper-text-area-${size}`,
        `vesper-text-area-${variant}`,
        className,
      )}
      as="textarea"
      variant={TEXTAREA_TYPOGRAPHY[size]}
      placeholder={
        props.required && placeholder.trim()
          ? `${placeholder.trim()} *`
          : placeholder
      }
      style={{
        height: `${height / 16}rem`,
        resize: resizeable ? "block" : "none",
        ...style,
      }}
    />
  );
}
