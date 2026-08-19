import {
  Children,
  type ComponentProps,
  isValidElement,
  type ReactNode,
} from "react";

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
  message?: string | undefined;
}

/**
 * FormInputMessage component description, params, and example usage
 *
 * @param {ParamType} [props.optionalParam] - (optional) The prop description. @default value
 * @param {ParamType} props.requiredParam - The prop description
 *
 * @example
 * <FormInputMessage />
 */
export const FormInputMessage = ({
  variant = "default",
  className,
  message,
  ...props
}: FormInputMessageProps) => {
  return (
    <output
      data-message={!!message}
      className={cn(
        "vesper-form-input-message",
        `vesper-form-input-message-${variant}`,
        className,
      )}
      {...props}
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
