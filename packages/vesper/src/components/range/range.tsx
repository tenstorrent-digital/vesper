import { type CSSProperties, useMemo } from "react";
import {
  Slider as RadixSlider,
  type SliderProps as RadixSliderProps,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "@radix-ui/react-slider";

import { Typography } from "@/components/typography/typography";

import { cn } from "@/utils/cn";

export interface RangeProps extends Omit<
  RadixSliderProps,
  | "asChild"
  | "value"
  | "defaultValue"
  | "onValueChange"
  | "onValueCommit"
  | "orientation"
> {
  values?: number[];
  valueLabels?: string[];
  thumbAriaLabels?: string[];
  showValueLabels?: boolean;
  defaultValues?: number[];
  onValuesChange?(value: number[]): void;
  onValuesCommit?(value: number[]): void;
  showTicks?: boolean;
}

export function Range({
  className,
  thumbAriaLabels,
  values,
  valueLabels,
  onValuesChange,
  onValuesCommit,
  showTicks,
  showValueLabels,
  minStepsBetweenThumbs = 1,
  min = 0,
  max = 100,
  step = 1,
  defaultValues = [min, max],
  ...props
}: RangeProps) {
  const numTicks = useMemo(() => {
    let n = Math.max(Math.ceil((max - min) / step) - 1, 0);
    if (n === Infinity) n = 0;
    return n;
  }, [min, max, step]);

  const tickLeft = useMemo(() => 100 / Math.max(max - min, 0), [min, max]);

  const thumbValues = values ?? defaultValues;

  return (
    <RadixSlider
      className={cn("vesper-range", className)}
      value={values}
      defaultValue={defaultValues}
      onValueChange={onValuesChange}
      onValueCommit={onValuesCommit}
      min={min}
      max={max}
      step={step}
      minStepsBetweenThumbs={minStepsBetweenThumbs}
      {...props}
    >
      <SliderTrack className="vesper-range-track">
        {showTicks &&
          Array.from({ length: numTicks }).map((_, i) => (
            <span
              key={i}
              className="vesper-range-tick"
              style={{ left: tickLeft * ((i + 1) * step) + "%" }}
            />
          ))}
        <SliderRange className="vesper-range-range" />
      </SliderTrack>
      {thumbValues.map((_, index) => (
        <RangeThumb
          key={index}
          ariaLabel={thumbAriaLabels?.[index]}
          showLabel={showValueLabels}
          label={valueLabels?.[index]}
        />
      ))}
    </RadixSlider>
  );
}

function RangeThumb({
  showLabel,
  label,
  ariaLabel,
}: {
  showLabel?: boolean;
  label?: string;
  ariaLabel?: string;
}) {
  return (
    <Typography
      as={SliderThumb}
      variant="label-xs"
      className={cn(
        "vesper-range-thumb",
        showLabel && "vesper-range-thumb-labeled",
      )}
      aria-label={ariaLabel}
      style={
        label
          ? ({
              ["--vesper-range-thumb-label"]: `"${label}"`,
            } as CSSProperties)
          : {}
      }
    />
  );
}
