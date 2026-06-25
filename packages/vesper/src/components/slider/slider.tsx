import {
  Slider as RadixSlider,
  type SliderProps as RadixSliderProps,
  SliderTrack,
  SliderRange,
  SliderThumb,
} from "@radix-ui/react-slider";
import { cn } from "@/utils/cn";
import { CSSProperties, useCallback, useMemo } from "react";
import { Typography } from "@/components/typography/typography";

export interface SliderProps extends Omit<
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
  showValueLabels?: boolean;
  defaultValue?: number;
  onValueChange?(value: number): void;
  onValueCommit?(value: number): void;
  showTicks?: boolean;
}

export function Slider({
  className,
  "aria-label": ariaLabel,
  value,
  valueLabel,
  defaultValue,
  onValueChange,
  onValueCommit,
  showTicks,
  showValueLabels,
  min = 0,
  max = 100,
  step = 1,
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

  const numTicks = useMemo(
    () => Math.max(Math.ceil((max - min) / step) - 1, 0),
    [min, max, step],
  );

  return (
    <RadixSlider
      className={cn("vesper-slider", className)}
      value={typeof value === "number" ? [value] : undefined}
      defaultValue={
        typeof defaultValue === "number" ? [defaultValue] : undefined
      }
      onValueChange={handleValueChange}
      onValueCommit={handleValueCommit}
      min={min}
      max={max}
      step={step}
      {...props}
    >
      <SliderTrack className="vesper-slider-track">
        {showTicks &&
          Array.from({ length: numTicks }).map((_, i) => (
            <span key={i} className="vesper-slider-tick" />
          ))}
        <SliderRange className="vesper-slider-range" />
      </SliderTrack>
      <Typography
        as={SliderThumb}
        variant="label-xs"
        className={cn(
          "vesper-slider-thumb",
          showValueLabels && "vesper-slider-thumb-labeled",
        )}
        aria-label={ariaLabel}
        style={
          valueLabel
            ? ({ ["--vesper-thumb-label"]: `"${valueLabel}"` } as CSSProperties)
            : {}
        }
      />
    </RadixSlider>
  );
}
