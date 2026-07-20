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
  /** The size of the toggle and its options. Affects padding and typography. Defaults to `"lg"`. */
  size?: ToggleSize;
  /** The currently selected value (controlled mode). */
  value?: string;
  /** The initially selected value (uncontrolled mode). */
  defaultValue?: string;
  /** Callback fired when the selected value changes. Receives the newly selected value. */
  onValueChange?(value: string): void;
  /** When `true`, disables all toggle options, preventing interaction. */
  disabled?: boolean;
}

const TOGGLE_TYPOGRAPHY: { [S in ToggleSize]: TypographyVariant } = {
  sm: "label-sm",
  md: "label-sm",
  lg: "label-lg",
};

/**
 * A single-select toggle group that renders a set of mutually exclusive options.
 * Each option can display either a text label or an icon.
 *
 * @example
 * // Text options
 * <Toggle
 *   defaultValue="grid"
 *   options={[
 *     { value: "list", text: "List" },
 *     { value: "grid", text: "Grid" },
 *   ]}
 *   onValueChange={(value) => console.log(value)}
 * />
 *
 * @example
 * // Icon options
 * <Toggle
 *   defaultValue="grid"
 *   options={[
 *     { value: "list", icon: <ListIcon />, ariaLabel: "List view" },
 *     { value: "grid", icon: <GridIcon />, ariaLabel: "Grid view" },
 *   ]}
 *   onValueChange={(value) => console.log(value)}
 * />
 *
 * @example
 * // Controlled usage
 * const [view, setView] = useState("list");
 *
 * <Toggle
 *   value={view}
 *   onValueChange={setView}
 *   options={[
 *     { value: "list", text: "List" },
 *     { value: "grid", text: "Grid" },
 *   ]}
 * />
 */
export function Toggle({
  options,
  className,
  size = "lg",
  ...props
}: ToggleProps) {
  return (
    <ToggleGroup
      type="single"
      className={cn("vesper-toggle", `vesper-toggle-${size}`, className)}
      {...props}
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
