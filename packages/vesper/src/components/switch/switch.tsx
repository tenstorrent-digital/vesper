import type { ComponentProps, RefObject } from "react";
import { cn } from "@/utils/cn";
import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";

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
  label?: string;
  size?: SwitchSize;
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
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-invalid={ariaInvalid}
        onFocus={onFocus}
        onFocusCapture={onFocusCapture}
        onBlur={onBlur}
        onBlurCapture={onBlurCapture}
        onChange={onChange}
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
