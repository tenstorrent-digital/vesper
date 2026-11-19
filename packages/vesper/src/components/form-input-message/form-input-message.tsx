import { type ComponentProps } from "react";

import {
  ErrorSolid,
  InfoSolid,
  SuccessSolid,
  WarningSolid,
} from "@/components/icons/icons";
import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";
import { cn } from "@/utils/cn";

export const FORM_INPUT_MESSAGE_VARIANTS = [
  "default",
  "warning",
  "success",
  "error",
] as const;

export const FORM_INPUT_MESSAGE_SIZES = ["sm", "lg"] as const;

export type FormInputMessageVariant =
  (typeof FORM_INPUT_MESSAGE_VARIANTS)[number];

export type FormInputMessageSize = (typeof FORM_INPUT_MESSAGE_SIZES)[number];

export interface FormInputMessageProps extends ComponentProps<"output"> {
  /** The size of the message. Affects padding and typography. @default sm */
  size?: FormInputMessageSize;
  /** The visual variant of the message, which determines its color scheme and message icon. @default default */
  variant?: FormInputMessageVariant;
}

const FORM_INPUT_MESSAGE_TYPOGRAPHY: Record<
  FormInputMessageSize,
  TypographyVariant
> = {
  lg: "label-xs",
  sm: "label-xxs",
};

/**
 * A validation or helper message displayed alongside a form input, rendered as a live `output` element with a variant icon.
 *
 * @param {FormInputMessageVariant} [props.variant] - (optional) The visual variant, which determines the color scheme and message icon. @default default
 * @param {FormInputMessageSize} [props.size] - (optional) The size of the message. Affects padding and typography. @default sm
 * @param {ReactNode} [props.children] - (optional) The message to display. When omitted or empty, no content is rendered
 *
 * You may also pass any additional props to the underlying `output` element
 *
 * @example
 * <FormInputMessage>We'll never share your email.</FormInputMessage>
 *
 * @example
 * <FormInputMessage variant="error">
 *   Please enter a valid email address.
 * </FormInputMessage>
 *
 * @example
 * <FormInputMessage size="lg" variant="warning">
 *   This password is weak.
 * </FormInputMessage>
 *
 * @example
 * <FormInputMessage id={messageId} variant="success">
 *   Your changes have been saved.
 * </FormInputMessage>
 */
export const FormInputMessage = ({
  variant = "default",
  className,
  children,
  size = "sm",
  ...props
}: FormInputMessageProps) => {
  const hasMessage =
    children !== "" && children != null && typeof children !== "boolean";

  return (
    <output
      {...props}
      data-message={hasMessage}
      className={cn(
        "vesper-form-input-message",
        `vesper-form-input-message-${variant}`,
        `vesper-form-input-message-${size}`,
        className,
      )}
    >
      {hasMessage && (
        <>
          <span aria-hidden className="vesper-form-input-message-icon">
            {variant === "default" && <InfoSolid />}
            {variant === "error" && <ErrorSolid />}
            {variant === "success" && <SuccessSolid />}
            {variant === "warning" && <WarningSolid />}
          </span>
          <Typography
            as="span"
            variant={FORM_INPUT_MESSAGE_TYPOGRAPHY[size]}
            className="vesper-form-input-message-text"
          >
            {children}
          </Typography>
        </>
      )}
    </output>
  );
};
