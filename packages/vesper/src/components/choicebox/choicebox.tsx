import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";
import { Typography } from "@/components/typography/typography";

export type ChoiceboxItem = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  id?: string;
};

interface ChoiceboxBaseProps extends Omit<
  ComponentProps<"fieldset">,
  "children" | "onChange" | "defaultValue"
> {
  name: string;
  options: ChoiceboxItem[];
  disabled?: boolean;
}

export interface ChoiceboxSingleSelectProps extends ChoiceboxBaseProps {
  multiselect?: false;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?(value: string): void;
}

export interface ChoiceboxMultiSelectProps extends ChoiceboxBaseProps {
  multiselect: true;
  value?: string[];
  defaultValue?: string[];
  onChange?(values: string[]): void;
}

export type ChoiceboxProps =
  | ChoiceboxSingleSelectProps
  | ChoiceboxMultiSelectProps;

export function Choicebox(props: ChoiceboxProps) {
  if (props.multiselect) return <ChoiceboxMultiSelect {...props} />;
  return <ChoiceboxSingleSelect {...props} />;
}

function ChoiceboxSingleSelect({
  className,
  value,
  defaultValue,
  onChange,
  options,
  name,
  disabled,
  required,
  ...props
}: ChoiceboxSingleSelectProps) {
  return (
    <fieldset className={cn("vesper-choicebox", className)} {...props}>
      {options.map((option) => {
        const isDisabled = option.disabled || disabled;

        const checkedProps =
          value !== undefined
            ? { checked: value === option.value }
            : { defaultChecked: defaultValue === option.value };

        return (
          <label
            key={option.value}
            htmlFor={option.id}
            className={cn(
              "vesper-choicebox-item",
              !option.description && "vesper-choicebox-item-compact",
            )}
          >
            <div>
              <Typography
                variant="copy-sm-bold"
                className="vesper-choicebox-item-label"
              >
                {option.label}
              </Typography>
              {option.description && (
                <Typography
                  variant="copy-xs"
                  className="vesper-choicebox-item-description"
                >
                  {option.description}
                </Typography>
              )}
            </div>
            <input
              id={option.id}
              name={name}
              required={required}
              disabled={isDisabled}
              type="radio"
              className="vesper-choicebox-radio-input"
              onChange={(e) => {
                if (!onChange) return;
                if (e.target.checked) onChange(option.value);
              }}
              {...checkedProps}
            />
            <div className="vesper-choicebox-radio-input-indicator" />
          </label>
        );
      })}
    </fieldset>
  );
}

function ChoiceboxMultiSelect({
  className,
  value,
  defaultValue,
  onChange,
  ...props
}: ChoiceboxMultiSelectProps) {
  return (
    <fieldset
      className={cn("vesper-choicebox", className)}
      {...props}
    ></fieldset>
  );
}
