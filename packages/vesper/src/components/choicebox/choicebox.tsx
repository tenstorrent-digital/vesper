import {
  useImperativeHandle,
  useRef,
  type ChangeEventHandler,
  type ComponentProps,
} from "react";
import { cn } from "@/utils/cn";
import { Typography } from "@/components/typography/typography";
import { Checkmark } from "@/components/icons/icons";

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
  values?: string[];
  defaultValues?: string[];
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
        const checkedProps =
          value !== undefined
            ? { checked: value === option.value }
            : { defaultChecked: defaultValue === option.value };

        return (
          <ChoiceboxItem
            key={option.value}
            option={option}
            required={required}
            disabled={disabled}
            name={name}
            onChange={(e) => {
              if (!onChange) return;
              if (e.target.checked) onChange(option.value);
            }}
            {...checkedProps}
          />
        );
      })}
    </fieldset>
  );
}

function ChoiceboxMultiSelect({
  className,
  values,
  defaultValues,
  onChange,
  options,
  disabled,
  name,
  ref,
  ...props
}: ChoiceboxMultiSelectProps) {
  const innerRef = useRef<HTMLFieldSetElement>(null);
  useImperativeHandle(ref, () => innerRef.current!);

  return (
    <fieldset
      ref={innerRef}
      className={cn("vesper-choicebox", className)}
      {...props}
    >
      {options.map((option) => {
        const checkedProps =
          values !== undefined
            ? { checked: values.includes(option.value) }
            : { defaultChecked: defaultValues?.includes(option.value) };

        return (
          <ChoiceboxItem
            key={option.value}
            multiselect
            option={option}
            disabled={disabled}
            name={name + "[]"}
            onChange={() => {
              if (!onChange) return;
              onChange(
                Array.from(innerRef.current!.querySelectorAll("input"))
                  .filter((v) => v.checked)
                  .map((v) => v.value),
              );
            }}
            {...checkedProps}
          />
        );
      })}
    </fieldset>
  );
}

function ChoiceboxItem({
  option,
  multiselect,
  disabled,
  required,
  name,
  checked,
  defaultChecked,
  onChange,
}: {
  option: ChoiceboxItem;
  multiselect?: boolean;
  required?: boolean;
  disabled?: boolean;
  name: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) {
  const isDisabled = option.disabled || disabled;

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
        type={multiselect ? "checkbox" : "radio"}
        className="vesper-choicebox-input"
        id={option.id}
        name={name}
        required={required}
        disabled={isDisabled}
        onChange={onChange}
        checked={checked}
        defaultChecked={defaultChecked}
      />
      {multiselect ? (
        <div className="vesper-choicebox-input-multi-indicator">
          <Checkmark />
        </div>
      ) : (
        <div className="vesper-choicebox-input-single-indicator" />
      )}
    </label>
  );
}
