"use client";

import { type MouseEvent, type ReactNode } from "react";

import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";
import {
  FormInputProps,
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

export interface TextInputProps extends FormInputProps<"div", "input"> {
  /** The size of the text input. Affects padding and typography. @default md */
  size?: TextInputSize;
  /** The visual variant of the text input, which determines its color scheme and message icon. @default default */
  variant?: TextInputVariant;
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
 * @param {ReactNode} [props.iconLeft] - (optional) An element rendered to the left of the input field
 * @param {ReactNode} [props.iconRight] - (optional) An element rendered to the right of the input field
 * @param {string} [props.type] - (optional) The HTML input type. @default text
 * @param {string} [props.placeholder] - (optional) Placeholder text for the input
 *
 * You may also pass any additional props to the underlying `div` wrapper or `input` element
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
    iconLeft,
    iconLeftAction,
    iconRight,
    iconRightAction,
    variant = "default",
    size = "md",
    type = "text",
    className,
    placeholder = " ",
    ...rest
  } = props;

  const { ariaProps, controlProps, formProps, wrapperProps } =
    splitFormInputProps(rest, "input");

  return (
    <div
      {...wrapperProps}
      className={cn(
        "vesper-text-input",
        `vesper-text-input-${size}`,
        `vesper-text-input-${variant}`,
        className,
      )}
    >
      {iconLeft && (
        <TextInputIcon
          ariaLabel={iconLeftAction?.ariaLabel}
          onClick={iconLeftAction?.handler}
          disabled={formProps.disabled}
        >
          {iconLeft}
        </TextInputIcon>
      )}
      <Typography
        {...ariaProps}
        {...controlProps}
        {...formProps}
        as="input"
        variant={TEXT_INPUT_TYPOGRAPHY[size]}
        className="vesper-text-input-field"
        type={type}
        placeholder={
          formProps.required && placeholder.trim()
            ? `${placeholder.trim()} *`
            : placeholder
        }
      />
      {iconRight && (
        <TextInputIcon
          ariaLabel={iconRightAction?.ariaLabel}
          onClick={iconRightAction?.handler}
          disabled={formProps.disabled}
        >
          {iconRight}
        </TextInputIcon>
      )}
    </div>
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
