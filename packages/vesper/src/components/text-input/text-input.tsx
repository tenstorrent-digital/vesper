import type { ComponentProps, ReactNode, RefObject } from "react";
import { cn } from "@/utils/cn";
import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";
import {
  CircleXSolid,
  ErrorSolid,
  InfoSolid,
  SuccessSolid,
  WarningSolid,
} from "@/components/icons/icons";

export const TEXT_INPUT_SIZES = ["sm", "md", "lg"] as const;

export const TEXT_INPUT_VARIANTS = [
  "default",
  "warning",
  "success",
  "error",
] as const;

export type TextInputSize = (typeof TEXT_INPUT_SIZES)[number];

export type TextInputVariant = (typeof TEXT_INPUT_VARIANTS)[number];

/**
 * Union of all the prop types that should be forwarded to the input/textarea element, and excluded from the containing div element
 * */
type ForwardedPropTypes =
  | "min"
  | "max"
  | "multiple"
  | "pattern"
  | "list"
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

interface TextInputBaseProps {
  size?: TextInputSize;
  variant?: TextInputVariant;
  message?: string;
  label?: string;
  icon?: ReactNode;
  type?: "text" | "email" | "password" | "url" | "tel" | "search";
  height?: number;
}

export interface MultiLineTextInputProps
  extends
    TextInputBaseProps,
    Omit<ComponentProps<"div">, ForwardedPropTypes>,
    Pick<ComponentProps<"input">, ForwardedPropTypes> {
  multiline: true;
  inputRef?: RefObject<HTMLTextAreaElement | null>;
}

export interface SingleLineTextInputProps
  extends
    TextInputBaseProps,
    Omit<ComponentProps<"div">, ForwardedPropTypes>,
    Pick<ComponentProps<"input">, ForwardedPropTypes> {
  multiline?: false;
  inputRef?: RefObject<HTMLInputElement | null>;
}

export type TextInputProps = SingleLineTextInputProps | MultiLineTextInputProps;

const TEXT_INPUT_TYPOGRAPHY: { [S in TextInputSize]: TypographyVariant } = {
  sm: "copy-xs",
  md: "copy-sm",
  lg: "copy-md",
};

export function TextInput({
  // component-specific props
  multiline,
  icon,
  inputRef,
  message,
  label,
  type = "text",
  variant = "default",
  size = "lg",
  // props that may only get forwarded to an input element
  min,
  max,
  multiple,
  pattern,
  list,
  // props that may only get forwarded to a textarea element
  height,
  // props that should get forwarded to input & textarea elements
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
  // props that should get spread onto the wrapper div
  className,
  ...props
}: TextInputProps) {
  return (
    <div
      className={cn(
        "vesper-text-input",
        `vesper-text-input-${size}`,
        `vesper-text-input-${variant}`,
        multiline && "vesper-text-input-multiline",
        className,
      )}
      {...props}
    >
      {label && (
        <Typography
          {...(id ? { as: "label", htmlFor: id } : {})}
          variant="label-sm"
          className="vesper-text-input-label"
        >
          {label}
        </Typography>
      )}
      <div className="vesper-text-input-field-wrapper">
        {icon && !multiline && (
          <span className="vesper-text-input-icon">{icon}</span>
        )}
        <Typography
          {...(multiline
            ? { as: "textarea", style: { height } }
            : { as: "input", type, list, multiple, pattern, min, max })}
          ref={inputRef}
          variant={TEXT_INPUT_TYPOGRAPHY[size]}
          className="vesper-text-input-field"
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
          id={id}
          placeholder={placeholder}
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
        {!multiline && (
          <button
            type="button"
            className="vesper-text-input-icon"
            aria-label="Clear text input"
            disabled={disabled}
            onClick={(e) => {
              const input = e.currentTarget.previousElementSibling;
              if (input?.tagName !== "INPUT") return;

              fireReactOnChange(input as HTMLInputElement, "");
              (input as HTMLInputElement).focus();
            }}
          >
            <CircleXSolid />
          </button>
        )}
      </div>
      {message && (
        <p className="vesper-text-input-message">
          <span className="vesper-text-input-message-icon">
            {variant === "default" && <InfoSolid />}
            {variant === "error" && <ErrorSolid />}
            {variant === "success" && <SuccessSolid />}
            {variant === "warning" && <WarningSolid />}
          </span>
          <Typography
            as="span"
            variant="label-xs"
            className="vesper-text-input-message-text"
          >
            {message}
          </Typography>
        </p>
      )}
    </div>
  );
}

/**
 * Trigger a React onChange event programmatically.
 *
 * Simply updating an element's value via JavaScript will not fire the event because React intercepts standard DOM setters to manage form states efficiently.
 * */
function fireReactOnChange(inputElement: HTMLInputElement, newValue: string) {
  // 1. Get the native input value setter from the browser prototype
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  )?.set;

  // 2. Force the value update directly through the native setter
  nativeInputValueSetter?.call(inputElement, newValue);

  // 3. Dispatch a bubbling input event to notify React's Virtual DOM
  const event = new Event("input", { bubbles: true });
  inputElement.dispatchEvent(event);
}
