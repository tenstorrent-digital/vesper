"use client";

import { MouseEvent, type ReactNode, useId } from "react";

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

export const TEXT_INPUT_SIZES = ["sm", "md", "lg"] as const;

export const TEXT_INPUT_VARIANTS = [
  "default",
  "warning",
  "success",
  "error",
] as const;

export type TextInputSize = (typeof TEXT_INPUT_SIZES)[number];

export type TextInputVariant = (typeof TEXT_INPUT_VARIANTS)[number];

export interface TextInputProps extends FormInputProps<"input"> {
  /** The size of the text input. Affects padding and typography. @default md */
  size?: TextInputSize;
  /** The visual variant of the text input, which determines its color scheme and message icon. @default default */
  variant?: TextInputVariant;
  /** An optional message displayed below the input, paired with a variant-specific icon. Also linked to the input via `aria-describedby`. */
  message?: string;
  /** An optional label displayed above the input. An asterisk is appended when `required` is `true`. */
  label?: string;
  /** An optional icon element rendered to the left of the input field. */
  iconLeft?: ReactNode;
  /** Optional click handler for the left icon. When provided, the icon is rendered as a `<button>` instead of a `<span>`. */
  iconLeftAction?: {
    /** The click event handler */
    handler(e: MouseEvent<HTMLButtonElement>): void;
    /** An accessible aria-label for the icon */
    ariaLabel: string;
  };
  /** An optional icon element rendered to the right of the input field. */
  iconRight?: ReactNode;
  /** Optional click handler for the right icon. When provided, the icon is rendered as a `<button>` instead of a `<span>`. */
  iconRightAction?: {
    /** The click event handler */
    handler(e: MouseEvent<HTMLButtonElement>): void;
    /** An accessible aria-label for the icon */
    ariaLabel: string;
  };
  /** The HTML input type. Determines the browser's native input behavior and keyboard. @default text */
  type?:
    | "text"
    | "email"
    | "password"
    | "url"
    | "tel"
    | "search"
    | "number"
    | "date"
    | "datetime-local"
    | "week"
    | "month"
    | "time";
}

const TEXT_INPUT_TYPOGRAPHY: { [S in TextInputSize]: TypographyVariant } = {
  sm: "copy-xs",
  md: "copy-sm",
  lg: "copy-md",
};

/**
 * A form-ready text input component supporting labels, icons, validation messages, and variants.
 *
 * @param {TextInputSize} [props.size] - (optional) The size of the text input. @default md
 * @param {TextInputVariant} [props.variant] - (optional) The visual variant determining color scheme and message icon. @default default
 * @param {string} [props.label] - (optional) A label displayed above the input
 * @param {string} [props.message] - (optional) A message displayed below the input with a variant-specific icon
 * @param {ReactNode} [props.iconLeft] - (optional) An element rendered to the left of the input field
 * @param {ReactNode} [props.iconRight] - (optional) An element rendered to the right of the input field
 * @param {string} [props.type] - (optional) The HTML input type. @default text
 * @param {string} [props.placeholder] - (optional) Placeholder text for the input
 *
 * You may also pass any additional props to the underlying `div` wrapper, and a `ref` to access the underlying `input` element
 *
 * @example
 * <TextInput label="Email" name="email" type="email" required />
 *
 * @example
 * <TextInput
 *   variant="error"
 *   message="This field is required"
 *   label="Username"
 *   value={username}
 *   onChange={(e) => setUsername(e.target.value)}
 * />
 */
export function TextInput(props: TextInputProps) {
  const {
    // component-specific props
    iconLeft,
    iconLeftAction,
    iconRight,
    iconRightAction,
    message,
    label,
    variant = "default",
    size = "md",
    // control props that also drive component behaviour, re-applied to the input below
    ref,
    type = "text",
    disabled,
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
      variant={variant}
      label={labelProps}
      message={messageProps}
      {...wrapperProps}
    >
      <div
        className={cn(
          "vesper-text-input",
          `vesper-text-input-${size}`,
          `vesper-text-input-${variant}`,
        )}
      >
        {iconLeft && (
          <TextInputIcon
            ariaLabel={iconLeftAction?.ariaLabel}
            onClick={iconLeftAction?.handler}
            disabled={disabled}
          >
            {iconLeft}
          </TextInputIcon>
        )}
        <Typography
          {...formProps}
          {...controlProps}
          className="vesper-text-input-field"
          as="input"
          ref={ref}
          variant={TEXT_INPUT_TYPOGRAPHY[size]}
          type={type}
          disabled={disabled}
          required={required}
          id={inputId}
          placeholder={
            required && !label && placeholder.trim()
              ? `${placeholder.trim()} *`
              : placeholder
          }
          aria-label={ariaLabel}
          aria-describedby={describedBy}
        />
        {iconRight && (
          <TextInputIcon
            ariaLabel={iconRightAction?.ariaLabel}
            onClick={iconRightAction?.handler}
            disabled={disabled}
          >
            {iconRight}
          </TextInputIcon>
        )}
      </div>
    </FormInputWrapper>
  );
}

function TextInputIcon({
  ariaLabel,
  onClick,
  children,
  disabled,
}: {
  ariaLabel?: string;
  onClick?(e: MouseEvent<HTMLButtonElement>): void;
  children: ReactNode;
  disabled?: boolean;
}) {
  if (onClick) {
    return (
      <button
        aria-label={ariaLabel}
        onClick={onClick}
        disabled={disabled}
        type="button"
        className="vesper-text-input-icon"
      >
        {children}
      </button>
    );
  }

  return <span className="vesper-text-input-icon">{children}</span>;
}
