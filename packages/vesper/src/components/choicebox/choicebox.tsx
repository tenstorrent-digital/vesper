"use client";

import {
  type ChangeEventHandler,
  type ComponentProps,
  type KeyboardEventHandler,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import { Checkmark } from "@/components/icons/icons";
import { Typography } from "@/components/typography/typography";

import { cn } from "@/utils/cn";

export type ChoiceboxItem = {
  /** The value associated with this option. */
  value: string;
  /** The text label displayed for this option. */
  label: string;
  /** An optional secondary description displayed below the label. */
  description?: string;
  /** When `true`, prevents this option from being selected. */
  disabled?: boolean;
  /** An optional HTML `id` attribute applied to the underlying input element. */
  id?: string;
};

interface ChoiceboxBaseProps extends Omit<
  ComponentProps<"fieldset">,
  "children" | "onChange" | "defaultValue"
> {
  /** The name attribute shared by all inputs in the group, used for form submission. */
  name: string;
  /** The list of options to render. */
  options: ChoiceboxItem[];
  /** When `true`, disables all options in the group, preventing interaction. */
  disabled?: boolean;
}

export interface ChoiceboxSingleSelectProps extends ChoiceboxBaseProps {
  /** When `false` or omitted, the choicebox operates in single-select (radio) mode. */
  multiselect?: false;
  /** When `true`, a selection is required for form validation. */
  required?: boolean;
  /** The currently selected value (controlled mode). */
  value?: string;
  /** The initially selected value (uncontrolled mode). */
  defaultValue?: string;
  /** Callback fired when the selected value changes. Receives the newly selected value. */
  onChange?(value: string): void;
}

export interface ChoiceboxMultiSelectProps extends ChoiceboxBaseProps {
  /** When `true`, the choicebox operates in multi-select (checkbox) mode. */
  multiselect: true;
  /** The currently selected values (controlled mode). */
  values?: string[];
  /** The initially selected values (uncontrolled mode). */
  defaultValues?: string[];
  /** Callback fired when the selected values change. Receives the full array of currently selected values. */
  onChange?(values: string[]): void;
  /** The minimum number of selections required for form validation. Defaults to `0`. */
  min?: number;
  /** The maximum number of selections allowed for form validation. Defaults to `Infinity`. */
  max?: number;
}

export type ChoiceboxProps =
  | ChoiceboxSingleSelectProps
  | ChoiceboxMultiSelectProps;

/**
 * A selection component that renders a group of card-style options.
 * Supports both single-select (radio) and multi-select (checkbox) modes.
 *
 * @example
 * // Single select
 * const [plan, setPlan] = useState("free")
 * <Choicebox
 *   name="plan"
 *   value={plan}
 *   options={[
 *     { value: "free", label: "Free", description: "Basic features" },
 *     { value: "pro", label: "Pro", description: "All features" },
 *   ]}
 *   onChange={setPlan}
 * />
 *
 * @example
 * // Multi-select with min/max constraints
 * <Choicebox
 *   multiselect
 *   name="features"
 *   min={1}
 *   max={3}
 *   options={[
 *     { value: "sso", label: "SSO" },
 *     { value: "2fa", label: "2FA" },
 *     { value: "audit", label: "Audit logs" },
 *   ]}
 *   onChange={(values) => console.log(values)}
 * />
 */
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  multiselect,
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
  min = 0,
  max = Infinity,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  multiselect,
  ...props
}: ChoiceboxMultiSelectProps) {
  const innerRef = useRef<HTMLFieldSetElement>(null);
  useImperativeHandle(ref, () => innerRef.current!);

  useEffect(() => {
    if (!innerRef.current) return;
    setMinMaxValidity(getCheckboxes(innerRef.current), min, max);
  }, [min, max]);

  /**
   * Mimic the keyboard accessibility of single-select (group of radio inputs)
   * - ArrowLeft/ArrowDown moves focus forwards to the next input
   * - ArrowRight/ArrowUp moves focus back to the previous input
   * - disabled inputs are skipped
   * - moving back/forward at the first/last inputs loops around
   */
  const handleKeyDown: KeyboardEventHandler<HTMLFieldSetElement> = useCallback(
    (e) => {
      if (
        !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        return;
      }

      const inputs = Array.from(
        innerRef.current!.querySelectorAll<HTMLInputElement>(
          ".vesper-choicebox-input:not(:disabled)",
        ),
      );

      const currentIndex = inputs.indexOf(e.target as HTMLInputElement);
      if (currentIndex === -1) return;

      e.preventDefault();

      const direction = ["ArrowDown", "ArrowRight"].includes(e.key) ? 1 : -1;

      const nextIndex =
        (currentIndex + direction + inputs.length) % inputs.length;

      inputs[nextIndex]?.focus();
    },
    [],
  );

  return (
    <fieldset
      ref={innerRef}
      className={cn("vesper-choicebox", className)}
      onKeyDown={handleKeyDown}
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
            name={name}
            onChange={() => {
              const checkboxes = getCheckboxes(innerRef.current!);
              setMinMaxValidity(checkboxes, min, max);

              if (!onChange) return;
              onChange(checkboxes.filter((v) => v.checked).map((v) => v.value));
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
        value={option.value}
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

function getCheckboxes(ref: HTMLFieldSetElement) {
  return Array.from(
    ref.querySelectorAll<HTMLInputElement>(".vesper-choicebox-input"),
  );
}

function setMinMaxValidity(
  checkboxes: HTMLInputElement[],
  min: number,
  max: number,
) {
  if (checkboxes.length === 0) return;

  const numChecked = checkboxes.filter((c) => c.checked).length;

  if (numChecked < min) {
    checkboxes[0]!.setCustomValidity(
      `Please select at least ${min} ${min === 1 ? "item" : "items"}`,
    );
    return;
  }

  if (numChecked > max) {
    checkboxes[0]!.setCustomValidity(`Please select ${max} or fewer items`);
    return;
  }

  checkboxes[0]!.setCustomValidity("");
}
