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
  | "thumbAriaLabels"
> {
  value?: number;
  valueLabel?: string;
  showValueLabel?: boolean;
  defaultValue?: number;
  onValueChange?(value: number): void;
  onValueCommit?(value: number): void;
  showTicks?: boolean;
  thumbAriaLabel?: string;
}

export function Slider({
  value,
  valueLabel,
  defaultValue,
  onValueChange,
  onValueCommit,
  showValueLabel,
  thumbAriaLabel,
  min = 0,
  ...props
}: SliderProps) {
  const handleValueChange = useCallback(
    ([value]: number[]) => onValueChange?.(value!),
    [onValueChange],
  );

  const handleValueCommit = useCallback(
    ([value]: number[]) => onValueCommit?.(value!),
    [onValueCommit],
  );

  return (
    <Range
      values={typeof value === "number" ? [value] : undefined}
      valueLabels={typeof valueLabel === "string" ? [valueLabel] : undefined}
      defaultValues={typeof defaultValue === "number" ? [defaultValue] : [min]}
      showValueLabels={showValueLabel}
      onValuesChange={handleValueChange}
      onValuesCommit={handleValueCommit}
      thumbAriaLabels={
        typeof thumbAriaLabel === "string" ? [thumbAriaLabel] : undefined
      }
      min={min}
      {...props}
    />
  );
}
