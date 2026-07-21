import { ComponentProps, type CSSProperties, useMemo } from "react";
import {
  Slider as RadixSlider,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "@radix-ui/react-slider";

import { Typography } from "@/components/typography/typography";

import { cn } from "@/utils/cn";

export interface RangeProps extends Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "dir"
> {
  /** The controlled values of the range thumbs. Each entry corresponds to a thumb position. */
  values?: number[];
  /** Custom display labels for each thumb, shown as a tooltip-style label above the thumb. When left blank, defaults to the active values of each thumb. */
  valueLabels?: string[];
  /** Accessible `aria-label` attributes for each thumb. */
  thumbAriaLabels?: string[];
  /** When `true`, displays the value labels above each thumb. */
  showValueLabels?: boolean;
  /** The initial thumb values (uncontrolled mode). Defaults to `[min, max]` */
  defaultValues?: number[];
  /** Callback fired as thumb values change during interaction. Receives the full array of current values. */
  onValuesChange?(value: number[]): void;
  /** Callback fired when a thumb interaction is completed (e.g., on pointer up). Receives the final array of values. */
  onValuesCommit?(value: number[]): void;
  /** When `true`, renders tick marks along the track at each step interval. */
  showTicks?: boolean;
  /** The name attribute applied to the underlying hidden input, used for form submission. */
  name?: string;
  /** When true, prevents interaction. */
  disabled?: boolean;
  /** The minimum allowed value. Defaults to `0`. */
  min?: number;
  /** The maximum allowed value. Defaults to `100`. */
  max?: number;
  /** The stepping interval between selectable values. Defaults to `1`. */
  step?: number;
  /** The minimum number of steps required between thumbs, preventing them from overlapping. Defaults to `1`. */
  minStepsBetweenThumbs?: number;
  /** The `id` of the `<form>` element this input belongs to, allowing association with a form outside the input's DOM hierarchy. */
  form?: string;
}

/**
 * A multi-thumb range slider for selecting a range of values between a min and max.
 * Supports tick marks, value labels, and configurable step intervals.
 *
 * @example
 * // Uncontrolled usage with default values
 * <Range
 *   min={0}
 *   max={100}
 *   defaultValues={[20, 80]}
 *   onValuesChange={(values) => console.log(values)}
 * />
 *
 * @example
 * // Controlled usage with ticks and custom labels
 * const [min, setMin] = useState(20)
 * const [max, setMax] = useState(80)
 *
 * <Range
 *   min={0}
 *   max={80}
 *   step={10}
 *   showTicks
 *   values={[min, max]}
 *   onValuesChange={([nextMin, nextMax]) => {
 *     setMin(nextMin);
 *     setMax(nextMax);
 *   }}
 *   showValueLabels
 *   valueLabels={[
 *     `${min}db`,
 *     `${max}db`,
 *   ]}
 *   thumbAriaLabels={['min volume', 'max volume']}
 * />
 */
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
