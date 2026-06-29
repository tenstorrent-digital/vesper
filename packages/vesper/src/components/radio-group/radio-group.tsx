import {
  RadioGroup as RadixRadioGroup,
  type RadioGroupProps as RadixRadioGroupProps,
  RadioGroupItem,
  RadioGroupIndicator,
} from "@radix-ui/react-radio-group";
import { cn } from "@/utils/cn";
import {
  Typography,
  TypographyVariant,
} from "@/components/typography/typography";

export const RADIO_SIZES = ["sm", "md"] as const;

export type RadioSize = (typeof RADIO_SIZES)[number];

export interface RadioGroupProps extends Omit<
  RadixRadioGroupProps,
  "asChild" | "children"
> {
  size?: RadioSize;
  options: {
    value: string;
    label: string;
    disabled?: boolean;
  }[];
}

const RADIO_GROUP_ITEM_TYPOGRAPHY: { [S in RadioSize]: TypographyVariant } = {
  sm: "label-md",
  md: "label-lg",
};

export function RadioGroup({
  className,
  orientation = "vertical",
  options,
  size = "md",
  disabled,
  ...props
}: RadioGroupProps) {
  return (
    <RadixRadioGroup
      className={cn(
        "vesper-radio-group",
        `vesper-radio-group-${orientation}`,
        className,
      )}
      orientation={orientation}
      disabled={disabled}
      {...props}
    >
      {options.map((option) => {
        const optionDisabled = disabled || option.disabled;

        return (
          <label
            data-disabled={optionDisabled}
            className="vesper-radio-group-item-wrapper"
            key={option.value}
          >
            <RadioGroupItem
              disabled={optionDisabled}
              className={cn(
                "vesper-radio-group-item",
                `vesper-radio-group-item-${size}`,
              )}
              value={option.value}
            >
              <RadioGroupIndicator className="vesper-radio-group-item-indicator" />
            </RadioGroupItem>
            <Typography
              as="span"
              variant={RADIO_GROUP_ITEM_TYPOGRAPHY[size]}
              className="vesper-radio-group-item-label"
            >
              {option.label}
            </Typography>
          </label>
        );
      })}
    </RadixRadioGroup>
  );
}
