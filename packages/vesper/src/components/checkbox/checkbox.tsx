"use client";

import {
  type ComponentProps,
  Ref,
  useId,
  useLayoutEffect,
  useRef,
} from "react";

import { FormInputWrapper } from "@/components/form-input-wrapper/form-input-wrapper";
import { Checkmark, Minus } from "@/components/icons/icons";
import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";
import { useMergedRefs } from "@/utils/hooks/useMergedRefs";

export const CHECKBOX_SIZES = ["sm", "md"] as const;

export const CHECKBOX_VARIANTS = [
  "default",
  "warning",
  "error",
  "success",
] as const;

export type CheckboxSize = (typeof CHECKBOX_SIZES)[number];

export type CheckboxVariant = (typeof CHECKBOX_VARIANTS)[number];

/**
 * Union of all the prop types that should be forwarded to the input element, and excluded from the containing label element
 */
type ForwardedPropTypes =
  | "id"
  | "form"
  | "value"
  | "autoFocus"
  | "disabled"
  | "name"
  | "required"
  | "checked"
  | "defaultChecked"
  | "role"
  | "tabIndex"
  | "aria-label"
  | "aria-labelledby"
  | "aria-describedby"
  | "aria-invalid"
  | "onFocus"
  | "onFocusCapture"
  | "onBlur"
  | "onBlurCapture"
  | "onChange"
  | "onChangeCapture"
  | "onBeforeInput"
  | "onBeforeInputCapture"
  | "onInput"
  | "onInputCapture"
  | "onReset"
  | "onResetCapture"
  | "onSubmit"
  | "onSubmitCapture"
  | "onInvalid"
  | "onInvalidCapture"
  | "onKeyDown"
  | "onKeyDownCapture"
  | "onKeyUp"
  | "onKeyUpCapture";

export interface CheckboxProps
  extends
    Omit<ComponentProps<"div">, "children" | "onChange" | ForwardedPropTypes>,
    Pick<ComponentProps<"input">, ForwardedPropTypes> {
  /** The text displayed next to the checkbox, also used as the input's default `aria-label`. An asterisk is appended when `required` is `true` and no `label` is supplied, and is not included in the accessible name. */
  text: string;
  /** When true, renders the checkbox in an indeterminate (mixed) state, displaying a dash icon instead of a checkmark. @default false */
  indeterminate?: boolean;
  /** The size of the checkbox and its label. @default md */
  size?: CheckboxSize;
  /** The visual variant of the input, which determines its message's color scheme and icon. @default default */
  variant?: CheckboxVariant;
  /** An optional label displayed above the checkbox. An asterisk is appended when `required` is `true`, and is not included in the accessible name. */
  label?: string;
  /** An optional message displayed below the checkbox, paired with a variant-specific icon. Also linked to the input via `aria-describedby`. */
  message?: string;
  /** A ref forwarded to the underlying `<input>` element for direct DOM access. */
  inputRef?: Ref<HTMLInputElement>;
}

const CHECKBOX_TYPOGRAPHY: { [S in CheckboxSize]: TypographyVariant } = {
  sm: "label-md",
  md: "label-lg",
};

/**
 * A form-ready checkbox input with a label, supporting controlled and uncontrolled usage as well as indeterminate state.
 *
 * Unlike `Switch` (which presents a binary on/off choice as a sliding pill), `Toggle` (which selects one option from a segmented group), and `Choicebox` (which selects any number of options from a group), `Checkbox` is used for individual boolean selections that can include indeterminate state.
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
  const {
    // component-specific props
    text,
    size = "md",
    variant = "default",
    label,
    message,
    indeterminate,
    inputRef,
    // props forwarded to the inner input
    id,
    form,
    value,
    autoFocus,
    disabled,
    name,
    required,
    checked,
    defaultChecked,
    role,
    tabIndex,
    "aria-label": ariaLabel = text,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
    "aria-invalid": ariaInvalid,
    onFocus,
    onFocusCapture,
    onBlur,
    onBlurCapture,
    onChange,
    onChangeCapture,
    onBeforeInput,
    onBeforeInputCapture,
    onInput,
    onInputCapture,
    onReset,
    onResetCapture,
    onSubmit,
    onSubmitCapture,
    onInvalid,
    onInvalidCapture,
    onKeyDown,
    onKeyDownCapture,
    onKeyUp,
    onKeyUpCapture,
    // props spread onto the containing label
    className,
    ...rest
  } = props;

  const innerRef = useRef<HTMLInputElement>(null);
  useLayoutEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = !!indeterminate;
  }, [indeterminate]);

  const mergedInputRef = useMergedRefs(inputRef, innerRef);

  let inputId = useId();
  if (id) inputId = id;

  const messageId = useId();

  // If an additional aria-describedby is supplied, this ensures that both ids get used
  const describedBy =
    [ariaDescribedby, message ? messageId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <FormInputWrapper
      label={
        label
          ? {
              text: required ? `${label} *` : label,
              htmlFor: inputId,
            }
          : undefined
      }
      message={message ? { text: message, id: messageId } : undefined}
      variant={variant}
      className={className}
      {...rest}
    >
      <label className={cn("vesper-checkbox", `vesper-checkbox-${size}`)}>
        <input
          ref={mergedInputRef}
          type="checkbox"
          className="vesper-checkbox-input"
          id={inputId}
          form={form}
          value={value}
          autoFocus={autoFocus}
          disabled={disabled}
          name={name}
          required={required}
          checked={checked}
          defaultChecked={defaultChecked}
          role={role}
          tabIndex={tabIndex}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={describedBy}
          aria-invalid={ariaInvalid}
          onChange={onChange}
          onFocus={onFocus}
          onFocusCapture={onFocusCapture}
          onBlur={onBlur}
          onBlurCapture={onBlurCapture}
          onChangeCapture={onChangeCapture}
          onBeforeInput={onBeforeInput}
          onBeforeInputCapture={onBeforeInputCapture}
          onInput={onInput}
          onInputCapture={onInputCapture}
          onReset={onReset}
          onResetCapture={onResetCapture}
          onSubmit={onSubmit}
          onSubmitCapture={onSubmitCapture}
          onInvalid={onInvalid}
          onInvalidCapture={onInvalidCapture}
          onKeyDown={onKeyDown}
          onKeyDownCapture={onKeyDownCapture}
          onKeyUp={onKeyUp}
          onKeyUpCapture={onKeyUpCapture}
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
          {required && !label ? `${text} *` : text}
        </Typography>
      </label>
    </FormInputWrapper>
  );
}
