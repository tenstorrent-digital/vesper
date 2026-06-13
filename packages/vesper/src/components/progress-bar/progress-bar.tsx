import type { ComponentProps } from "react";
import { Progress, ProgressIndicator } from "@radix-ui/react-progress";
import { cn } from "@/utils/cn";

export interface ProgressBarProps extends ComponentProps<"div"> {
  /** value from `0` to `100` */
  value: number;
  size?: "sm" | "md" | "lg";
  /** The `default` variant will render the progress bar indicator width as a true percentage representation of `value / 100`. The `steps` variant will clamp the width of the progress bar indicator to the nearest rounded tick value. */
  variant?: "steps" | "default";
  /** The number of segments to split up the progress bar into when variant is `steps`. Must be an integer greater than `0`. */
  steps?: number;
  /** Determines how to clamp the width of the progress bar to the nearest tick value. Defaults to `Math.round` */
  stepRoundingStrategy?: (n: number) => number;
  /** Whether to animate progress bar value changes */
  animated?: boolean;
}

export function ProgressBar({
  value,
  variant = "default",
  steps = 10,
  className,
  size = "md",
  stepRoundingStrategy,
  animated = false,
  ...props
}: ProgressBarProps) {
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
      {...props}
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
