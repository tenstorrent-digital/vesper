"use client";

import {
  type ComponentProps,
  MouseEvent,
  type ReactNode,
  type RefObject,
  useId,
  useImperativeHandle,
  useState,
} from "react";
import { Select } from "@base-ui/react/select";

import { Chip, ChipSize } from "@/components/chip/chip";
import {
  CaretDown,
  CaretUp,
  Checkmark,
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
import { getPortalContainer } from "@/utils/getPortalContainer";
import { useBaseRemSize } from "@/utils/useBaseRemSize";
import { useInputMask } from "@/utils/useInputMask";

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
  /** The size of the text input. Affects padding and typography. @default md */
  size?: TextInputSize;
  /** The visual variant of the text input, which determines its color scheme and message icon. @default default */
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
    iconLeft?: never;
    iconLeftOnClick?: never;
    iconLeftAriaLabel?: never;
    iconRight?: never;
    iconRightOnClick?: never;
    iconRightAriaLabel?: never;
    prefix?: never;
    mask?: never;
    type?: never;
  } & { [P in InputOnlyPropTypes]?: never };

export type TextInputPrefixProps = {
  ariaLabel?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  defaultValue?: string;
  options: (string | { value: string; label: string })[];
  onChange?(value: string): void;
  width?: number;
};

export type SingleLineTextInputProps = TextInputBaseProps &
  Omit<ComponentProps<"div">, ForwardedPropTypes | "prefix"> &
  Pick<ComponentProps<"input">, ForwardedPropTypes | InputOnlyPropTypes> & {
    /** When false or omitted, renders a single-line `<input>` element. @default false */
    multiline?: false;
    /** A ref forwarded to the underlying `<input>` element for direct DOM access. */
    inputRef?: RefObject<HTMLInputElement | null>;
    height?: never;
    /** An optional icon element rendered to the left of the input field. */
    iconLeft?: ReactNode;
    iconLeftOnClick?(e: MouseEvent<HTMLButtonElement>): void;
    iconLeftAriaLabel?: string;
    /** An optional icon element rendered to the right of the input field. */
    iconRight?: ReactNode;
    /** The HTML input type. Determines the browser's native input behavior and keyboard. @default text */
    iconRightOnClick?(e: MouseEvent<HTMLButtonElement>): void;
    iconRightAriaLabel?: string;
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
    prefix?: TextInputPrefixProps;
    mask?:
      | string
      | {
          format: string;
          replace: RegExp | string | { [key: string]: RegExp };
        };
  };

export type TextInputProps = SingleLineTextInputProps | MultiLineTextInputProps;

const TEXT_INPUT_TYPOGRAPHY: { [S in TextInputSize]: TypographyVariant } = {
  sm: "copy-xs",
  md: "copy-sm",
  lg: "copy-md",
};

/**
 * A form-ready text input component supporting single-line and multiline modes with labels, icons, validation messages, and variants.
 *
 * @param {TextInputSize} [props.size] - (optional) The size of the text input. @default md
 * @param {TextInputVariant} [props.variant] - (optional) The visual variant determining color scheme and message icon. @default default
 * @param {string} [props.label] - (optional) A label displayed above the input
 * @param {string} [props.message] - (optional) A message displayed below the input with a variant-specific icon
 * @param {boolean} [props.multiline] - (optional) When `true`, renders a `<textarea>` instead of an `<input>`. @default false
 * @param {ReactNode} [props.iconLeft] - (optional) An element rendered to the left of the input field (single-line only)
 * @param {ReactNode} [props.iconRight] - (optional) An element rendered to the right of the input field (single-line only)
 * @param {string} [props.type] - (optional) The HTML input type. @default text
 * @param {string} [props.placeholder] - (optional) Placeholder text for the input
 *
 * You may also pass any additional props to the underlying `div` wrapper or input/textarea element
 *
 * @example
 * <TextInput label="Email" name="email" type="email" required />
 *
 * @example
 * <TextInput
 *   variant="error"
 *   message="This field is required"
 *   label="Username"
 *   value={username}
 *   onChange={(e) => setUsername(e.target.value)}
 * />
 *
 * @example
 * <TextInput multiline label="Bio" height={120} maxLength={500} />
 */
export function TextInput(props: TextInputProps) {
  const {
    // component-specific props
    multiline,
    iconLeft,
    iconLeftOnClick,
    iconLeftAriaLabel,
    iconRight,
    iconRightOnClick,
    iconRightAriaLabel,
    inputRef,
    message,
    prefix,
    label,
    type = "text",
    variant = "default",
    size = "md",
    mask,
    // props that may only get forwarded to an input element
    min,
    max,
    multiple,
    pattern,
    list,
    // props that may only get forwarded to a textarea element
    height = 104,
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

  let inputId = useId();
  if (id) inputId = id;

  // If an additional aria-describedby is supplied, this ensures that both ids get used
  const describedBy =
    [ariaDescribedby, message ? messageId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const [innerRef, setInnerRef] = useState<
    HTMLInputElement | HTMLTextAreaElement | null
  >(null);

  useImperativeHandle<
    HTMLInputElement | HTMLTextAreaElement,
    HTMLInputElement | HTMLTextAreaElement
  >(inputRef, () => innerRef!);

  useInputMask(
    innerRef,
    typeof mask === "string"
      ? { mask, replacement: "_" }
      : { mask: mask?.format, replacement: mask?.replace },
  );

  const input = (
    <div className="vesper-text-input-field-wrapper">
      {iconLeft && !multiline && (
        <TextInputIcon
          ariaLabel={iconLeftAriaLabel}
          onClick={iconLeftOnClick}
          disabled={disabled}
        >
          {iconLeft}
        </TextInputIcon>
      )}
      {prefix && !multiline && (
        <TextInputPrefix
          {...prefix}
          disabled={disabled}
          required={required}
          form={form}
          size={size}
        />
      )}
      <Typography
        {...(multiline
          ? {
              as: "textarea",
              style: { height: `${height / 16}rem` },
            }
          : { as: "input", type, list, multiple, pattern, min, max })}
        ref={setInnerRef}
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
      {iconRight && !multiline && (
        <TextInputIcon
          ariaLabel={iconRightAriaLabel}
          onClick={iconRightOnClick}
          disabled={disabled}
        >
          {iconRight}
        </TextInputIcon>
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
          htmlFor={inputId}
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

function TextInputIcon({
  ariaLabel,
  onClick,
  children,
  disabled,
}: {
  ariaLabel?: string;
  onClick?(e: MouseEvent<HTMLButtonElement>): void;
  children: ReactNode;
  disabled?: boolean;
}) {
  if (onClick) {
    return (
      <button
        aria-label={ariaLabel}
        onClick={onClick}
        disabled={disabled}
        type="button"
        className="vesper-text-input-icon"
      >
        {children}
      </button>
    );
  }

  return (
    <span aria-label={ariaLabel} className="vesper-text-input-icon">
      {children}
    </span>
  );
}

const TEXT_INPUT_CHIP_SIZES: { [key in TextInputSize]: ChipSize } = {
  lg: "md",
  md: "md",
  sm: "sm",
};

function TextInputPrefix({
  options,
  defaultValue,
  name,
  onChange,
  value,
  disabled,
  required,
  placeholder,
  form,
  ariaLabel,
  size,
  width,
}: TextInputPrefixProps & {
  disabled?: boolean;
  required?: boolean;
  form?: string;
  size: TextInputSize;
}) {
  const [open, setOpen] = useState(false);
  const [ref, setRef] = useState<HTMLButtonElement | null>(null);
  const portalContainer = getPortalContainer(undefined, ref);

  const baseRemSize = useBaseRemSize();

  const items = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );

  return (
    <Select.Root
      items={items}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => {
        if (next !== null) onChange?.(next);
      }}
      disabled={disabled}
      name={name}
      required={required}
      form={form}
      open={open}
      onOpenChange={setOpen}
    >
      <Select.Trigger
        ref={setRef}
        className="vesper-text-input-prefix"
        disabled={disabled}
        aria-label={ariaLabel}
        render={
          <Chip
            disabled={disabled}
            size={TEXT_INPUT_CHIP_SIZES[size]}
            iconRight={open ? <CaretUp /> : <CaretDown />}
            selected={open}
            variant={open ? "contrast" : "default"}
            aria-pressed={undefined}
            style={
              width
                ? { flexShrink: 0, width: `calc(${width} * (1rem / 16))` }
                : { flexShrink: 0 }
            }
          />
        }
      >
        <Select.Value placeholder={placeholder} />
      </Select.Trigger>
      <Select.Portal container={portalContainer}>
        <Select.Positioner
          side="bottom"
          align="start"
          alignItemWithTrigger={false}
          sideOffset={12 * (baseRemSize / 16)}
        >
          <Select.Popup className="vesper-select-content">
            <Select.List className="vesper-select-viewport">
              {items.map((item) => {
                return (
                  <Select.Item
                    key={item.value}
                    value={item.value}
                    className="vesper-select-item"
                  >
                    <Select.ItemText render={<Typography variant="label-md" />}>
                      {item.label}
                    </Select.ItemText>
                    <Select.ItemIndicator className="vesper-select-item-checkmark">
                      <Checkmark />
                    </Select.ItemIndicator>
                  </Select.Item>
                );
              })}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
