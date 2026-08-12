"use client";

import { type ComponentProps, type CSSProperties, useMemo } from "react";
import {
  Slider as BaseSlider,
  type SliderThumbState,
} from "@base-ui/react/slider";

import { Typography } from "@/components/typography/typography";

import { cn } from "@/utils/cn";

const toValues = (value: number | number[]) =>
  Array.isArray(value) ? value : [value];

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
  /** The initial thumb values (uncontrolled mode). @default [min, max] */
  defaultValues?: number[];
  /** Callback fired as thumb values change during interaction. Receives the full array of current values. */
  onValuesChange?(value: number[]): void;
  /** Callback fired when a thumb interaction is completed (e.g., on pointer up). Receives the final array of values. */
  onValuesCommit?(value: number[]): void;
  /** When `true`, renders tick marks along the track at each step interval. @default false */
  showTicks?: boolean;
  /** The name attribute applied to the underlying hidden input, used for form submission. */
  name?: string;
  /** When true, prevents interaction. @default false */
  disabled?: boolean;
  /** The minimum allowed value. @default 0 */
  min?: number;
  /** The maximum allowed value. @default 100 */
  max?: number;
  /** The stepping interval between selectable values. @default 1 */
  step?: number;
  /** The minimum number of steps required between thumbs, preventing them from overlapping. @default 1 */
  minStepsBetweenThumbs?: number;
  /** The `id` of the `<form>` element this input belongs to, allowing association with a form outside the input's DOM hierarchy. */
  form?: string;
}

/**
 * A dual-thumb range slider for selecting a numeric range between a minimum and maximum value.
 *
 * @param {number[]} [props.values] - (optional) The controlled values of the range thumbs
 * @param {number[]} [props.defaultValues] - (optional) The initial thumb values (uncontrolled). @default [min, max]
 * @param {(value: number[]) => void} [props.onValuesChange] - (optional) Callback fired as thumb values change during interaction
 * @param {(value: number[]) => void} [props.onValuesCommit] - (optional) Callback fired when thumb interaction is completed
 * @param {number} [props.min] - (optional) The minimum allowed value. @default 0
 * @param {number} [props.max] - (optional) The maximum allowed value. @default 100
 * @param {number} [props.step] - (optional) The stepping interval. @default 1
 * @param {boolean} [props.showTicks] - (optional) Whether to render tick marks at each step interval. @default false
 * @param {boolean} [props.showValueLabels] - (optional) Whether to display value labels above each thumb
 *
 * You may also pass any additional props to the underlying `div` element
 *
 * @example
 * <Range
 *   min={0}
 *   max={100}
 *   defaultValues={[20, 80]}
 *   onValuesCommit={(values) => console.log(values)}
 * />
 *
 * @example
 * <Range
 *   min={0}
 *   max={50}
 *   step={5}
 *   showTicks
 *   showValueLabels
 *   values={range}
 *   onValuesChange={setRange}
 * />
 */
export function Range(props: RangeProps) {
  const {
    className,
    thumbAriaLabels,
    values,
    valueLabels,
    onValuesChange,
    onValuesCommit,
    showTicks = false,
    showValueLabels,
    minStepsBetweenThumbs = 1,
    min = 0,
    max = 100,
    step = 1,
    defaultValues = [min, max],
    ...rest
  } = props;

  const numTicks = useMemo(() => {
    let n = Math.max(Math.ceil((max - min) / step) - 1, 0);
    if (n === Infinity) n = 0;
    return n;
  }, [min, max, step]);

  const tickLeft = useMemo(() => 100 / Math.max(max - min, 0), [min, max]);

  const thumbValues = values ?? defaultValues;

  return (
    <BaseSlider.Root
      className={cn("vesper-range", className)}
      value={values}
      defaultValue={defaultValues}
      onValueChange={(value: number | number[]) =>
        onValuesChange?.(toValues(value))
      }
      onValueCommitted={(value: number | number[]) =>
        onValuesCommit?.(toValues(value))
      }
      min={min}
      max={max}
      step={step}
      minStepsBetweenValues={minStepsBetweenThumbs}
      thumbCollisionBehavior="none"
      {...rest}
    >
      <BaseSlider.Control>
        <BaseSlider.Track className="vesper-range-track">
          {showTicks &&
            Array.from({ length: numTicks }).map((_, i) => (
              <span
                key={i}
                className="vesper-range-tick"
                style={{ left: tickLeft * ((i + 1) * step) + "%" }}
              />
            ))}
          <BaseSlider.Indicator className="vesper-range-range" />
          {thumbValues.map((_, index) => (
            <RangeThumb
              key={index}
              index={index}
              ariaLabel={thumbAriaLabels?.[index]}
              showLabel={showValueLabels}
              label={valueLabels?.[index]}
            />
          ))}
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}

function RangeThumb({
  index,
  showLabel,
  label,
  ariaLabel,
}: {
  index: number;
  showLabel?: boolean;
  label?: string;
  ariaLabel?: string;
}) {
  return (
    <Typography
      as={BaseSlider.Thumb}
      variant="label-xs"
      index={index}
      className={cn(
        "vesper-range-thumb",
        showLabel && "vesper-range-thumb-labeled",
      )}
      aria-label={ariaLabel}
      style={(state: SliderThumbState) =>
        showLabel
          ? ({
              ["--vesper-range-thumb-label"]: `"${label ?? state.values[index]}"`,
            } as CSSProperties)
          : undefined
      }
    />
  );
}
