import type { ComponentProps } from "react";

import { cn } from "@/utils/cn";

import { FormInputMessage } from "../form-input-message/form-input-message";
import { Typography } from "../typography/typography";

export const FORM_INPUT_WRAPPER_VARIANTS = [
  "error",
  "success",
  "warning",
  "default",
] as const;

export type FormInputWrapperVariant =
  (typeof FORM_INPUT_WRAPPER_VARIANTS)[number];

export interface FormInputWrapperProps extends ComponentProps<"div"> {
  /** The visual variant of the wrapper, which determines the color scheme and icon of the message. @default default */
  variant?: FormInputWrapperVariant;
  /** An optional label rendered above the wrapped input. `htmlFor` should match the `id` of the wrapped input. */
  label?: { htmlFor: string; text: string; id?: string };
  /** An optional message rendered below the wrapped input. `id` should be referenced by the wrapped input's `aria-describedby`. */
  message?: { id: string; text: string };
}

/**
 * A layout wrapper that pairs a form input with an optional label and validation or helper message.
 *
 * @see packages/vesper/src/components/form-input-message/form-input-message.tsx
 *
 * @param {FormInputWrapperVariant} [props.variant] - (optional) The visual variant, which determines the color scheme and icon of the message. @default default
 * @param {{ htmlFor: string, text: string; id?: string }} [props.label] - (optional) A label rendered above the wrapped input, associated with it via `htmlFor`
 * @param {{ id: string, text: string }} [props.message] - (optional) A message rendered below the wrapped input. Pass its `id` to the input's `aria-describedby`
 * @param {ReactNode} [props.children] - (optional) The form input to wrap
 *
 * You may also pass any additional props to the underlying `div` element
 *
 * @example
 * <FormInputWrapper label={{ htmlFor: "email", text: "Email" }}>
 *   <input id="email" type="email" />
 * </FormInputWrapper>
 *
 * @example
 * <FormInputWrapper
 *   variant="error"
 *   label={{ htmlFor: "email", text: "Email" }}
 *   message={{ id: "email-message", text: "Please enter a valid email address." }}
 * >
 *   <input id="email" type="email" aria-describedby="email-message" aria-invalid />
 * </FormInputWrapper>
 */
export function FormInputWrapper({
  className,
  variant = "default",
  label,
  message,
  children,
  ...props
}: FormInputWrapperProps) {
  return (
    <div className={cn("vesper-form-input-wrapper", className)} {...props}>
      {label && (
        <Typography
          className="vesper-form-input-wrapper-label"
          as="label"
          variant="label-sm"
          htmlFor={label.htmlFor}
          id={label.id}
        >
          {label.text}
        </Typography>
      )}
      {children}
      <FormInputMessage
        id={message?.id}
        message={message?.text}
        variant={variant}
      />
    </div>
  );
}
