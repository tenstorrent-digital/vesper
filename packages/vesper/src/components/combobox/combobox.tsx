"use client";

import { useCallback, useMemo, useState } from "react";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";

import { CaretDown, Checkmark, Close, Search } from "@/components/icons/icons";
import {
  Typography,
  TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";
import {
  getPortalContainer,
  type PortalContainer,
} from "@/utils/getPortalContainer";
import { useBaseRemSize } from "@/utils/hooks/useBaseRemSize";
import {
  type FormInputProps,
  splitFormInputProps,
} from "@/utils/splitFormInputProps";

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

export interface ComboboxProps extends FormInputProps<
  "div",
  "input",
  "value" | "defaultValue" | "multiple"
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
  /** Placeholder text shown in the input when it is empty. @default Search... */
  placeholder?: string;
  /** The form field name submitted with form data. */
  name?: string;
  /** Associates the combobox with a `<form>` element by its `id`, allowing submission from outside the form. */
  form?: string;
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

  /** Accessible label for the button that clears the currently selected value. @default Clear selection */
  clearButtonAriaLabel?: string;
  /** Accessible label for the button that opens the dropdown. @default Show options */
  dropdownTriggerAriaLabel?: string;
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
    size = "md",
    variant = "default",
    emptyStateText = "No results",
    clearButtonAriaLabel = "Clear selection",
    dropdownTriggerAriaLabel = "Show options",
    className,
    open,
    defaultOpen,
    onOpenChange,
    onValueChange,
    inputValue,
    defaultInputValue,
    onInputValueChange,
    container,
    placeholder = "Search...",
    ...rest
  } = props;

  const { ariaProps, controlProps, formProps, wrapperProps } =
    splitFormInputProps(rest);

  const [innerRef, setInnerRef] = useState<HTMLDivElement | null>(null);

  const baseRemSize = useBaseRemSize();

  const { values, labels } = useMemo(() => {
    const labels: Map<string, string> = new Map();
    const values: string[] = [];

    for (const option of options) {
      if (typeof option === "string") {
        values.push(option);
        labels.set(option, option);
        continue;
      }
      values.push(option.value);
      labels.set(option.value, option.label);
    }

    return { values, labels };
  }, [options]);

  const itemToStringLabel = useCallback(
    (itemValue: string) => labels.get(itemValue) ?? itemValue,
    [labels],
  );

  const portalContainer = getPortalContainer(container, innerRef);

  const handleValueChange = useCallback(
    (value: string | null) => onValueChange?.(value),
    [onValueChange],
  );

  return (
    <BaseCombobox.Root
      {...formProps}
      items={values}
      itemToStringLabel={itemToStringLabel}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      onValueChange={handleValueChange}
      inputValue={inputValue}
      defaultInputValue={defaultInputValue}
      onInputValueChange={onInputValueChange}
    >
      <BaseCombobox.InputGroup
        {...wrapperProps}
        ref={setInnerRef}
        className={cn(
          "vesper-combobox",
          `vesper-combobox-${size}`,
          `vesper-combobox-${variant}`,
          className,
        )}
      >
        <Search className="vesper-combobox-search-icon" />
        <Typography
          {...ariaProps}
          {...controlProps}
          as={BaseCombobox.Input}
          variant={COMBOBOX_TYPOGRAPHY[size]}
          placeholder={placeholder}
          className="vesper-combobox-input"
        />
        <BaseCombobox.Clear
          className="vesper-combobox-clear"
          aria-label={clearButtonAriaLabel}
        >
          <Close />
        </BaseCombobox.Clear>
        <BaseCombobox.Trigger
          className="vesper-combobox-trigger"
          aria-label={dropdownTriggerAriaLabel}
        >
          <CaretDown />
        </BaseCombobox.Trigger>
      </BaseCombobox.InputGroup>
      <BaseCombobox.Portal container={portalContainer}>
        <BaseCombobox.Positioner
          className="vesper-combobox-positioner"
          side="bottom"
          collisionAvoidance={{ side: "none" }}
          align="start"
          sideOffset={12 * (baseRemSize / 16)}
        >
          <BaseCombobox.Popup className="vesper-combobox-popup">
            <BaseCombobox.Empty>
              <Typography
                className="vesper-combobox-empty-state"
                variant="label-md"
              >
                {emptyStateText}
              </Typography>
            </BaseCombobox.Empty>
            <BaseCombobox.List className="vesper-combobox-viewport">
              {(itemValue: string) => (
                <BaseCombobox.Item
                  key={itemValue}
                  value={itemValue}
                  className="vesper-combobox-item"
                >
                  <Typography as="span" variant="label-md">
                    {itemToStringLabel(itemValue)}
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
