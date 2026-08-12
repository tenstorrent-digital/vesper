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
  /** The initial thumb value (uncontrolled mode). @default props.min */
  defaultValue?: number;
  /** Callback fired as the thumb value changes during interaction. Receives the current value. */
  onValueChange?(value: number): void;
  /** Callback fired when the thumb interaction is completed (e.g., on pointer up). Receives the final value. */
  onValueCommit?(value: number): void;
  /** An accessible `aria-label` attribute for the thumb. */
  thumbAriaLabel: string;
}

/**
 * A single-thumb slider for selecting a numeric value within a range.
 *
 * @param {number} [props.value] - (optional) The controlled value of the slider thumb
 * @param {number} [props.defaultValue] - (optional) The initial thumb value (uncontrolled). @default props.min
 * @param {(value: number) => void} [props.onValueChange] - (optional) Callback fired as the thumb value changes during interaction
 * @param {(value: number) => void} [props.onValueCommit] - (optional) Callback fired when thumb interaction is completed
 * @param {number} [props.min] - (optional) The minimum allowed value. @default 0
 * @param {number} [props.max] - (optional) The maximum allowed value. @default 100
 * @param {number} [props.step] - (optional) The stepping interval. @default 1
 * @param {boolean} [props.showValueLabel] - (optional) Whether to display the value label above the thumb. @default false
 * @param {boolean} [props.showTicks] - (optional) Whether to render tick marks at each step interval. @default false
 * @param {string[]} props.thumbAriaLabel - Accessible label for the slider thumb
 *
 * You may also pass any additional props to the underlying `div` element
 *
 * @example
 * <Slider
 *   min={0}
 *   max={100}
 *   defaultValue={50}
 *   onValueCommit={(value) => console.log(value)}
 * />
 *
 * @example
 * <Slider
 *   min={0}
 *   max={10}
 *   step={1}
 *   showTicks
 *   showValueLabel
 *   value={volume}
 *   onValueChange={setVolume}
 * />
 */
export function Slider(props: SliderProps) {
  const {
    value,
    valueLabel,
    defaultValue,
    onValueChange,
    onValueCommit,
    showValueLabel,
    thumbAriaLabel,
    min = 0,
    ...rest
  } = props;

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
      thumbAriaLabels={[thumbAriaLabel]}
      min={min}
      {...rest}
    />
  );
}
