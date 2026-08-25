"use client";

import {
  type ComponentProps,
  type CSSProperties,
  Ref,
  useId,
  useMemo,
  useState,
} from "react";
import {
  Slider as BaseSlider,
  type SliderThumbState,
} from "@base-ui/react/slider";

import { FormInputWrapper } from "@/components/form-input-wrapper/form-input-wrapper";
import { Typography } from "@/components/typography/typography";

import { cn } from "@/utils/cn";

const toValues = (value: number | number[]) =>
  Array.isArray(value) ? value : [value];

export const RANGE_VARIANTS = [
  "default",
  "warning",
  "error",
  "success",
] as const;

export type RangeVariant = (typeof RANGE_VARIANTS)[number];

export interface RangeProps extends Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "dir"
> {
  /** The controlled values of the range thumbs. Each entry corresponds to a thumb position. */
  values?: number[];
  /** Custom display labels for each thumb, shown as a tooltip-style label above the thumb. When left blank, defaults to the active values of each thumb. */
  valueLabels?: string[];
  /** Accessible `aria-label` attributes for each thumb. */
  thumbAriaLabels: string[];
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
  /** An optional message displayed below the input, paired with a variant-specific icon. Also linked to the input via `aria-describedby`. */
  message?: string;
  /** An optional label displayed above the input. An asterisk is appended when `required` is `true`. */
  label?: string;
  /** The visual variant of the text input, which determines its message's color scheme and icon. @default default */
  variant?: RangeVariant;
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
 * @param {string[]} props.thumbAriaLabels - Accessible `aria-label` attributes for each thumb
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
    message,
    label,
    "aria-describedby": ariaDescribedby,
    "aria-labelledby": ariaLabelledby,
    "aria-invalid": ariaInvalid,
    variant = "default",
    ...rest
  } = props;

  const tickPositions = useMemo(() => {
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
  }, [min, max, step]);

  const thumbValues = values ?? defaultValues;

  const messageId = useId();

  const [firstThumbRef, setFirstThumbRef] = useState<HTMLInputElement | null>(
    null,
  );

  // If an additional aria-describedby is supplied, this ensures that both ids get used
  const describedBy =
    [ariaDescribedby, message ? messageId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <FormInputWrapper
      label={label ? { text: label, htmlFor: firstThumbRef?.id } : undefined}
      message={message ? { text: message, id: messageId } : undefined}
      variant={variant}
      className={className}
      {...rest}
    >
      <BaseSlider.Root
        className={cn(
          "vesper-range",
          showValueLabels && "vesper-range-labeled",
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
        minStepsBetweenValues={minStepsBetweenThumbs}
        thumbAlignment="edge"
        thumbCollisionBehavior="none"
        aria-invalid={ariaInvalid}
        aria-describedby={describedBy}
        aria-labelledby={ariaLabelledby}
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
              <RangeThumb
                key={index}
                index={index}
                inputRef={index === 0 ? setFirstThumbRef : undefined}
                ariaLabel={thumbAriaLabels[index]}
                showLabel={showValueLabels}
                label={valueLabels?.[index]}
              />
            ))}
          </BaseSlider.Track>
        </BaseSlider.Control>
      </BaseSlider.Root>
    </FormInputWrapper>
  );
}

function RangeThumb({
  index,
  showLabel,
  label,
  ariaLabel,
  inputRef,
}: {
  index: number;
  showLabel?: boolean;
  label?: string;
  ariaLabel?: string;
  inputRef?: Ref<HTMLInputElement>;
}) {
  return (
    <Typography
      inputRef={inputRef}
      as={BaseSlider.Thumb}
      variant="label-xs"
      index={index}
      className={cn(
        "vesper-range-thumb",
        showLabel && "vesper-range-thumb-labeled",
      )}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
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
