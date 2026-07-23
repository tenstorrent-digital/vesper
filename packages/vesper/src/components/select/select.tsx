"use client";

import {
  type ComponentProps,
  type ReactNode,
  useImperativeHandle,
  useState,
} from "react";
import {
  Select as SelectRoot,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectPortal,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "@radix-ui/react-select";

import { CaretDown, CaretUp, Checkmark } from "@/components/icons/icons";
import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";

export const SELECT_SIZES = ["sm", "md", "lg"] as const;

export type SelectSize = (typeof SELECT_SIZES)[number];

export interface SelectItem {
  /** The underlying value submitted with form data and passed to `onValueChange`. Must be unique across all options. */
  value: string;
  /** The human-readable text displayed for this option in the dropdown list. */
  label: string;
}

export interface SelectProps extends Omit<
  ComponentProps<"button">,
  "children" | "type"
> {
  /** An optional icon rendered at the leading edge of the select trigger. */
  icon?: ReactNode;
  /** The size variant of the select trigger. Affects padding, height, and typography. Defaults to `"lg"` */
  size?: SelectSize;
  /** Placeholder text shown in the trigger when no value is selected. Defaults to `"Select an option` */
  placeholder?: string;
  /** The list of selectable options displayed in the dropdown */
  options: SelectItem[];
  /** The initial selected value for uncontrolled usage */
  defaultValue?: string;
  /** The currently selected value for controlled usage */
  value?: string;
  /** Callback invoked with the new value whenever the selection changes */
  onValueChange?(value: string): void;
  /** When `true`, marks the underlying select as required for form validation */
  required?: boolean;
  /** Associates the select with a `<form>` element by its `id`, allowing submission from outside the form */
  form?: string;
}

const SELECT_TRIGGER_TYPOGRAPHY: { [S in SelectSize]: TypographyVariant } = {
  sm: "copy-xs",
  md: "copy-sm",
  lg: "copy-md",
};

/**
 * A form-ready dropdown select component, supporting both controlled and uncontrolled usage patterns with options for:
 * - Three size variants: `sm`, `md`, `lg`
 * - An optional leading icon
 * - Automatic portal handling for use inside dialogs
 *
 * @param {SelectItem[]} props.options - The list of selectable options displayed in the dropdown. See {@link SelectItem} for the shape of each option
 * @param {SelectSize=} props.size - (optional) Size variant of the select trigger. Affects padding, height, and typography. Default: `"lg"`
 * @param {string=} props.placeholder - (optional) Placeholder text shown when no value is selected. Default: `"Select an option"`
 * @param {ReactNode} [props.icon] - (optional) An icon rendered at the leading edge of the select trigger
 * @param {string} [props.value] - (optional) The currently selected value for controlled usage
 * @param {string} [props.defaultValue] - (optional) The initial selected value for uncontrolled usage
 * @param {(value: string) => void} [props.onValueChange] - (optional) Callback invoked with the new value whenever the selection changes
 * @param {boolean} [props.required] - (optional) Marks the select as required for form validation
 * @param {string} [props.name] - (optional) Form field name submitted with form data
 * @param {string} [props.className] - (optional) Additional CSS `class` names to apply
 *
 * You may also pass any additional props to the underlying `button` element
 *
 * @example
 * <Select
 *   required
 *   name="fruit"
 *   options={[
 *     { value: "apple", label: "Apple" },
 *     { value: "banana", label: "Banana" },
 *     { value: "cherry", label: "Cherry" },
 *   ]}
 *   placeholder="Pick a fruit"
 *   onValueChange={(value) => console.log(value)}
 * />
 *
 * @example
 * <Select
 *   size="sm"
 *   icon={<ChatSolid />}
 *   options={chatOptions}
 *   value={selectedChatOption}
 *   onValueChange={setSelectedChatOption}
 *   aria-label="Select default chat behavior"
 * />
 */
export function Select(props: SelectProps) {
  const {
    className,
    disabled,
    placeholder = "Select an option",
    options,
    value,
    defaultValue,
    onValueChange,
    size = "lg",
    icon,
    name,
    required,
    form,
    "aria-label": ariaLabel = placeholder,
    ref,
    ...rest
  } = props;

  const [innerRef, setInnerRef] = useState<HTMLButtonElement | null>(null);
  useImperativeHandle(ref, () => innerRef!);

  /**
   * dialogs render in their own stacking context above the document body,
   * so select elements that are rendered inside dialogs must portal into
   * the dialog element itself, or else they will render behind the dialog
   */
  const container = innerRef?.closest("dialog") || document.body;

  return (
    <SelectRoot
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      name={name}
      required={required}
      form={form}
    >
      <SelectTrigger
        className={cn("vesper-select", `vesper-select-${size}`, className)}
        disabled={disabled}
        aria-label={ariaLabel}
        ref={setInnerRef}
        {...rest}
      >
        {icon && <span className="vesper-select-icon">{icon}</span>}
        <Typography as="span" variant={SELECT_TRIGGER_TYPOGRAPHY[size]}>
          <SelectValue placeholder={placeholder} />
        </Typography>
        <span className="vesper-select-state-indicator">
          <CaretDown className="vespers-select-state-indicator-closed" />
          <CaretUp className="vespers-select-state-indicator-open" />
        </span>
      </SelectTrigger>
      <SelectPortal container={container}>
        <SelectContent
          className="vesper-select-content"
          side="bottom"
          sideOffset={12}
          align="start"
          position="popper"
        >
          <SelectViewport className="vesper-select-viewport">
            {options.map((o) => (
              <SelectItem
                key={o.value}
                value={o.value}
                className="vesper-select-item"
              >
                <Typography variant="label-md">
                  <SelectItemText>{o.label}</SelectItemText>
                </Typography>
                <span className="vesper-select-item-checkmark">
                  <Checkmark />
                </span>
              </SelectItem>
            ))}
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  );
}
