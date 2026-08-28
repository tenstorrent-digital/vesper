"use client";

import { useLayoutEffect, useRef } from "react";

import { Checkmark, Minus } from "@/components/icons/icons";
import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";
import { useMergedRefs } from "@/utils/hooks/useMergedRefs";
import {
  type FormInputProps,
  splitFormInputProps,
} from "@/utils/splitFormInputProps";

export const CHECKBOX_SIZES = ["sm", "md"] as const;

export type CheckboxSize = (typeof CHECKBOX_SIZES)[number];

export interface CheckboxProps extends FormInputProps<"label", "input"> {
  /** The text displayed next to the checkbox, also used as the input's default `aria-label`. An asterisk is appended when `required` is `true` and no `label` is supplied, and is not included in the accessible name. */
  text: string;
  /** When true, renders the checkbox in an indeterminate (mixed) state, displaying a dash icon instead of a checkmark. @default false */
  indeterminate?: boolean;
  /** The size of the checkbox and its label. @default md */
  size?: CheckboxSize;
}

const CHECKBOX_TYPOGRAPHY: { [S in CheckboxSize]: TypographyVariant } = {
  sm: "label-md",
  md: "label-lg",
};

/**
 * A form-ready checkbox input with a label, supporting controlled and uncontrolled usage as well as indeterminate state.
 *
 * Unlike `Switch`, which only allows a binary on/off choice, `Checkbox` can be used for individual boolean selections that can also include indeterminate state.
 *
 * Related components include `Toggle` (which selects one option from a segmented group) and `Choicebox` (which selects any number of options from a group).
 *
 * @see packages/vesper/src/components/switch/switch.tsx
 * @see packages/vesper/src/components/toggle/toggle.tsx
 * @see packages/vesper/src/components/choicebox/choicebox.tsx
 *
 * @param {string} props.text - The text displayed next to the checkbox, also used as the input's default `aria-label`
 * @param {CheckboxSize} [props.size] - (optional) The size of the checkbox and its text. @default md
 * @param {CheckboxVariant} [props.variant] - (optional) The visual variant determining the color scheme and icon of the message. @default default
 * @param {string} [props.label] - (optional) A label displayed above the checkbox
 * @param {string} [props.message] - (optional) A message displayed below the checkbox with a variant-specific icon
 * @param {boolean} [props.indeterminate] - (optional) Renders the checkbox in an indeterminate (mixed) state. @default false
 * @param {boolean} [props.checked] - (optional) The controlled checked state
 * @param {boolean} [props.defaultChecked] - (optional) The initial checked state (uncontrolled)
 * @param {boolean} [props.disabled] - (optional) Prevents interaction. @default false
 * @param {boolean} [props.required] - (optional) Marks the checkbox as required for form validation, and appends an asterisk to the `label`, or to `text` when no `label` is supplied. @default false
 * @param {string} [props.name] - (optional) Form field name submitted with form data
 *
 * You may also pass any additional props to the wrapping `div` element
 *
 * @example
 * <Checkbox text="Accept terms" name="terms" required />
 *
 * @example
 * <Checkbox
 *   text="Select all"
 *   indeterminate={someChecked && !allChecked}
 *   checked={allChecked}
 *   onChange={(e) => toggleAll(e.target.checked)}
 * />
 *
 * @example
 * <Checkbox
 *   text="Accept terms"
 *   label="Terms and conditions"
 *   variant="error"
 *   message="You must accept the terms to continue."
 *   required
 * />
 */
export function Checkbox(props: CheckboxProps) {
  const { ariaProps, controlProps, wrapperProps, formProps } =
    splitFormInputProps(props);

  const {
    text,
    size = "md",
    indeterminate,
    className,
    ...restWrapperProps
  } = wrapperProps;

  const {
    "aria-describedby": ariaDescribedBy,
    "aria-labelledby": ariaLabelledBy,
    "aria-errormessage": ariaErrorMessage,
    "aria-invalid": ariaInvalid,
    "aria-hidden": ariaHidden,
    ...restAriaProps
  } = ariaProps;

  const innerRef = useRef<HTMLInputElement>(null);
  useLayoutEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = !!indeterminate;
  }, [indeterminate]);

  const mergedInputRef = useMergedRefs(controlProps.ref, innerRef);

  return (
    <label
      {...restWrapperProps}
      {...restAriaProps}
      className={cn("vesper-checkbox", `vesper-checkbox-${size}`, className)}
      aria-hidden={ariaHidden}
    >
      <input
        {...controlProps}
        {...formProps}
        ref={mergedInputRef}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        aria-errormessage={ariaErrorMessage}
        type="checkbox"
        className="vesper-checkbox-input"
      />
      <div className="vesper-checkbox-box">
        <div className="vesper-checkbox-indicator">
          <Checkmark className="vesper-checkbox-checked-icon" />
          <Minus className="vesper-checkbox-indeterminate-icon" />
        </div>
      </div>
      <Typography
        variant={CHECKBOX_TYPOGRAPHY[size]}
        className="vesper-checkbox-label"
        as="span"
      >
        {formProps.required ? `${text} *` : text}
      </Typography>
    </label>
  );
}
