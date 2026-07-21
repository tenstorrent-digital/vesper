import type { ElementType } from "react";

import { Typography } from "@/components/typography/typography";

import { cn } from "@/utils/cn";
import type { Polymorphic } from "@/utils/polymorphic";

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
    /** The text label displayed next to the status dot. */
    label: string;
    /** The current status state, which determines the color of the indicator dot. */
    state: StatusIndicatorState;
    /** The visual style variant of the status indicator. Defaults to `"default"`. */
    variant?: StatusIndicatorVariants;
    /** When `true`, applies a pulsing animation to the status dot. */
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
        as="span"
        className="vesper-status-indicator-label"
        variant="label-xs-mono"
      >
        {label}
      </Typography>
    </Component>
  );
}
