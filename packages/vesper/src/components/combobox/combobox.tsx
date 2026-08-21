"use client";

import {
  ComponentProps,
  Ref,
  useId,
  useImperativeHandle,
  useState,
} from "react";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";

import {
  CaretDown,
  CaretUp,
  Checkmark,
  Close,
  ErrorSolid,
  InfoSolid,
  Search,
  SuccessSolid,
  WarningSolid,
} from "@/components/icons/icons";
import {
  Typography,
  TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";
import {
  getPortalContainer,
  type PortalContainer,
} from "@/utils/getPortalContainer";
import { useBaseRemSize } from "@/utils/useBaseRemSize";

export const COMBOBOX_SIZES = ["sm", "md", "lg"] as const;

export const COMBOBOX_VARIANTS = [
  "default",
  "warning",
  "success",
  "error",
] as const;

export type ComboboxSize = (typeof COMBOBOX_SIZES)[number];

export type ComboboxVariant = (typeof COMBOBOX_VARIANTS)[number];

const COMBOBOX_TYPOGRAPHY: Record<ComboboxSize, TypographyVariant> = {
  lg: "copy-md",
  md: "copy-sm",
  sm: "copy-xs",
};

export interface ComboboxItem {
  /** The text displayed for this option in the dropdown list, and used to filter options as the user types. */
  label: string;
  /** The underlying value submitted with form data and passed to `onValueChange`. Must be unique across all options. */
  value: string;
}

export interface ComboboxProps extends Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> {
  /** The list of selectable options displayed in the dropdown. Strings are treated as both the label and the value of an option. */
  options: (ComboboxItem | string)[];
  /** When `true`, marks the underlying input as required for form validation and appends an asterisk to the label. */
  required?: boolean;
  /** When `true`, prevents interaction with the input and dropdown. */
  disabled?: boolean;
  /** When `true`, the input's value cannot be edited, but the value is still submitted with form data. */
  readOnly?: boolean;
  /** The size of the combobox. Affects padding and typography. @default md */
  size?: ComboboxSize;
  /** The visual variant of the combobox, which determines its color scheme and message icon. @default default */
  variant?: ComboboxVariant;
  /** The text displayed in the dropdown when no options match the input's value. @default No results */
  emptyStateText?: string;
  /** An optional message displayed below the input, paired with a variant-specific icon. */
  message?: string;
  /** Placeholder text shown in the input when it is empty. @default Search... */
  placeholder?: string;
  /** An optional label displayed above the input. An asterisk is appended when `required` is `true`. */
  label?: string;
  /** The form field name submitted with form data. */
  name?: string;
  /** Associates the combobox with a `<form>` element by its `id`, allowing submission from outside the form. */
  form?: string;
  /** An identifier applied to the underlying form control, used to reference it from form validation errors. */
  id?: string;
  /** Controls the open state of the dropdown (controlled mode). */
  open?: boolean;
  /** Whether the dropdown is open by default (uncontrolled mode). */
  defaultOpen?: boolean;
  /** Callback fired when the open state changes. Receives the new open state as an argument. */
  onOpenChange?(value: boolean): void;
  /** The currently selected value for controlled usage. Pass `null` to represent no selection. */
  value?: string | null;
  /** The initial selected value for uncontrolled usage. */
  defaultValue?: string | null;
  /** Callback invoked with the new value whenever the selection changes, or `null` when the selection is cleared. */
  onValueChange?(value: string | null): void;
  /** The current text displayed in the input for controlled usage. */
  inputValue?: string;
  /** The initial text displayed in the input for uncontrolled usage. */
  defaultInputValue?: string;
  /** Callback invoked with the new text whenever the input's value changes. */
  onInputValueChange?(value: string): void;
  /** Specify the element or shadow root to portal the menu into */
  container?: PortalContainer;
  /** A ref forwarded to the underlying `<input>` element for direct DOM access. */
  inputRef?: Ref<HTMLInputElement>;
}

/**
 * A form-ready, searchable select component that filters a list of options as the user types.
 *
 * @param {(ComboboxItem | string)[]} props.options - The list of selectable options displayed in the dropdown. Strings are treated as both the label and the value of an option. See {@link ComboboxItem} for the shape of each option
 * @param {ComboboxSize} [props.size] - (optional) The size of the combobox. Affects padding and typography. @default md
 * @param {ComboboxVariant} [props.variant] - (optional) The visual variant determining color scheme and message icon. @default default
 * @param {string} [props.label] - (optional) A label displayed above the input
 * @param {string} [props.message] - (optional) A message displayed below the input with a variant-specific icon
 * @param {string} [props.placeholder] - (optional) Placeholder text shown when the input is empty. @default Search...
 * @param {string} [props.emptyStateText] - (optional) Text displayed when no options match the input's value. @default No results
 * @param {string | null} [props.value] - (optional) The currently selected value for controlled usage
 * @param {string | null} [props.defaultValue] - (optional) The initial selected value for uncontrolled usage
 * @param {(value: string | null) => void} [props.onValueChange] - (optional) Callback invoked with the new value whenever the selection changes
 * @param {string} [props.inputValue] - (optional) The current text displayed in the input for controlled usage
 * @param {(value: string) => void} [props.onInputValueChange] - (optional) Callback invoked whenever the input's value changes
 * @param {boolean} [props.required] - (optional) Marks the combobox as required for form validation
 * @param {string} [props.name] - (optional) Form field name submitted with form data
 * @param {PortalContainer} [props.container] - (optional) Specify the element or shadow root to portal the menu into
 *
 * You may also pass any additional props to the underlying `div` wrapper element
 *
 * @example
 * <Combobox
 *   required
 *   name="fruit"
 *   label="Fruit"
 *   options={[
 *     { value: "apple", label: "Apple" },
 *     { value: "banana", label: "Banana" },
 *     { value: "cherry", label: "Cherry" },
 *   ]}
 *   placeholder="e.g. Apple"
 *   onValueChange={(value) => console.log(value)}
 * />
 *
 * @example
 * <Combobox
 *   size="sm"
 *   variant="error"
 *   message="Please select a country"
 *   label="Country"
 *   options={["Canada", "Japan", "Norway"]}
 *   value={country}
 *   onValueChange={setCountry}
 * />
 */
export function Combobox(props: ComboboxProps) {
  const {
    options,
    disabled,
    size = "md",
    variant = "default",
    emptyStateText = "No results",
    placeholder = "Search...",
    className,
    open,
    defaultOpen,
    onOpenChange,
    value,
    defaultValue,
    onValueChange,
    inputValue,
    defaultInputValue,
    onInputValueChange,
    readOnly,
    required,
    name,
    form,
    id,
    container,
    inputRef,
    ref,
    label,
    message,
    "aria-describedby": ariaDescribedby,
    ...rest
  } = props;
  const [innerRef, setInnerRef] = useState<HTMLDivElement | null>(null);
  useImperativeHandle(ref, () => innerRef!);

  const baseRemSize = useBaseRemSize();

  const inputId = useId();

  const messageId = useId();

  // If an additional aria-describedby is supplied, this ensures that both ids get used
  const describedBy =
    [ariaDescribedby, message ? messageId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const items: ComboboxItem[] = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );

  const portalContainer = getPortalContainer(container, innerRef);

  const input = (
    <BaseCombobox.InputGroup className="vesper-combobox-input-wrapper">
      <Search className="vesper-combobox-search-icon" />
      <Typography
        as={BaseCombobox.Input}
        aria-describedby={describedBy}
        id={inputId}
        variant={COMBOBOX_TYPOGRAPHY[size]}
        placeholder={placeholder}
        className="vesper-combobox-input"
      />
      <BaseCombobox.Clear
        className="vesper-combobox-clear"
        aria-label="Clear selection"
      >
        <Close />
      </BaseCombobox.Clear>
      <BaseCombobox.Trigger
        className="vesper-combobox-trigger"
        aria-label="Show options"
      >
        <CaretUp className="vesper-combobox-caret-up" />
        <CaretDown className="vesper-combobox-caret-down" />
      </BaseCombobox.Trigger>
    </BaseCombobox.InputGroup>
  );

  return (
    <BaseCombobox.Root
      items={items}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      inputValue={inputValue}
      defaultInputValue={defaultInputValue}
      onInputValueChange={onInputValueChange}
      disabled={disabled}
      required={required}
      name={name}
      form={form}
      id={id}
      inputRef={inputRef}
      readOnly={readOnly}
    >
      <div
        className={cn(
          "vesper-combobox",
          `vesper-combobox-${size}`,
          `vesper-combobox-${variant}`,
          className,
        )}
        ref={setInnerRef}
        {...rest}
      >
        {label ? (
          <div className="vesper-combobox-label-wrapper">
            <Typography
              as="label"
              variant="label-sm"
              className="vesper-combobox-label"
              htmlFor={inputId}
            >
              {label + (required ? " *" : "")}
            </Typography>
            {input}
          </div>
        ) : (
          input
        )}
        {message && (
          <p className="vesper-combobox-message">
            <span className="vesper-combobox-message-icon">
              {variant === "default" && <InfoSolid />}
              {variant === "error" && <ErrorSolid />}
              {variant === "success" && <SuccessSolid />}
              {variant === "warning" && <WarningSolid />}
            </span>
            <Typography
              id={messageId}
              as="span"
              variant="label-xs"
              className="vesper-combobox-message-text"
              aria-live="polite"
            >
              {message}
            </Typography>
          </p>
        )}
      </div>
      <BaseCombobox.Portal container={portalContainer}>
        <BaseCombobox.Positioner
          side="bottom"
          collisionAvoidance={{ side: "none" }}
          align="start"
          sideOffset={12 * (baseRemSize / 16)}
        >
          <BaseCombobox.Popup className="vesper-combobox-content">
            <BaseCombobox.Empty>
              <Typography
                className="vesper-combobox-empty-state"
                variant="label-md"
              >
                {emptyStateText}
              </Typography>
            </BaseCombobox.Empty>
            <BaseCombobox.List className="vesper-combobox-viewport">
              {(item: ComboboxItem) => (
                <BaseCombobox.Item
                  key={item.value}
                  value={item}
                  className="vesper-combobox-item"
                >
                  <Typography as="span" variant="label-md">
                    {item.label}
                  </Typography>
                  <BaseCombobox.ItemIndicator>
                    <Checkmark className="vesper-combobox-item-checkmark" />
                  </BaseCombobox.ItemIndicator>
                </BaseCombobox.Item>
              )}
            </BaseCombobox.List>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  );
}
