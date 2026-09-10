"use client";

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
  /** The visual variant of the text input, which determines its color scheme. @default default */
  variant?: TextAreaVariant;
}

/**
 * A form-ready textarea component supporting different visual variants.
 *
 * @param {TextAreaSize} [props.size] - (optional) The size of the text input. @default md
 * @param {TextAreaVariant} [props.variant] - (optional) The visual variant determining color scheme. @default default
 * @param {string} [props.placeholder] - (optional) Placeholder text for the input
 * @param {number} [props.height] - (optional) The fixed height of the textarea in pixels, scaling with base rem size. @default 104
 *
 * You may also pass any additional props to the underlying `textarea` element

 * @example
 * <TextArea
 *  aria-label="Bio"
 *  placeholder="Tell us about yourself"
 *  height={120}
 *  maxLength={500}
 * />
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
    <textarea
      {...rest}
      className={cn(
        "vesper-text-area",
        `vesper-text-area-${size}`,
        `vesper-text-area-${variant}`,
        className,
      )}
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
