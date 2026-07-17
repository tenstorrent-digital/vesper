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
  value: string;
  label: string;
  disabled?: boolean;
  id?: string;
};

export interface RadioGroupProps extends Omit<
  ComponentProps<"fieldset">,
  "children" | "onChange" | "defaultValue"
> {
  size?: RadioSize;
  orientation?: RadioGroupOrientation;
  required?: boolean;
  options: RadioGroupItem[];
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?(value: string): void;
}

const RADIO_GROUP_ITEM_TYPOGRAPHY: { [S in RadioSize]: TypographyVariant } = {
  sm: "label-md",
  md: "label-lg",
};

export function RadioGroup({
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
  ...props
}: RadioGroupProps) {
  return (
    <fieldset
      disabled={disabled}
      className={cn(
        "vesper-radio-group",
        `vesper-radio-group-${orientation}`,
        className,
      )}
      {...props}
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
