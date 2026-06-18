import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/utils/cn";
import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";

export const TEXT_INPUT_SIZES = ["sm", "md", "lg"] as const;

export type TextInputSize = (typeof TEXT_INPUT_SIZES)[number];

/**
 * Union of all the event handlers that should be forwarded to the input element, and excluded from the containing div element
 * */
type InputPropTypes =
  | "spellCheck"
  | "name"
  | "pattern"
  | "minLength"
  | "maxLength"
  | "readOnly"
  | "id"
  | "placeholder"
  | "value"
  | "required"
  | "min"
  | "max"
  | "autoFocus"
  | "autoComplete"
  | "autoCorrect"
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

export interface TextInputProps
  extends
    Omit<ComponentProps<"div">, InputPropTypes>,
    Pick<ComponentProps<"input">, InputPropTypes> {
  size?: TextInputSize;
  icon?: ReactNode;
  type?: "text" | "email" | "password" | "url";
}

const TEXT_INPUT_TYPOGRAPHY: { [S in TextInputSize]: TypographyVariant } = {
  sm: "copy-xs",
  md: "copy-sm",
  lg: "copy-md",
};

export function TextInput({
  className,
  icon,
  type = "text",
  size = "lg",
  spellCheck,
  name,
  pattern,
  minLength,
  maxLength,
  readOnly,
  id,
  placeholder,
  value,
  required,
  min,
  max,
  autoFocus,
  autoComplete,
  autoCorrect,
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
  ...props
}: TextInputProps) {
  return (
    <div
      className={cn(`vesper-text-input vesper-text-input-${size}`, className)}
      {...props}
    >
      {icon && <span className="vesper-text-input-icon">{icon}</span>}
      <Typography
        as="input"
        variant={TEXT_INPUT_TYPOGRAPHY[size]}
        className="vesper-text-input-field"
        type={type}
        spellCheck={spellCheck}
        name={name}
        pattern={pattern}
        minLength={minLength}
        maxLength={maxLength}
        readOnly={readOnly}
        id={id}
        placeholder={placeholder}
        value={value}
        required={required}
        min={min}
        max={max}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
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
    </div>
  );
}
