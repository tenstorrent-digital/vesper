"use client";

import {
  type ComponentProps,
  type ReactNode,
  type Ref,
  useId,
  useMemo,
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
import { useBaseRemSize } from "@/utils/hooks/useBaseRemSize";
import { useMergedRefs } from "@/utils/hooks/useMergedRefs";

import { FormInputWrapper } from "../form-input-wrapper/form-input-wrapper";

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

export interface SelectProps
  extends
    Omit<ComponentProps<"div">, "children" | "defaultValue">,
    Pick<ComponentProps<"button">, "name" | "disabled"> {
  /** An optional icon rendered at the leading edge of the select trigger. */
  icon?: ReactNode;
  /** The size variant of the select trigger. Affects padding, height, and typography. @default md */
  size?: SelectSize;
  /** The visual variant of the select trigger, which determines its color scheme and message icon. @default default */
  variant?: SelectVariant;
  /** An optional message displayed below the input, paired with a variant-specific icon. Also linked to the input via `aria-describedby`. */
  message?: string;
  /** An optional label displayed above the input. An asterisk is appended when `required` is `true`. */
  label?: string;
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
  /** Associates the select with a `<form>` element by its `id`, allowing submission from outside the form */
  form?: string;
  /** Specify the element or shadow root to portal the dropdown into */
  container?: PortalContainer;
  /** A ref forwarded to the underlying select trigger `<button>` element for direct DOM access. */
  triggerRef?: Ref<HTMLButtonElement>;
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
 * @param {SelectVariant} [props.variant] - (optional) The visual variant determining color scheme and message icon. @default default
 * @param {string} [props.placeholder] - (optional) Placeholder text shown when no value is selected. @default Select an option
 * @param {ReactNode} [props.icon] - (optional) An icon rendered at the leading edge of the select trigger
 * @param {string} [props.value] - (optional) The currently selected value for controlled usage
 * @param {string} [props.defaultValue] - (optional) The initial selected value for uncontrolled usage
 * @param {(value: string) => void} [props.onValueChange] - (optional) Callback invoked with the new value whenever the selection changes
 * @param {boolean} [props.required] - (optional) Marks the select as required for form validation
 * @param {PortalContainer} [props.container] - (optional) Specify the element or shadow root to portal the dropdown into
 * @param {Ref<HTMLButtonElement>} [props.triggerRef] - (optional) A ref forwarded to the underlying select trigger `<button>` element
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
    disabled,
    placeholder = "Select an option",
    options,
    value,
    defaultValue,
    onValueChange,
    size = "md",
    variant = "default",
    icon,
    name,
    required,
    form,
    container,
    message,
    label,
    triggerRef,
    "aria-label": ariaLabel = label,
    "aria-describedby": ariaDescribedby,
    "aria-labelledby": ariaLabelledby,
    "aria-invalid": ariaInvalid,
    ref,
    id,
    ...rest
  } = props;

  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null);

  const mergedTriggerRef = useMergedRefs(setTrigger, triggerRef);

  const portalContainer = getPortalContainer(container, trigger);

  const baseRemSize = useBaseRemSize();

  const messageId = useId();

  let inputId = useId();
  if (id) inputId = id;

  // If an additional aria-describedby is supplied, this ensures that both ids get used
  const describedBy =
    [ariaDescribedby, message ? messageId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const items = useMemo(
    () =>
      options.map((option) =>
        typeof option === "string" ? { value: option, label: option } : option,
      ),
    [options],
  );

  return (
    <FormInputWrapper
      variant={variant}
      label={
        label
          ? { text: required ? `${label} *` : label, htmlFor: inputId }
          : undefined
      }
      message={message ? { text: message, id: messageId } : undefined}
      ref={ref}
      className={className}
      {...rest}
    >
      <BaseSelect.Root
        items={items}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(next) => onValueChange?.(next)}
        disabled={disabled}
        name={name}
        required={required}
        form={form}
      >
        <BaseSelect.Trigger
          className={cn(
            "vesper-select",
            `vesper-select-${size}`,
            `vesper-select-${variant}`,
          )}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-describedby={describedBy}
          aria-labelledby={ariaLabelledby}
          aria-invalid={ariaInvalid}
          ref={mergedTriggerRef}
          id={inputId}
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
    </FormInputWrapper>
  );
}
