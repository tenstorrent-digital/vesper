"use client";

import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";
import {
  FormInputProps,
  splitFormInputProps,
} from "@/utils/splitFormInputProps";

export const SWITCH_SIZES = ["sm", "md"] as const;

export type SwitchSize = (typeof SWITCH_SIZES)[number];

export interface SwitchProps extends FormInputProps<"label", "input"> {
  /** The text label displayed next to the switch. An asterisk is appended when `required` is `true`. */
  label?: string;
  /** The size of the switch and its label. @default md */
  size?: SwitchSize;
}

const SWITCH_TYPOGRAPHY: { [S in SwitchSize]: TypographyVariant } = {
  sm: "label-md",
  md: "label-lg",
};

/**
 * A form-ready toggle switch input with an optional label, supporting controlled and uncontrolled usage.
 *
 * Unlike `Checkbox`, which can render an indeterminate state, `Switch` only allows a binary on/off choice.
 *
 * Related components include `Toggle` (which selects one option from a segmented group) and `Choicebox` (which selects any number of options from a group).
 *
 * @see packages/vesper/src/components/checkbox/checkbox.tsx
 * @see packages/vesper/src/components/toggle/toggle.tsx
 *
 * @param {string} [props.label] - (optional) The text label displayed next to the switch
 * @param {SwitchSize} [props.size] - (optional) The size of the switch and its label. @default md
 * @param {boolean} [props.checked] - (optional) The controlled checked state
 * @param {boolean} [props.defaultChecked] - (optional) The initial checked state (uncontrolled)
 * @param {boolean} [props.disabled] - (optional) Prevents interaction. @default false
 * @param {boolean} [props.required] - (optional) Marks the switch as required for form validation. @default false
 * @param {string} [props.name] - (optional) Form field name submitted with form data
 *
 * You may also pass any additional props to the underlying `label` element
 *
 * @example
 * <Switch label="Enable notifications" name="notifications" />
 *
 * @example
 * <Switch
 *   label="Dark mode"
 *   checked={darkMode}
 *   onChange={(e) => setDarkMode(e.target.checked)}
 * />
 */
export function Switch(props: SwitchProps) {
  const { label, size = "md", className, ...rest } = props;

  const { ariaProps, controlProps, formProps, wrapperProps } =
    splitFormInputProps(rest, "input");

  return (
    <label
      {...wrapperProps}
      className={cn("vesper-switch", `vesper-switch-${size}`, className)}
    >
      <input
        {...ariaProps}
        {...controlProps}
        {...formProps}
        className="vesper-switch-input"
        type="checkbox"
        role="switch"
      />
      <div className="vesper-switch-pill" />
      {label && (
        <Typography
          className="vesper-switch-label"
          variant={SWITCH_TYPOGRAPHY[size]}
        >
          {formProps.required ? `${label} *` : label}
        </Typography>
      )}
    </label>
  );
}
