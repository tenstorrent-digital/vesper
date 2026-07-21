"use client";

import { useCallback } from "react";

import { Range, type RangeProps } from "@/components/range/range";

interface SliderProps extends Omit<
  RangeProps,
  | "values"
  | "valueLabels"
  | "thumbAriaLabels"
  | "showValueLabels"
  | "defaultValues"
  | "onValuesChange"
  | "onValuesCommit"
  | "minStepsBetweenThumbs"
> {
  /** The controlled value of the slider thumb. */
  value?: number;
  /** A custom display label for the thumb, shown as a tooltip-style label above it. When unset, defaults to the active value of the slider. */
  valueLabel?: string;
  /** When `true`, displays the value label above the thumb. */
  showValueLabel?: boolean;
  /** The initial thumb value (uncontrolled mode). Defaults to `min` */
  defaultValue?: number;
  /** Callback fired as the thumb value changes during interaction. Receives the current value. */
  onValueChange?(value: number): void;
  /** Callback fired when the thumb interaction is completed (e.g., on pointer up). Receives the final value. */
  onValueCommit?(value: number): void;
  /** An accessible `aria-label` attribute for the thumb. */
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
