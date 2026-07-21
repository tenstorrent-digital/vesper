"use client";

import {
  type ChangeEvent,
  type ComponentProps,
  type RefObject,
  useCallback,
  useState,
} from "react";

import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";

export const SWITCH_SIZES = ["sm", "md"] as const;

export type SwitchSize = (typeof SWITCH_SIZES)[number];

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
  | "readOnly"
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

export interface SwitchProps
  extends
    Omit<ComponentProps<"label">, "children" | "onChange" | ForwardedPropTypes>,
    Pick<ComponentProps<"input">, ForwardedPropTypes> {
  /** The text label displayed next to the switch. An asterisk is appended when `required` is `true`. */
  label?: string;
  /** The size of the switch and its label. Defaults to `"md"`. */
  size?: SwitchSize;
  /** A ref forwarded to the underlying `<input>` element for direct DOM access. */
  inputRef?: RefObject<HTMLInputElement | null>;
}

const SWITCH_TYPOGRAPHY: { [S in SwitchSize]: TypographyVariant } = {
  sm: "label-md",
  md: "label-lg",
};

export function Switch({
  // component-specific props
  label,
  size = "md",
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
  readOnly,
  /**
   * set default role to "switch" as the switch component has no indeterminate state
   * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/switch_role#:~:text=Unlike%20an%20%3Cinput%20type%3D%22checkbox%22%3E%20or%20role%3D%22checkbox%22%2C%20there%20is%20no%20indeterminate%20or%20mixed%20state
   */
  role = "switch",
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
  ...props
}: SwitchProps) {
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(
    defaultChecked ?? false,
  );
  const ariaChecked = isControlled ? checked : internalChecked;

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalChecked(event.target.checked);
      }
      onChange?.(event);
    },
    [isControlled, onChange],
  );

  return (
    <label
      className={cn("vesper-switch", `vesper-switch-${size}`, className)}
      {...props}
    >
      <input
        className="vesper-switch-input"
        type="checkbox"
        ref={inputRef}
        id={id}
        form={form}
        value={value}
        autoFocus={autoFocus}
        disabled={disabled}
        name={name}
        required={required}
        checked={checked}
        defaultChecked={defaultChecked}
        readOnly={readOnly}
        role={role}
        tabIndex={tabIndex}
        aria-checked={role === "switch" ? ariaChecked : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-invalid={ariaInvalid}
        onFocus={onFocus}
        onFocusCapture={onFocusCapture}
        onBlur={onBlur}
        onBlurCapture={onBlurCapture}
        onChange={handleChange}
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
      <div className="vesper-switch-pill" />
      {label && (
        <Typography
          className="vesper-switch-label"
          variant={SWITCH_TYPOGRAPHY[size]}
        >
          {required ? `${label} *` : label}
        </Typography>
      )}
    </label>
  );
}
