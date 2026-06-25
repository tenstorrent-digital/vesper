import { useCallback } from "react";
import { type SliderProps as RadixSliderProps } from "@radix-ui/react-slider";
import { Range } from "@/components/range/range";

interface SliderProps extends Omit<
  RadixSliderProps,
  | "asChild"
  | "value"
  | "defaultValue"
  | "onValueChange"
  | "onValueCommit"
  | "orientation"
> {
  value?: number;
  valueLabel?: string;
  showValueLabel?: boolean;
  defaultValue?: number;
  onValueChange?(value: number): void;
  onValueCommit?(value: number): void;
  showTicks?: boolean;
}

export function Slider({
  value,
  valueLabel,
  defaultValue,
  onValueChange,
  onValueCommit,
  showValueLabel,
  ...props
}: SliderProps) {
  const handleValueChange = useCallback(
    ([value]: number[]) => {
      if (!value) return;
      onValueChange?.(value);
    },
    [onValueChange],
  );

  const handleValueCommit = useCallback(
    ([value]: number[]) => {
      if (!value) return;
      onValueCommit?.(value);
    },
    [onValueCommit],
  );

  return (
    <Range
      values={typeof value === "number" ? [value] : undefined}
      valueLabels={typeof valueLabel === "string" ? [valueLabel] : undefined}
      defaultValues={
        typeof defaultValue === "number" ? [defaultValue] : undefined
      }
      showValueLabels={showValueLabel}
      onValuesChange={handleValueChange}
      onValuesCommit={handleValueCommit}
      {...props}
    />
  );
}
