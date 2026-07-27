"use client";

import {
  type ComponentProps,
  RefObject,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";

import { Checkmark, Minus } from "@/components/icons/icons";
import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";

export const CHECKBOX_SIZES = ["sm", "md"] as const;

export type CheckboxSize = (typeof CHECKBOX_SIZES)[number];

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
    Omit<ComponentProps<"label">, "children" | "onChange" | ForwardedPropTypes>,
    Pick<ComponentProps<"input">, ForwardedPropTypes> {
  /** The text label displayed next to the checkbox. An asterisk is appended when `required` is true. */
  label: string;
  /** When true, renders the checkbox in an indeterminate (mixed) state, displaying a dash icon instead of a checkmark. @default false */
  indeterminate?: boolean;
  /** The size of the checkbox and its label. @default md */
  size?: CheckboxSize;
  /** A ref forwarded to the underlying `<input>` element for direct DOM access. */
  inputRef?: RefObject<HTMLInputElement | null>;
}

const CHECKBOX_TYPOGRAPHY: { [S in CheckboxSize]: TypographyVariant } = {
  sm: "label-md",
  md: "label-lg",
};

/**
 * A form-ready checkbox input with a label, supporting controlled and uncontrolled usage as well as indeterminate state.
 *
 * @param {string} props.label - The text label displayed next to the checkbox
 * @param {CheckboxSize} [props.size] - (optional) The size of the checkbox and its label. @default md
 * @param {boolean} [props.indeterminate] - (optional) Renders the checkbox in an indeterminate (mixed) state. @default false
 * @param {boolean} [props.checked] - (optional) The controlled checked state
 * @param {boolean} [props.defaultChecked] - (optional) The initial checked state (uncontrolled)
 * @param {boolean} [props.disabled] - (optional) Prevents interaction. @default false
 * @param {boolean} [props.required] - (optional) Marks the checkbox as required for form validation. @default false
 * @param {string} [props.name] - (optional) Form field name submitted with form data
 *
 * You may also pass any additional props to the underlying `label` element
 *
 * @example
 * <Checkbox label="Accept terms" name="terms" required />
 *
 * @example
 * <Checkbox
 *   label="Select all"
 *   indeterminate={someChecked && !allChecked}
 *   checked={allChecked}
 *   onChange={(e) => toggleAll(e.target.checked)}
 * />
 */
export function Checkbox(props: CheckboxProps) {
  const {
    // component-specific props
    label,
    size = "md",
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
    "aria-label": ariaLabel,
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
    // props spread onto the wrapper label
    className,
    ...rest
  } = props;

  const ref = useRef<HTMLInputElement>(null);
  useLayoutEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate;
  }, [indeterminate]);

  useImperativeHandle(inputRef, () => ref.current!);

  return (
    <label
      className={cn("vesper-checkbox", `vesper-checkbox-${size}`, className)}
      {...rest}
    >
      <input
        ref={ref}
        type="checkbox"
        className="vesper-checkbox-input"
        id={id}
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
        aria-describedby={ariaDescribedby}
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
        {required ? label + " *" : label}
      </Typography>
    </label>
  );
}
