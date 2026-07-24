import type { ComponentProps } from "react";
import { Progress, ProgressIndicator } from "@radix-ui/react-progress";

import { cn } from "@/utils/cn";

export const PROGRESS_BAR_SIZES = ["sm", "md", "lg"] as const;

export const PROGRESS_BAR_VARIANTS = ["default", "steps"] as const;

export type ProgressBarSize = (typeof PROGRESS_BAR_SIZES)[number];

export type ProgressBarVariant = (typeof PROGRESS_BAR_VARIANTS)[number];

export interface ProgressBarProps extends ComponentProps<"div"> {
  /** Value from `0` to `100`. */
  value: number;
  /** The rendered size of the progress bar. @default md */
  size?: ProgressBarSize;
  /** The `default` variant will render the progress bar indicator width as a true percentage representation of `value / 100`. The `steps` variant will clamp the width of the progress bar indicator to the nearest rounded tick value. @default default */
  variant?: ProgressBarVariant;
  /** The number of segments to split up the progress bar into when variant is `steps`. Must be an integer greater than `0`. @default 10 */
  steps?: number;
  /** Determines how to clamp the width of the progress bar to the nearest tick value. @default Math.round */
  stepRoundingStrategy?: (n: number) => number;
  /** Whether to animate progress bar value changes. @default false */
  animated?: boolean;
}

/**
 * A progress bar component that visualizes completion percentage, with support for stepped segments and animations.
 *
 * @param {number} props.value - The progress value from `0` to `100`
 * @param {ProgressBarSize} [props.size] - (optional) The rendered size of the progress bar. @default md
 * @param {ProgressBarVariant} [props.variant] - (optional) The display variant; `"steps"` clamps to tick intervals. @default default
 * @param {number} [props.steps] - (optional) Number of segments when variant is `"steps"`. @default 10
 * @param {boolean} [props.animated] - (optional) Whether to animate progress changes. @default false
 *
 * You may also pass any additional props to the underlying `div` element.
 *
 * @example
 * <ProgressBar value={75} />
 *
 * @example
 * <ProgressBar value={60} variant="steps" steps={5} animated />
 */
export function ProgressBar(props: ProgressBarProps) {
  const {
    value,
    variant = "default",
    steps = 10,
    className,
    size = "md",
    stepRoundingStrategy,
    animated = false,
    ...rest
  } = props;

  const progress = Math.min(Math.max(value, 0), 100);

  return (
    <Progress
      className={cn(
        "vesper-progress-bar",
        `vesper-progress-bar-${size}`,
        animated && "vesper-progress-bar-animated",
        className,
      )}
      value={progress}
      {...rest}
    >
      {variant === "default" && (
        <ProgressBarIndicatorDefault value={progress} />
      )}
      {variant === "steps" && (
        <ProgressBarIndicatorSteps
          value={progress}
          steps={steps}
          stepRoundingStrategy={stepRoundingStrategy}
        />
      )}
    </Progress>
  );
}

function ProgressBarIndicatorDefault({ value }: { value: number }) {
  return (
    <ProgressIndicator
      className="vesper-progress-bar-indicator"
      style={{ width: `${value}%` }}
    />
  );
}

function ProgressBarIndicatorSteps({
  value,
  steps,
  stepRoundingStrategy = Math.round,
}: {
  value: number;
  steps: number;
  stepRoundingStrategy?: (n: number) => number;
}) {
  const totalSteps = Math.max(Math.floor(steps), 1);
  const stepWidth = 100 / totalSteps;
  const numSteps = stepRoundingStrategy(value / stepWidth);
  const width = `${numSteps * stepWidth}%`;

  return (
    <>
      <ProgressIndicator
        className="vesper-progress-bar-indicator"
        style={{ width }}
      />
      {Array.from({ length: totalSteps - 1 }).map((_, index) => (
        <span
          key={index}
          className={cn(
            "vesper-progress-bar-tick",
            numSteps !== totalSteps && index >= numSteps - 1
              ? "vesper-progress-bar-tick-dark"
              : "vesper-progress-bar-tick-light",
          )}
        />
      ))}
    </>
  );
}
