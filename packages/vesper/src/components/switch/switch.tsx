import {
  type SwitchProps as RadixSwitchProps,
  Switch as RadixSwitch,
  SwitchThumb,
} from "@radix-ui/react-switch";
import { cn } from "@/utils/cn";

export const SWITCH_SIZES = ["sm", "md"] as const;

export type SwitchSize = (typeof SWITCH_SIZES)[number];

export interface SwitchProps extends Omit<RadixSwitchProps, "asChild"> {
  size?: SwitchSize;
}

export function Switch({ size = "md", className, ...props }: SwitchProps) {
  return (
    <RadixSwitch
      className={cn("vesper-switch", `vesper-switch-${size}`, className)}
      {...props}
    >
      <SwitchThumb className="vesper-switch-thumb" />
    </RadixSwitch>
  );
}
