"use client";

import { ComponentProps, type CSSProperties, type Ref, useMemo } from "react";
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
  /** The values of each thumb (controlled mode). One thumb is rendered per entry in the array. */
  values?: number[];
  /** Custom display labels for each thumb, shown as a tooltip-style label above the thumb. When left blank, defaults to the active values of each thumb. */
  valueLabels?: string[];
  /** Accessible `aria-label` attributes for each thumb, in the same order as the values. */
  thumbAriaLabels: string[];
  /** When `true`, displays the value labels above each thumb. @default false */
  showValueLabels?: boolean;
  /** The initial thumb values (uncontrolled mode). @default [min, max] */
  defaultValues?: number[];
  /** Callback fired as thumb values change during interaction. Receives the full array of current values. */
  onValuesChange?(value: number[]): void;
  /** Callback fired when a thumb interaction is completed (e.g., on pointer up). Receives the final array of values. */
  onValuesCommit?(value: number[]): void;
  /** When `true`, renders tick marks along the track at each step interval. @default false */
  showTicks?: boolean;
  /** The name attribute applied to each thumb's underlying input, used for form submission. Every thumb submits its value under this name. */
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
  /** A ref forwarded to the wrapping `<div>` element for direct DOM access. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * A multi-thumb range input for selecting a span of numeric values between a minimum and maximum.
 *
 * @param {string[]} props.thumbAriaLabels - Accessible `aria-label` attributes for each thumb, in the same order as the values
 * @param {number[]} [props.values] - (optional) The values of each thumb (controlled). One thumb is rendered per entry
 * @param {number[]} [props.defaultValues] - (optional) The initial thumb values (uncontrolled). @default [min, max]
 * @param {(value: number[]) => void} [props.onValuesChange] - (optional) Callback fired as thumb values change during interaction
 * @param {(value: number[]) => void} [props.onValuesCommit] - (optional) Callback fired when thumb interaction is completed
 * @param {number} [props.min] - (optional) The minimum allowed value. @default 0
 * @param {number} [props.max] - (optional) The maximum allowed value. @default 100
 * @param {number} [props.step] - (optional) The stepping interval. @default 1
 * @param {number} [props.minStepsBetweenThumbs] - (optional) The minimum number of steps required between thumbs. @default 1
 * @param {boolean} [props.showTicks] - (optional) Whether to render tick marks at each step interval. @default false
 * @param {boolean} [props.showValueLabels] - (optional) Whether to display a value label above each thumb. @default false
 * @param {string[]} [props.valueLabels] - (optional) Custom display labels for each thumb, falling back to that thumb's current value
 * @param {boolean} [props.disabled] - (optional) Whether to prevent interaction. @default false
 * @param {string} [props.name] - (optional) The form field name each thumb submits its value under
 *
 * You may also pass any additional props to the underlying `div` element
 *
 * @example
 * <Range
 *   min={0}
 *   max={100}
 *   defaultValues={[20, 80]}
 *   onValuesCommit={(values) => console.log(values)}
 *   thumbAriaLabels={["Volume (min)", "Volume (max)"]}
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
 *   thumbAriaLabels={["Volume (min)", "Volume (max)"]}
 * />
 *
 * @example
 * <Range
 *   variant="error"
 *   values={price}
 *   onValuesChange={setPrice}
 *   thumbAriaLabels={["Price (min)", "Price (max)"]}
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
    disabled,
    name,
    form,
    defaultValues = [min, max],
    ...rest
  } = props;

  const tickPositions = useMemo(() => {
    if (!showTicks) return [];

    const span = max - min;
    if (
      !Number.isFinite(span) ||
      !Number.isFinite(step) ||
      span <= 0 ||
      step <= 0
    ) {
      return [];
    }

    const numTicks = Math.max(Math.ceil(span / step) - 1, 0);

    return Array.from({ length: numTicks }, (_, i) => ((i + 1) * step) / span);
  }, [min, max, step, showTicks]);

  const thumbValues = values ?? defaultValues;

  return (
    <BaseSlider.Root
      {...rest}
      role="group"
      className={cn(
        "vesper-range",
        showValueLabels && "vesper-range-labeled",
        className,
      )}
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
      disabled={disabled}
      name={name}
      form={form}
      minStepsBetweenValues={minStepsBetweenThumbs}
      thumbAlignment="edge"
      thumbCollisionBehavior="none"
    >
      <BaseSlider.Control>
        <BaseSlider.Track className="vesper-range-track">
          {showTicks &&
            tickPositions.map((position, i) => (
              <span
                key={i}
                className="vesper-range-tick"
                style={
                  {
                    ["--vesper-range-tick-position"]: position,
                  } as CSSProperties
                }
              />
            ))}
          <BaseSlider.Indicator className="vesper-range-range" />
          {thumbValues.map((_, index) => (
            <Typography
              key={index}
              as={BaseSlider.Thumb}
              variant="label-xs"
              index={index}
              className={cn(
                "vesper-range-thumb",
                showValueLabels && "vesper-range-thumb-labeled",
              )}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              aria-label={thumbAriaLabels[index]}
              getAriaValueText={(_, value, index) =>
                valueLabels?.[index] ?? `${value}`
              }
              style={(state: SliderThumbState) => {
                if (!showValueLabels) return {};

                const thumbLabel = `"${valueLabels?.[index] ?? state.values[index]}"`;

                return {
                  ["--vesper-range-thumb-label"]: thumbLabel,
                } as CSSProperties;
              }}
            />
          ))}
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}
