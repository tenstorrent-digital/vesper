import { ReactNode } from "react";
import {
  ToggleGroup,
  ToggleGroupItem,
  type ToggleGroupSingleProps,
} from "@radix-ui/react-toggle-group";
import { cn } from "@/utils/cn";
import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";

export const TOGGLE_SIZES = ["sm", "md", "lg"] as const;

export type ToggleSize = (typeof TOGGLE_SIZES)[number];

export type ToggleOption =
  | {
      value: string;
      text: string;
      ariaLabel?: string;
    }
  | { value: string; icon: ReactNode; ariaLabel: string };

export interface ToggleProps extends Omit<
  ToggleGroupSingleProps,
  "type" | "disabled"
> {
  options: ToggleOption[];
  size?: ToggleSize;
}

const TOGGLE_TYPOGRAPHY: { [S in ToggleSize]: TypographyVariant } = {
  sm: "label-sm",
  md: "label-sm",
  lg: "label-lg",
};

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
