"use client";

import {
  type ComponentProps,
  type ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
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
import { useBaseRemSize } from "@/utils/useBaseRemSize";

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
  /** The size variant of the select trigger. Affects padding, height, and typography. @default md */
  size?: SelectSize;
  /** Placeholder text shown in the trigger when no value is selected. @default Select an option */
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
  /** Specify the element or document fragment to portal the dropdown into */
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
 * @param {SelectItem[]} props.options - The list of selectable options displayed in the dropdown. See {@link SelectItem} for the shape of each option
 * @param {SelectSize} [props.size] - (optional) Size variant of the select trigger. Affects padding, height, and typography. @default md
 * @param {string} [props.placeholder] - (optional) Placeholder text shown when no value is selected. @default Select an option
 * @param {ReactNode} [props.icon] - (optional) An icon rendered at the leading edge of the select trigger
 * @param {string} [props.value] - (optional) The currently selected value for controlled usage
 * @param {string} [props.defaultValue] - (optional) The initial selected value for uncontrolled usage
 * @param {(value: string) => void} [props.onValueChange] - (optional) Callback invoked with the new value whenever the selection changes
 * @param {boolean} [props.required] - (optional) Marks the select as required for form validation
 * @param {Element | DocumentFragment} [props.container] - (optional) Specify the element or document fragment to portal the dropdown into
 * @param {string} [props.name] - (optional) Form field name submitted with form data
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
    size = "md",
    icon,
    name,
    required,
    form,
    container,
    "aria-label": ariaLabel = placeholder,
    ref,
    ...rest
  } = props;

  const [innerRef, setInnerRef] = useState<HTMLButtonElement | null>(null);
  useImperativeHandle(ref, () => innerRef!);

  const portalContainer = getPortalContainer(container, innerRef);

  const baseRemSize = useBaseRemSize();

  return (
    <BaseSelect.Root
      items={options}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => {
        if (next !== null) onValueChange?.(next);
      }}
      disabled={disabled}
      name={name}
      required={required}
      form={form}
    >
      <BaseSelect.Trigger
        className={cn("vesper-select", `vesper-select-${size}`, className)}
        disabled={disabled}
        aria-label={ariaLabel}
        ref={setInnerRef}
        {...rest}
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
          <BaseSelect.Popup className="vesper-select-content">
            <BaseSelect.List className="vesper-select-viewport">
              {options.map((o) => (
                <BaseSelect.Item
                  key={o.value}
                  value={o.value}
                  className="vesper-select-item"
                >
                  <Typography variant="label-md">
                    <BaseSelect.ItemText render={<span />}>
                      {o.label}
                    </BaseSelect.ItemText>
                  </Typography>
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
