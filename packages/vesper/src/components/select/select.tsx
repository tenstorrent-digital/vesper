import type { ComponentProps, ReactNode } from "react";
import {
  Select as SelectRoot,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectPortal,
  SelectTrigger,
  SelectViewport,
} from "@radix-ui/react-select";

import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";

export const SELECT_SIZES = ["sm", "md", "lg"] as const;

export type SelectSize = (typeof SELECT_SIZES)[number];

export interface SelectItem {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<
  ComponentProps<"button">,
  "children" | "type"
> {
  icon?: ReactNode;
  size?: SelectSize;
  placeholder?: string;
  options: SelectItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?(value: string): void;
}

const SELECT_TRIGGER_TYPOGRAPHY: { [S in SelectSize]: TypographyVariant } = {
  sm: "copy-xs",
  md: "copy-sm",
  lg: "copy-md",
};

export function Select(props: SelectProps) {
  const {
    className,
    disabled,
    placeholder = "Select an option",
    options,
    value,
    defaultValue,
    onValueChange,
    size = "lg",
    icon,
    ...rest
  } = props;

  const displayedValue =
    (value
      ? options.find((o) => o.value === value)
      : options.find((o) => o.value === defaultValue)
    )?.label || placeholder;

  return (
    <SelectRoot
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
    >
      <SelectTrigger
        className={cn("vesper-select", `vesper-select-${size}`, className)}
        disabled={disabled}
        {...rest}
      >
        {icon && <span className="vesper-select-icon">{icon}</span>}
        <Typography
          as="span"
          variant={SELECT_TRIGGER_TYPOGRAPHY[size]}
          className="vesper-select-displayed-value"
        >
          {displayedValue}
        </Typography>
      </SelectTrigger>
      <SelectPortal>
        <SelectContent>
          <SelectViewport>
            {options.map((o) => (
              <SelectItem value={o.value} key={o.value}>
                <SelectItemText>{o.label}</SelectItemText>
              </SelectItem>
            ))}
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  );
}
