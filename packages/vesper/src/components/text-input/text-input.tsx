"use client";

import {
  type ComponentProps,
  MouseEvent,
  type ReactNode,
  type Ref,
  useId,
  useState,
} from "react";
import { Select } from "@base-ui/react/select";

import { Chip, ChipSize } from "@/components/chip/chip";
import { FormInputMessage } from "@/components/form-input-message/form-input-message";
import { CaretDown, CaretUp, Checkmark } from "@/components/icons/icons";
import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";
import { getPortalContainer } from "@/utils/getPortalContainer";
import { useBaseRemSize } from "@/utils/useBaseRemSize";

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
  | "onKeyUpCapture"
  | "min"
  | "max"
  | "multiple"
  | "pattern"
  | "list";

export interface TextInputDropdownProps {
  /** An accessible label for the dropdown select trigger, applied via `aria-label`. */
  ariaLabel?: string;
  /** The form field name submitted for the dropdown select's value. */
  name?: string;
  /** The selected value, for controlled usage. Pair with `onChange`. */
  value?: string;
  /** Text displayed in the dropdown select trigger while no value is selected. */
  placeholder?: string;
  /** The initially selected value, for uncontrolled usage. */
  defaultValue?: string;
  /** The selectable options. A string is used as both the option's value and label; use the object form to set them independently. */
  options: (string | { value: string; label: string })[];
  /** Called with the newly selected value whenever the dropdown selection changes. */
  onChange?(value: string): void;
  /** A fixed width for the dropdown select trigger, in pixels (scaled relative to the base rem size). */
  width?: number;
}

export interface TextInputProps
  extends Omit<ComponentProps<"div">, ForwardedPropTypes>,
    Pick<ComponentProps<"input">, ForwardedPropTypes> {
  /** The size of the text input. Affects padding and typography. @default md */
  size?: TextInputSize;
  /** The visual variant of the text input, which determines its color scheme and message icon. @default default */
  variant?: TextInputVariant;
  /** An optional message displayed below the input, paired with a variant-specific icon. Also linked to the input via `aria-describedby`. */
  message?: string;
  /** An optional label displayed above the input. The input is associated by nesting; when `id` is provided, it is also associated via `htmlFor`. An asterisk is appended when `required` is `true`. */
  label?: string;
  /** A ref forwarded to the underlying `<input>` element for direct DOM access. */
  inputRef?: Ref<HTMLInputElement>;
  /** An optional icon element rendered to the left of the input field. */
  iconLeft?: ReactNode;
  /** Optional click handler for the left icon. When provided, the icon is rendered as a `<button>` instead of a `<span>`. */
  iconLeftAction?: {
    /** The click event handler */
    handler(e: MouseEvent<HTMLButtonElement>): void;
    /** An accessible aria-label for the icon */
    ariaLabel: string;
  };
  /** An optional icon element rendered to the right of the input field. */
  iconRight?: ReactNode;
  /** Optional click handler for the right icon. When provided, the icon is rendered as a `<button>` instead of a `<span>`. */
  iconRightAction?: {
    /** The click event handler */
    handler(e: MouseEvent<HTMLButtonElement>): void;
    /** An accessible aria-label for the icon */
    ariaLabel: string;
  };
  /** The HTML input type. Determines the browser's native input behavior and keyboard. @default text */
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
  /** An optional select dropdown rendered before the input field, used to pick a value that qualifies the input (e.g. a country code). Only rendered when `options` is non-empty. */
  dropdown?: TextInputDropdownProps;
}

const TEXT_INPUT_TYPOGRAPHY: { [S in TextInputSize]: TypographyVariant } = {
  sm: "copy-xs",
  md: "copy-sm",
  lg: "copy-md",
};

/**
 * A form-ready text input component supporting labels, icons, validation messages, variants, and leading dropdown select.
 *
 * @param {TextInputSize} [props.size] - (optional) The size of the text input. @default md
 * @param {TextInputVariant} [props.variant] - (optional) The visual variant determining color scheme and message icon. @default default
 * @param {string} [props.label] - (optional) A label displayed above the input
 * @param {string} [props.message] - (optional) A message displayed below the input with a variant-specific icon
 * @param {ReactNode} [props.iconLeft] - (optional) An element rendered to the left of the input field
 * @param {ReactNode} [props.iconRight] - (optional) An element rendered to the right of the input field
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
 */
export function TextInput(props: TextInputProps) {
  const {
    // component-specific props
    iconLeft,
    iconLeftAction,
    iconRight,
    iconRightAction,
    inputRef,
    message,
    dropdown,
    label,
    variant = "default",
    size = "md",
    // props that should get forwarded to the input element
    type = "text",
    min,
    max,
    multiple,
    pattern,
    list,
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
    <div className="vesper-text-input-field-wrapper">
      {iconLeft && (
        <TextInputIcon
          ariaLabel={iconLeftAction?.ariaLabel}
          onClick={iconLeftAction?.handler}
          disabled={disabled}
        >
          {iconLeft}
        </TextInputIcon>
      )}
      {!!dropdown?.options?.length && (
        <TextInputDropdown
          {...dropdown}
          disabled={disabled}
          required={required}
          form={form}
          size={size}
        />
      )}
      <Typography
        className="vesper-text-input-field"
        as="input"
        ref={inputRef}
        variant={TEXT_INPUT_TYPOGRAPHY[size]}
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-invalid={ariaInvalid}
        role={role}
        tabIndex={tabIndex}
        type={type}
        min={min}
        max={max}
        multiple={multiple}
        pattern={pattern}
        list={list}
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
      {iconRight && (
        <TextInputIcon
          ariaLabel={iconRightAction?.ariaLabel}
          onClick={iconRightAction?.handler}
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
        className
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
      <FormInputMessage
        id={message ? messageId : undefined}
        variant={variant}
        message={message}
      />
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

  return <span className="vesper-text-input-icon">{children}</span>;
}

const TEXT_INPUT_CHIP_SIZES: { [key in TextInputSize]: ChipSize } = {
  lg: "md",
  md: "md",
  sm: "sm",
};

function TextInputDropdown({
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
}: TextInputDropdownProps & {
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
    typeof option === "string" ? { value: option, label: option } : option
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
        className="vesper-text-input-dropdown"
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
