"use client";

import { useId } from "react";

import { FormInputWrapper } from "@/components/form-input-wrapper/form-input-wrapper";
import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";
import { getFormControlProps } from "@/utils/getFormControlProps";
import {
  type FormInputProps,
  splitFormInputProps,
} from "@/utils/splitFormInputProps";

export const TEXT_AREA_SIZES = ["sm", "md", "lg"] as const;

export const TEXT_AREA_VARIANTS = [
  "default",
  "warning",
  "success",
  "error",
] as const;

export type TextAreaSize = (typeof TEXT_AREA_SIZES)[number];

export type TextAreaVariant = (typeof TEXT_AREA_VARIANTS)[number];

export interface TextAreaProps extends Omit<
  FormInputProps<"textarea">,
  "children"
> {
  /** The fixed height of the textarea in pixels, scaling with base rem size. @default 104 */
  height?: number;
  /** Whether to allow vertical resizing of the underling `textarea` element. @default false */
  resizeable?: boolean;
  /** The size of the textarea. Affects padding and typography. @default md */
  size?: TextAreaSize;
  /** The visual variant of the text input, which determines its color scheme and message icon. @default default */
  variant?: TextAreaVariant;
  /** An optional message displayed below the input, paired with a variant-specific icon. Also linked to the input via `aria-describedby`. */
  message?: string;
  /** An optional label displayed above the input. The input is associated by nesting; when `id` is provided, it is also associated via `htmlFor`. An asterisk is appended when `required` is `true`. */
  label?: string;
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
 * @param {string} [props.label] - (optional) A label displayed above the input
 * @param {string} [props.message] - (optional) A message displayed below the input with a variant-specific icon
 * @param {string} [props.placeholder] - (optional) Placeholder text for the input
 * @param {number} [props.height] - (optional) The fixed height of the textarea in pixels, scaling with base rem size. @default 104
 *
 * You may also pass any additional props to the underlying `div` wrapper, and a `ref` to access the underlying `textarea` element

 * @example
 * <TextArea label="Bio" height={120} maxLength={500} />
 */
export function TextArea(props: TextAreaProps) {
  const {
    // component-specific props
    message,
    label,
    variant = "default",
    size = "md",
    resizeable = false,
    height = 104,
    // control props that also drive component behaviour, re-applied to the textarea below
    ref,
    id,
    placeholder = " ",
    required,
    "aria-label": ariaLabel = label,
    "aria-describedby": ariaDescribedby,
    ...rest
  } = props;

  const { formProps, controlProps, wrapperProps } = splitFormInputProps(rest);

  const messageId = useId();

  let inputId = useId();
  if (id) inputId = id;

  const { describedBy, labelProps, messageProps } = getFormControlProps({
    controlId: inputId,
    messageId,
    label,
    message,
    required,
    ariaDescribedby,
  });

  return (
    <FormInputWrapper
      label={labelProps}
      message={messageProps}
      variant={variant}
      {...wrapperProps}
    >
      <Typography
        {...formProps}
        {...controlProps}
        className={cn(
          "vesper-text-area",
          `vesper-text-area-${size}`,
          `vesper-text-area-${variant}`,
        )}
        as="textarea"
        style={{
          height: `${height / 16}rem`,
          resize: resizeable ? "block" : "none",
        }}
        ref={ref}
        variant={TEXTAREA_TYPOGRAPHY[size]}
        id={inputId}
        required={required}
        placeholder={
          required && !label && placeholder.trim()
            ? `${placeholder.trim()} *`
            : placeholder
        }
        aria-label={ariaLabel}
        aria-describedby={describedBy}
      />
    </FormInputWrapper>
  );
}
