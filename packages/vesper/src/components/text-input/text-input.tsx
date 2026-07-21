"use client";

import {
  type ComponentProps,
  type ReactNode,
  type RefObject,
  useId,
} from "react";

import {
  CircleXSolid,
  ErrorSolid,
  InfoSolid,
  SuccessSolid,
  WarningSolid,
} from "@/components/icons/icons";
import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";

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

/**
 * Union of all the prop types that should only be forwarded to an input element
 * */
type InputOnlyPropTypes = "min" | "max" | "multiple" | "pattern" | "list";

interface TextInputBaseProps {
  /** The size of the text input. Affects padding and typography. Defaults to `"lg"`. */
  size?: TextInputSize;
  /** The visual variant of the text input, which determines its color scheme and message icon. Defaults to `"default"`. */
  variant?: TextInputVariant;
  /** An optional message displayed below the input, paired with a variant-specific icon. Also linked to the input via `aria-describedby`. */
  message?: string;
  /** An optional label displayed above the input. The input is associated by nesting; when `id` is provided, it is also associated via `htmlFor`. An asterisk is appended when `required` is `true`. */
  label?: string;
}

export type MultiLineTextInputProps = TextInputBaseProps &
  Omit<ComponentProps<"div">, ForwardedPropTypes> &
  Pick<ComponentProps<"textarea">, ForwardedPropTypes> & {
    /** When `true`, renders a `<textarea>` element instead of an `<input>`. */
    multiline: true;
    /** A ref forwarded to the underlying `<textarea>` element for direct DOM access. */
    inputRef?: RefObject<HTMLTextAreaElement | null>;
    /** The fixed height of the textarea in pixels. */
    height?: number;
    icon?: never;
    type?: never;
  } & { [P in InputOnlyPropTypes]?: never };

export type SingleLineTextInputProps = TextInputBaseProps &
  Omit<ComponentProps<"div">, ForwardedPropTypes> &
  Pick<ComponentProps<"input">, ForwardedPropTypes | InputOnlyPropTypes> & {
    /** When false or omitted, renders a single-line `<input>` element. */
    multiline?: false;
    /** A ref forwarded to the underlying `<input>` element for direct DOM access. */
    inputRef?: RefObject<HTMLInputElement | null>;
    height?: never;
    /** An optional icon element rendered to the left of the input field. */
    icon?: ReactNode;
    /** The HTML input type. Determines the browser's native input behavior and keyboard. Defaults to `"text"`. */
    type?:
      | "text"
      | "email"
      | "password"
      | "url"
      | "tel"
      | "search"
      | "number"
      | "date"
      | "datetime-local"
      | "week"
      | "month"
      | "time";
  };

export type TextInputProps = SingleLineTextInputProps | MultiLineTextInputProps;

const TEXT_INPUT_TYPOGRAPHY: { [S in TextInputSize]: TypographyVariant } = {
  sm: "copy-xs",
  md: "copy-sm",
  lg: "copy-md",
};

const CLEAR_BUTTON_DISABLED_TYPES = [
  "date",
  "datetime-local",
  "week",
  "month",
  "time",
];

/**
 * A versatile text input component supporting single-line and multiline modes,
 * with optional labels, validation messages, icons, and a clear button.
 *
 * @example
 * // Basic single-line input with a label
 * <TextInput label="Email" type="email" placeholder="you@example.com" />
 *
 * @example
 * // Input with an error message
 * <TextInput
 *   label="Username"
 *   variant="error"
 *   message="Username is already taken."
 *   value={username}
 *   onChange={(e) => setUsername(e.target.value)}
 * />
 *
 * @example
 * // Multiline textarea
 * <TextInput
 *   multiline
 *   label="Bio"
 *   height={120}
 *   placeholder="Tell us about yourself..."
 * />
 *
 * @example
 * // Input with a leading icon
 * <TextInput
 *   label="Search"
 *   type="search"
 *   icon={<SearchIcon />}
 *   placeholder="Search..."
 * />
 */
export function TextInput(props: TextInputProps) {
  const {
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
    // props that should get spread onto the wrapper div
    className,
    ...rest
  } = props;

  const messageId = useId();

  // If an additional aria-describedby is supplied, this ensures that both ids get used
  const describedBy =
    [ariaDescribedby, message ? messageId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const input = (
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
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-invalid={ariaInvalid}
        role={role}
        tabIndex={tabIndex}
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
      {!multiline &&
        !readOnly &&
        !CLEAR_BUTTON_DISABLED_TYPES.includes(type) && (
          <button
            type="button"
            className="vesper-text-input-icon"
            aria-label="Clear text input"
            disabled={disabled}
            onClick={(e) => {
              const input = e.currentTarget
                .previousElementSibling as HTMLInputElement;
              fireReactOnChange(input, "");
              input.focus();
            }}
          >
            <CircleXSolid />
          </button>
        )}
    </div>
  );

  return (
    <div
      className={cn(
        "vesper-text-input",
        `vesper-text-input-${size}`,
        `vesper-text-input-${variant}`,
        multiline && "vesper-text-input-multiline",
        className,
      )}
      {...rest}
    >
      {label ? (
        <Typography
          as="label"
          htmlFor={id}
          variant="label-sm"
          className="vesper-text-input-label"
        >
          <span className="vesper-text-input-label-text">
            {label + (required ? " *" : "")}
          </span>
          {input}
        </Typography>
      ) : (
        input
      )}
      {message && (
        <p className="vesper-text-input-message">
          <span className="vesper-text-input-message-icon">
            {variant === "default" && <InfoSolid />}
            {variant === "error" && <ErrorSolid />}
            {variant === "success" && <SuccessSolid />}
            {variant === "warning" && <WarningSolid />}
          </span>
          <Typography
            id={messageId}
            as="span"
            variant="label-xs"
            className="vesper-text-input-message-text"
            aria-live="polite"
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
