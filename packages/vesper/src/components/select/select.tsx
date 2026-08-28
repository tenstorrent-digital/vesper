"use client";

import { type ReactNode, useMemo, useState } from "react";
import { Select as BaseSelect } from "@base-ui/react/select";

import { CaretDown, CaretUp, Checkmark } from "@/components/icons/icons";
import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";
import {
  getPortalContainer,
  type PortalContainer,
} from "@/utils/getPortalContainer";
import { useBaseRemSize } from "@/utils/hooks/useBaseRemSize";
import { useMergedRefs } from "@/utils/hooks/useMergedRefs";
import {
  FormInputProps,
  splitFormInputProps,
} from "@/utils/splitFormInputProps";

export const SELECT_VARIANTS = [
  "default",
  "warning",
  "error",
  "success",
] as const;

export const SELECT_SIZES = ["sm", "md", "lg"] as const;

export type SelectVariant = (typeof SELECT_VARIANTS)[number];

export type SelectSize = (typeof SELECT_SIZES)[number];

export interface SelectItem {
  /** The underlying value submitted with form data and passed to `onValueChange`. Must be unique across all options. */
  value: string;
  /** The human-readable text displayed for this option in the dropdown list. */
  label: string;
}

export interface SelectProps extends FormInputProps<
  "button",
  "button",
  "value" | "defaultValue"
> {
  /** An optional icon rendered at the leading edge of the select trigger. */
  icon?: ReactNode;
  /** The size variant of the select trigger. Affects padding, height, and typography. @default md */
  size?: SelectSize;
  /** The visual variant of the select trigger, which determines its color scheme and message icon. @default default */
  variant?: SelectVariant;
  /** Placeholder text shown in the trigger when no value is selected. @default Select an option */
  placeholder?: string;
  /** The list of selectable options displayed in the dropdown */
  options: (SelectItem | string)[];
  /** The initial selected value for uncontrolled usage */
  defaultValue?: string | null;
  /** The currently selected value for controlled usage. Pass `null` to represent no selection. */
  value?: string | null;
  /** Callback invoked with the new value whenever the selection changes, or `null` when the selection is cleared. */
  onValueChange?(value: string | null): void;
  /** When `true`, marks the underlying select as required for form validation */
  required?: boolean;
  /** Specify the element or shadow root to portal the dropdown into */
  container?: PortalContainer;
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
 * @param {(SelectItem | string)[]} props.options - The list of selectable options displayed in the dropdown. See {@link SelectItem} for the shape of each option
 * @param {SelectSize} [props.size] - (optional) Size variant of the select trigger. Affects padding, height, and typography. @default md
 * @param {SelectVariant} [props.variant] - (optional) The visual variant determining color scheme and message icon. @default default
 * @param {string} [props.placeholder] - (optional) Placeholder text shown when no value is selected. @default Select an option
 * @param {ReactNode} [props.icon] - (optional) An icon rendered at the leading edge of the select trigger
 * @param {string} [props.value] - (optional) The currently selected value for controlled usage
 * @param {string} [props.defaultValue] - (optional) The initial selected value for uncontrolled usage
 * @param {(value: string) => void} [props.onValueChange] - (optional) Callback invoked with the new value whenever the selection changes
 * @param {boolean} [props.required] - (optional) Marks the select as required for form validation
 * @param {PortalContainer} [props.container] - (optional) Specify the element or shadow root to portal the dropdown into
 * @param {Ref<HTMLButtonElement>} [props.ref] - (optional) A ref forwarded to the select trigger `<button>` element
 * @param {string} [props.name] - (optional) Form field name submitted with form data
 *
 * You may also pass any additional props to the underlying `div` element
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
    options,
    onValueChange,
    size = "md",
    variant = "default",
    icon,
    container,
    placeholder = "Select an option",
    ref,
    ...rest
  } = props;

  const { ariaProps, controlProps, formProps, wrapperProps } =
    splitFormInputProps(rest);

  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null);

  const mergedTriggerRef = useMergedRefs(setTrigger, ref);

  const portalContainer = getPortalContainer(container, trigger);

  const baseRemSize = useBaseRemSize();

  const items = useMemo(
    () =>
      options.map((option) =>
        typeof option === "string" ? { value: option, label: option } : option,
      ),
    [options],
  );

  return (
    <BaseSelect.Root
      {...formProps}
      items={items}
      onValueChange={(next) => onValueChange?.(next)}
    >
      <BaseSelect.Trigger
        {...ariaProps}
        {...wrapperProps}
        {...controlProps}
        ref={mergedTriggerRef}
        className={cn(
          "vesper-select",
          `vesper-select-${size}`,
          `vesper-select-${variant}`,
          className,
        )}
      >
        {icon && <span className="vesper-select-icon">{icon}</span>}
        <Typography as="span" variant={SELECT_TRIGGER_TYPOGRAPHY[size]}>
          <BaseSelect.Value placeholder={placeholder} />
        </Typography>
        <span className="vesper-select-state-indicator">
          <CaretDown className="vesper-select-state-indicator-closed" />
          <CaretUp className="vesper-select-state-indicator-open" />
        </span>
      </BaseSelect.Trigger>
      <BaseSelect.Portal container={portalContainer}>
        <BaseSelect.Positioner
          side="bottom"
          align="start"
          alignItemWithTrigger={false}
          sideOffset={12 * (baseRemSize / 16)}
        >
          <BaseSelect.Popup className="vesper-select-popup">
            <BaseSelect.List className="vesper-select-viewport">
              {items.map((o) => (
                <BaseSelect.Item
                  key={o.value}
                  value={o.value}
                  className="vesper-select-item"
                >
                  <BaseSelect.ItemText
                    render={<Typography variant="label-md" />}
                  >
                    {o.label}
                  </BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator className="vesper-select-item-checkmark">
                    <Checkmark />
                  </BaseSelect.ItemIndicator>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
