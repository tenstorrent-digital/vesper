import type { ComponentProps, ReactNode } from "react";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";

import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";

export const TOGGLE_SIZES = ["sm", "md", "lg"] as const;

export type ToggleSize = (typeof TOGGLE_SIZES)[number];

export type ToggleOption =
  | {
      /** A unique value identifying this toggle option. */
      value: string;
      /** The text label displayed in the toggle option. */
      text: string;
      /** An optional accessible `aria-label` for the toggle option. */
      ariaLabel?: string;
    }
  | {
      /** A unique value identifying this toggle option. */
      value: string;
      /** An icon element displayed in place of text for the toggle option. */
      icon: ReactNode;
      /** A required accessible `aria-label` for icon-only toggle options. */
      ariaLabel: string;
    };

export interface ToggleProps extends Omit<
  ComponentProps<"div">,
  "children" | "dir"
> {
  /** The list of toggle options to render. Each option can display either text or an icon. */
  options: ToggleOption[];
  /** The size of the toggle and its options. Affects padding and typography. @default lg */
  size?: ToggleSize;
  /** The currently selected value (controlled mode). */
  value?: string;
  /** The initially selected value (uncontrolled mode). */
  defaultValue?: string;
  /** Callback fired when the selected value changes. Receives the newly selected value. */
  onValueChange?(value: string): void;
  /** When `true`, disables all toggle options, preventing interaction. @default false */
  disabled?: boolean;
}

const TOGGLE_TYPOGRAPHY: { [S in ToggleSize]: TypographyVariant } = {
  sm: "label-sm",
  md: "label-sm",
  lg: "label-lg",
};

/**
 * A segmented control component for selecting one option from a group of text or icon options.
 *
 * Unlike `Checkbox` (which handles individual boolean selections and indeterminate state) and `Switch` (which presents a binary on/off toggle as a sliding pill), `Toggle` allows selecting one value from a set of mutually exclusive options. For usage in forms, you probably want to use either `Checkbox` or `Switch` instead.
 *
 * @see packages/vesper/src/components/checkbox/checkbox.tsx
 * @see packages/vesper/src/components/switch/switch.tsx
 *
 * @param {ToggleOption[]} props.options - The list of toggle options to render
 * @param {ToggleSize} [props.size] - (optional) The size of the toggle. @default lg
 * @param {string} [props.value] - (optional) The currently selected value (controlled)
 * @param {string} [props.defaultValue] - (optional) The initially selected value (uncontrolled)
 * @param {(value: string) => void} [props.onValueChange] - (optional) Callback fired when the selected value changes
 * @param {boolean} [props.disabled] - (optional) Disables all toggle options. @default false
 *
 * You may also pass any additional props to the underlying `div` element
 *
 * @example
 * <Toggle
 *   options={[
 *     { value: "grid", icon: <Grid />, ariaLabel: "Grid view" },
 *     { value: "list", icon: <List />, ariaLabel: "List view" },
 *   ]}
 *   value={view}
 *   onValueChange={setView}
 * />
 *
 * @example
 * <Toggle
 *   size="sm"
 *   options={[
 *     { value: "day", text: "Day" },
 *     { value: "week", text: "Week" },
 *     { value: "month", text: "Month" },
 *   ]}
 *   defaultValue="week"
 * />
 */
export function Toggle(props: ToggleProps) {
  const { options, className, size = "lg", ...rest } = props;

  return (
    <ToggleGroup
      type="single"
      className={cn("vesper-toggle", `vesper-toggle-${size}`, className)}
      {...rest}
    >
      {options.map((option) => (
        <Typography
          variant={TOGGLE_TYPOGRAPHY[size]}
          as={ToggleGroupItem}
          key={option.value}
          className="vesper-toggle-item"
          value={option.value}
          aria-label={option.ariaLabel}
        >
          {"text" in option ? (
            option.text
          ) : (
            <span className="vesper-toggle-icon">{option.icon}</span>
          )}
        </Typography>
      ))}
    </ToggleGroup>
  );
}
