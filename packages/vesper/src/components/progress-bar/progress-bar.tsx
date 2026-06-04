import type { ComponentProps } from "react";
import { Progress, ProgressIndicator } from "@radix-ui/react-progress";
import { cn } from "@/utils/cn";

export type ProgressBarProps = ComponentProps<"div"> & {
  /** value from `0` to `100` */
  value: number;
  size: "sm" | "md" | "lg";
} & (
    | {
        /** The `default` variant will render the progress bar indicator width as a true percentage representation of `value / 100`. The `steps` variant will clamp the width of the progress bar indicator to the nearest rounded tick value. */
        variant?: "default";
        steps?: never;
      }
    | {
        /** The `default` variant will render the progress bar indicator width as a true percentage representation of `value / 100`. The `steps` variant will clamp the width of the progress bar indicator to the nearest rounded tick value. */
        variant: "steps";
        steps?: number;
      }
  );

export function ProgressBar({
  value,
  variant = "default",
  steps = 10,
  className,
  size,
  ...props
}: ProgressBarProps) {
  const progress = Math.min(Math.max(value, 0), 100);

  return (
    <Progress
      className={cn(
        "vesper-progress-bar",
        `vesper-progress-bar-${size}`,
        className,
      )}
      value={progress}
      {...props}
    >
      {variant === "default" && (
        <ProgressBarIndicatorDefault value={progress} />
      )}
      {variant === "steps" && (
        <ProgressBarIndicatorSteps value={progress} steps={steps} />
      )}
    </Progress>
  );
}

function ProgressBarIndicatorDefault({ value }: { value: number }) {
  return (
    <ProgressIndicator
      className="vesper-progress-bar-indicator-default"
      style={{ width: `${value}%` }}
    />
  );
}

function ProgressBarIndicatorSteps({
  value,
  steps,
}: {
  value: number;
  steps: number;
}) {
  const totalSteps = Math.max(Math.floor(steps), 1);
  const stepWidth = 100 / totalSteps;
  const numSteps = Math.round(value / stepWidth);

  let width = `${numSteps * stepWidth}%`;
  if (numSteps > 0 && numSteps !== totalSteps) {
    width = `calc(${width} - 1px)`;
  }

  return (
    <>
      <ProgressIndicator
        className="vesper-progress-bar-indicator-steps"
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
