import {
  Checkbox as RadixCheckbox,
  CheckboxIndicator,
  type CheckboxProps as RadixCheckboxProps,
} from "@radix-ui/react-checkbox";
import { cn } from "@/utils/cn";
import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";
import { Checkmark, Minus } from "@/components/icons/icons";

export const CHECKBOX_SIZES = ["sm", "md"] as const;

export type CheckboxSize = (typeof CHECKBOX_SIZES)[number];

export interface CheckboxProps extends Omit<
  RadixCheckboxProps,
  "asChild" | "children"
> {
  label: string;
  size?: CheckboxSize;
}

const CHECKBOX_TYPOGRAPHY: { [S in CheckboxSize]: TypographyVariant } = {
  sm: "label-md",
  md: "label-lg",
};

export function Checkbox({
  required,
  label,
  size = "md",
  className,
  disabled,
  ...props
}: CheckboxProps) {
  return (
    <label
      className={cn(
        "vesper-checkbox",
        `vesper-checkbox-${size}`,
        disabled && "vesper-checkbox-disabled",
        className,
      )}
    >
      <RadixCheckbox
        className="vesper-checkbox-box"
        required={required}
        disabled={disabled}
        {...props}
      >
        <CheckboxIndicator className="vesper-checkbox-indicator">
          <Checkmark className="vesper-checkbox-checked-icon" />
          <Minus className="vesper-checkbox-indeterminate-icon" />
        </CheckboxIndicator>
      </RadixCheckbox>
      <Typography
        variant={CHECKBOX_TYPOGRAPHY[size]}
        className="vesper-checkbox-label"
        as="span"
      >
        {required ? label + " *" : label}
      </Typography>
    </label>
  );
}
