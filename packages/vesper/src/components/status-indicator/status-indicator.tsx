import type { ElementType } from "react";
import type { Polymorphic } from "@/utils/polymorphic";
import { cn } from "@/utils/cn";
import { Typography } from "@/components/typography/typography";

export const STATUS_INDICATOR_STATES = [
  "queued",
  "progress",
  "error",
  "ready",
  "cancelled",
] as const;

export const STATUS_INDICATOR_VARIANTS = ["default", "badge"] as const;

export type StatusIndicatorState = (typeof STATUS_INDICATOR_STATES)[number];

export type StatusIndicatorVariants =
  (typeof STATUS_INDICATOR_VARIANTS)[number];

export type StatusIndicatorProps<E extends ElementType = "div"> = Polymorphic<
  {
    label: string;
    state: StatusIndicatorState;
    variant?: StatusIndicatorVariants;
    animated?: boolean;
  },
  E,
  "children"
>;

export function StatusIndicator<E extends ElementType = "div">(
  props: StatusIndicatorProps<E>,
) {
  const {
    className,
    label,
    state,
    animated,
    variant = "default",
    as: Component = "div",
    ...rest
  } = props;

  return (
    <Component
      className={cn(
        "vesper-status-indicator",
        `vesper-status-indicator-${variant}`,
        className,
      )}
      {...rest}
    >
      <span
        className={cn(
          "vesper-status-indicator-dot",
          `vesper-status-indicator-dot-${state}`,
          animated && "vesper-status-indicator-dot-animated",
        )}
      />
      <Typography
        className="vesper-status-indicator-label"
        variant="label-xs-mono"
      >
        {label}
      </Typography>
    </Component>
  );
}
