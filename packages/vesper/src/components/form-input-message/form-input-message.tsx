import { type ComponentProps } from "react";

import {
  ErrorSolid,
  InfoSolid,
  SuccessSolid,
  WarningSolid,
} from "@/components/icons/icons";
import {
  Typography,
  TypographyVariant,
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

export interface FormInputMessageProps extends Omit<
  ComponentProps<"output">,
  "children"
> {
  /** The size of the message. Affects padding and typography. @default sm */
  size?: FormInputMessageSize;
  /** The visual variant of the message, which determines its color scheme and message icon. @default default */
  variant?: FormInputMessageVariant;
  /** The message text to display. When omitted or empty, the message content and icon are not rendered, but the visually hidden element remains in the document so it can announce updates. */
  message?: string | undefined | null | false;
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
 * @param {string} [props.message] - (optional) The message text to display. When omitted or empty, no content is rendered
 *
 * You may also pass any additional props to the underlying `output` element
 *
 * @example
 * <FormInputMessage message="We'll never share your email." />
 *
 * @example
 * <FormInputMessage variant="error" message="Please enter a valid email address." />
 *
 * @example
 * <FormInputMessage size="lg" variant="warning" message="This password is weak." />
 *
 * @example
 * <FormInputMessage
 *   id={messageId}
 *   variant="success"
 *   message="Your changes have been saved."
 * />
 */
export const FormInputMessage = ({
  variant = "default",
  className,
  message,
  size = "sm",
  ...props
}: FormInputMessageProps) => {
  return (
    <output
      {...props}
      data-message={!!message}
      className={cn(
        "vesper-form-input-message",
        `vesper-form-input-message-${variant}`,
        `vesper-form-input-message-${size}`,
        className,
      )}
    >
      {!!message && (
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
            {message}
          </Typography>
        </>
      )}
    </output>
  );
};
