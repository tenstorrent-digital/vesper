import { type ComponentProps } from "react";

import {
  ErrorSolid,
  InfoSolid,
  SuccessSolid,
  WarningSolid,
} from "@/components/icons/icons";
import { Typography } from "@/components/typography/typography";

import { cn } from "@/utils/cn";

export const FORM_INPUT_MESSAGE_VARIANTS = [
  "default",
  "warning",
  "success",
  "error",
] as const;

export type FormInputMessageVariant =
  (typeof FORM_INPUT_MESSAGE_VARIANTS)[number];

export interface FormInputMessageProps extends Omit<
  ComponentProps<"output">,
  "children"
> {
  /** The visual variant of the message, which determines its color scheme and message icon. @default default */
  variant?: FormInputMessageVariant;
  /** The message text to display. When omitted or empty, the message content and icon are not rendered, but the visually hidden element remains in the document so it can announce updates. */
  message?: string | undefined;
}

/**
 * A validation or helper message displayed alongside a form input, rendered as a live `output` element with a variant icon.
 *
 * @see packages/vesper/src/components/text-input/text-input.tsx
 * @see packages/vesper/src/components/text-area/text-area.tsx
 *
 * @param {FormInputMessageVariant} [props.variant] - (optional) The visual variant, which determines the color scheme and message icon. @default default
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
  ...props
}: FormInputMessageProps) => {
  return (
    <output
      {...props}
      data-message={!!message}
      className={cn(
        "vesper-form-input-message",
        `vesper-form-input-message-${variant}`,
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
            variant="label-xs"
            className="vesper-form-input-message-text"
          >
            {message}
          </Typography>
        </>
      )}
    </output>
  );
};
