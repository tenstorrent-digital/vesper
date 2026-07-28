"use client";

import type { ComponentProps } from "react";

import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";

export const RADIO_SIZES = ["sm", "md"] as const;

export const RADIO_GROUP_ORIENTATIONS = ["horizontal", "vertical"] as const;

export type RadioSize = (typeof RADIO_SIZES)[number];

export type RadioGroupOrientation = (typeof RADIO_GROUP_ORIENTATIONS)[number];

export type RadioGroupItem = {
  /** The value associated with this radio option, used to identify it in selection callbacks. */
  value: string;
  /** The text label displayed next to the radio input. */
  label: string;
  /** When true, prevents this individual option from being selected. @default false */
  disabled?: boolean;
  /** An optional HTML `id` attribute applied to the underlying radio input element. */
  id?: string;
};

export interface RadioGroupProps extends Omit<
  ComponentProps<"fieldset">,
  "children" | "onChange" | "defaultValue"
> {
  /** The size of the radio inputs and their labels. @default md */
  size?: RadioSize;
  /** The layout direction of the radio options. @default vertical */
  orientation?: RadioGroupOrientation;
  /** When `true`, a selection is required for form validation. @default false */
  required?: boolean;
  /** The list of radio options to render. */
  options: RadioGroupItem[];
  /** The name attribute shared by all radio inputs in the group, used for form submission. */
  name: string;
  /** The currently selected value (controlled mode). */
  value?: string;
  /** The initially selected value (uncontrolled mode). */
  defaultValue?: string;
  /** Callback fired when the selected value changes. Receives the newly selected value. */
  onChange?(value: string): void;
}

const RADIO_GROUP_ITEM_TYPOGRAPHY: { [S in RadioSize]: TypographyVariant } = {
  sm: "label-md",
  md: "label-lg",
};

/**
 * A form-ready radio group component for single-value selection from a list of options.
 *
 * @param {string} props.name - The name attribute shared by all radio inputs, used for form submission
 * @param {RadioGroupItem[]} props.options - The list of radio options to render
 * @param {RadioSize} [props.size] - (optional) The size of the radio inputs and labels. Default: `"md"`
 * @param {RadioGroupOrientation} [props.orientation] - (optional) The layout direction of the options. Default: `"vertical"`
 * @param {string} [props.value] - (optional) The currently selected value (controlled)
 * @param {string} [props.defaultValue] - (optional) The initially selected value (uncontrolled)
 * @param {(value: string) => void} [props.onChange] - (optional) Callback fired when the selected value changes
 * @param {boolean} [props.required] - (optional) Marks a selection as required for form validation. @default false
 *
 * You may also pass any additional props to the underlying `fieldset` element
 *
 * @example
 * <RadioGroup
 *   name="color"
 *   options={[
 *     { value: "red", label: "Red" },
 *     { value: "blue", label: "Blue" },
 *     { value: "green", label: "Green" },
 *   ]}
 *   value={color}
 *   onChange={setColor}
 * />
 *
 * @example
 * <RadioGroup
 *   name="size"
 *   size="sm"
 *   orientation="horizontal"
 *   options={sizeOptions}
 *   defaultValue="md"
 * />
 */
export function RadioGroup(props: RadioGroupProps) {
  const {
    size = "md",
    orientation = "vertical",
    required,
    disabled,
    options,
    className,
    name,
    value,
    defaultValue,
    onChange,
    ...rest
  } = props;

  return (
    <fieldset
      disabled={disabled}
      className={cn(
        "vesper-radio-group",
        `vesper-radio-group-${orientation}`,
        className,
      )}
      {...rest}
    >
      {options.map((option) => {
        const isDisabled = disabled || option.disabled;

        const checkedProps =
          value !== undefined
            ? { checked: value === option.value }
            : { defaultChecked: defaultValue === option.value };

        return (
          <label
            key={option.value}
            htmlFor={option.id}
            className={cn(
              "vesper-radio-group-item",
              `vesper-radio-group-item-${size}`,
              isDisabled && "vesper-radio-group-item-disabled",
            )}
          >
            <input
              type="radio"
              name={name}
              required={required}
              disabled={isDisabled}
              id={option.id}
              value={option.value}
              className="vesper-radio-input"
              onChange={(e) => {
                if (!onChange) return;
                if (e.target.checked) onChange(option.value);
              }}
              {...checkedProps}
            />
            <div className="vesper-radio-group-item-indicator" />
            <Typography
              as="span"
              className="vesper-radio-group-item-label"
              variant={RADIO_GROUP_ITEM_TYPOGRAPHY[size]}
            >
              {option.label}
            </Typography>
          </label>
        );
      })}
    </fieldset>
  );
}
