import { type CSSProperties, useMemo } from "react";
import {
  Slider as RadixSlider,
  type SliderProps as RadixSliderProps,
  SliderTrack,
  SliderRange,
  SliderThumb,
} from "@radix-ui/react-slider";
import { cn } from "@/utils/cn";
import { Typography } from "@/components/typography/typography";

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
  showValueLabels?: boolean;
  defaultValues?: number[];
  onValuesChange?(value: number[]): void;
  onValuesCommit?(value: number[]): void;
  showTicks?: boolean;
}

export function Range({
  className,
  "aria-label": ariaLabel,
  values,
  valueLabels,
  defaultValues,
  onValuesChange,
  onValuesCommit,
  showTicks,
  showValueLabels,
  minStepsBetweenThumbs = 1,
  min = 0,
  max = 100,
  step = 1,
  ...props
}: RangeProps) {
  const numTicks = useMemo(
    () => Math.max(Math.ceil((max - min) / step) - 1, 0),
    [min, max, step],
  );

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
            <span key={i} className="vesper-range-tick" />
          ))}
        <SliderRange className="vesper-range-range" />
      </SliderTrack>
      {!values?.length && (
        <>
          <RangeThumb
            ariaLabel={ariaLabel}
            showLabel={showValueLabels}
            label={valueLabels?.[0]}
          />
          <RangeThumb
            ariaLabel={ariaLabel}
            showLabel={showValueLabels}
            label={valueLabels?.[1]}
          />
        </>
      )}
      {values?.map((_, index) => (
        <RangeThumb
          key={index}
          ariaLabel={ariaLabel}
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
