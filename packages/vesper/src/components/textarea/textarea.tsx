"use client";

import { type ComponentProps, type Ref, useId } from "react";

import { FormInputMessage } from "@/components/form-input-message/form-input-message";
import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";

export const TEXTAREA_SIZES = ["sm", "md", "lg"] as const;

export const TEXTAREA_VARIANTS = [
  "default",
  "warning",
  "success",
  "error",
] as const;

export type TextareaSize = (typeof TEXTAREA_SIZES)[number];

export type TextareaVariant = (typeof TEXTAREA_VARIANTS)[number];

/**
 * Union of all the prop types that should be forwarded to the textarea element, and excluded from the containing div element
 * */
type ForwardedPropTypes =
  | "defaultValue"
  | "inputMode"
  | "enterKeyHint"
  | "form"
  | "disabled"
  | "spellCheck"
  | "name"
  | "minLength"
  | "maxLength"
  | "readOnly"
  | "id"
  | "placeholder"
  | "value"
  | "required"
  | "autoFocus"
  | "autoComplete"
  | "autoCorrect"
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
  | "onPaste"
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

export interface TextareaProps
  extends
    Omit<ComponentProps<"div">, ForwardedPropTypes>,
    Pick<ComponentProps<"textarea">, ForwardedPropTypes> {
  /** A ref forwarded to the underlying `<textarea>` element for direct DOM access. */
  inputRef?: Ref<HTMLTextAreaElement>;
  /** The fixed height of the textarea in pixels, scaling with base rem size. */
  height?: number;
  /** The size of the textarea. Affects padding and typography. @default md */
  size?: TextareaSize;
  /** The visual variant of the text input, which determines its color scheme and message icon. @default default */
  variant?: TextareaVariant;
  /** An optional message displayed below the input, paired with a variant-specific icon. Also linked to the input via `aria-describedby`. */
  message?: string;
  /** An optional label displayed above the input. The input is associated by nesting; when `id` is provided, it is also associated via `htmlFor`. An asterisk is appended when `required` is `true`. */
  label?: string;
}

const TEXTAREA_TYPOGRAPHY: { [S in TextareaSize]: TypographyVariant } = {
  sm: "copy-xs",
  md: "copy-sm",
  lg: "copy-md",
};

/**
 * A form-ready textarea component supporting labels, validation messages, and variants.
 *
 * @param {TextareaSize} [props.size] - (optional) The size of the text input. @default md
 * @param {TextareaVariant} [props.variant] - (optional) The visual variant determining color scheme and message icon. @default default
 * @param {string} [props.label] - (optional) A label displayed above the input
 * @param {string} [props.message] - (optional) A message displayed below the input with a variant-specific icon
 * @param {string} [props.placeholder] - (optional) Placeholder text for the input
 * @param {number} [props.height] - (optional) The fixed height of the textarea in pixels, scaling with base rem size. @default 104
 *
 * You may also pass any additional props to the underlying `div` wrapper or `textarea` element

 * @example
 * <Textarea label="Bio" height={120} maxLength={500} />
 */
export function Textarea(props: TextareaProps) {
  const {
    // component-specific props
    inputRef,
    message,
    label,
    variant = "default",
    size = "md",
    // props that should get forwarded to the textarea element
    height = 104,
    defaultValue,
    inputMode,
    enterKeyHint,
    form,
    disabled,
    spellCheck,
    name,
    minLength,
    maxLength,
    readOnly,
    id,
    placeholder = " ",
    value,
    required,
    autoFocus,
    autoComplete,
    autoCorrect,
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
    onPaste,
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
    // props that should get spread onto the wrapper div
    className,
    ...rest
  } = props;

  const messageId = useId();

  let inputId = useId();
  if (id) inputId = id;

  // If an additional aria-describedby is supplied, this ensures that both ids get used
  const describedBy =
    [ariaDescribedby, message ? messageId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const input = (
    <div className="vesper-textarea-field-wrapper">
      <Typography
        className="vesper-textarea-field"
        as="textarea"
        style={{ height: `${height / 16}rem` }}
        ref={inputRef}
        variant={TEXTAREA_TYPOGRAPHY[size]}
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-invalid={ariaInvalid}
        role={role}
        tabIndex={tabIndex}
        defaultValue={defaultValue}
        inputMode={inputMode}
        enterKeyHint={enterKeyHint}
        form={form}
        disabled={disabled}
        spellCheck={spellCheck}
        name={name}
        minLength={minLength}
        maxLength={maxLength}
        readOnly={readOnly}
        id={inputId}
        placeholder={
          required && !label && placeholder.trim()
            ? `${placeholder.trim()} *`
            : placeholder
        }
        value={value}
        required={required}
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
        onPaste={onPaste}
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

  return (
    <div
      className={cn(
        "vesper-textarea",
        `vesper-textarea-${size}`,
        `vesper-textarea-${variant}`,
        "vesper-textarea-multiline",
        className,
      )}
      {...rest}
    >
      {label ? (
        <Typography
          as="label"
          htmlFor={inputId}
          variant="label-sm"
          className="vesper-textarea-label"
        >
          <span className="vesper-textarea-label-text">
            {label + (required ? " *" : "")}
          </span>
          {input}
        </Typography>
      ) : (
        input
      )}
      <FormInputMessage
        id={message ? messageId : undefined}
        variant={variant}
        message={message}
      />
    </div>
  );
}
