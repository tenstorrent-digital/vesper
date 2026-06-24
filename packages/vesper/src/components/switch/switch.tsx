import { ReactNode } from "react";
import {
  type SwitchProps as RadixSwitchProps,
  Switch as RadixSwitch,
  SwitchThumb,
} from "@radix-ui/react-switch";
import { cn } from "@/utils/cn";
import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";

export const SWITCH_SIZES = ["sm", "md"] as const;

export type SwitchSize = (typeof SWITCH_SIZES)[number];

export interface SwitchProps extends Omit<RadixSwitchProps, "asChild"> {
  size?: SwitchSize;
  label?: ReactNode;
}

const SWITCH_TYPOGRAPHY: { [S in SwitchSize]: TypographyVariant } = {
  sm: "label-md",
  md: "label-lg",
};

export function Switch({
  size = "md",
  label,
  className,
  ...props
}: SwitchProps) {
  const switchEl = (
    <RadixSwitch
      className={cn("vesper-switch", `vesper-switch-${size}`, className)}
      {...props}
    >
      <SwitchThumb className="vesper-switch-thumb" />
    </RadixSwitch>
  );

  if (label) {
    return (
      <label className="vesper-switch-label">
        {switchEl}
        <Typography variant={SWITCH_TYPOGRAPHY[size]}>{label}</Typography>
      </label>
    );
  }

  return switchEl;
}
