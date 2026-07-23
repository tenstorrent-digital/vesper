import { Fragment, isValidElement, type ReactNode } from "react";
import {
  Tooltip as TooltipRoot,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

import { Typography } from "@/components/typography/typography";

export const TOOLTIP_SIDES = ["top", "right", "bottom", "left"] as const;

export const TOOLTIP_ALIGNMENTS = ["center", "start", "end"] as const;

export type TooltipSide = (typeof TOOLTIP_SIDES)[number];

export type TooltipAlign = (typeof TOOLTIP_ALIGNMENTS)[number];

export interface TooltipProps {
  /** The content displayed inside the tooltip popup. If the content is falsy (null, undefined, empty string, or boolean), the tooltip will not render. */
  content: ReactNode;
  /** The preferred side of the trigger to render the tooltip against. Defaults to `"top"`. */
  side?: TooltipSide;
  /** The distance in pixels from the trigger to the tooltip (in addition to the arrow height). Defaults to `4`. */
  sideOffset?: number;
  /** The alignment of the tooltip relative to the trigger along the perpendicular axis. Defaults to `"center"`. */
  align?: TooltipAlign;
  /** An offset in pixels from the aligned edge of the trigger. Defaults to `0`. */
  alignOffset?: number;
  /** Controls the open state of the tooltip (controlled mode). */
  open?: boolean;
  /** Callback fired when the open state changes. Receives the new open state as an argument. */
  onOpenChange?(value: boolean): void;
  /** The duration in milliseconds to wait before showing the tooltip after the pointer enters the trigger. Defaults to `500`. */
  delayDuration?: number;
  /** Whether the tooltip is open by default (uncontrolled mode). */
  defaultOpen?: boolean;
  /** The trigger element that the tooltip is attached to. */
  children?: ReactNode;
  /** The maximum width of the tooltip in pixels. Content will wrap if it exceeds this width. Defaults to `240`. */
  maxWidth?: number;
}

export function Tooltip(props: TooltipProps) {
  const {
    children,
    content,
    defaultOpen,
    open,
    onOpenChange,
    delayDuration = 500,
    maxWidth = 240,
    align = "center",
    alignOffset = 0,
    side = "top",
    sideOffset: _sideOffset = 4,
  } = props;

  const sideOffset = TOOLTIP_ARROW_HEIGHT + _sideOffset;

  if (!isValidTooltipChild(content) || !isValidTooltipChild(children)) {
    return children;
  }

  return (
    <TooltipProvider>
      <TooltipRoot
        defaultOpen={defaultOpen}
        delayDuration={delayDuration}
        onOpenChange={onOpenChange}
        open={open}
      >
        <TooltipTrigger asChild>
          {isValidElement(children) && children.type !== Fragment ? (
            children
          ) : (
            <span>{children}</span>
          )}
        </TooltipTrigger>
        <Typography
          variant="label-xs"
          className="vesper-tooltip"
          style={{ maxWidth }}
          as={TooltipContent}
          align={align}
          alignOffset={alignOffset}
          side={side}
          sideOffset={sideOffset}
        >
          {content}
          <TooltipArrow />
        </Typography>
      </TooltipRoot>
    </TooltipProvider>
  );
}

/**
 * Checks to see if a `ReactNode` can be rendered with a `Tooltip`. Valid nodes must be numeric or non-empty string values, OR they must be non-nullable and non-boolean values
 * */
const isValidTooltipChild = (node: ReactNode) => {
  return typeof node === "number" || (!!node && typeof node !== "boolean");
};

const TOOLTIP_ARROW_HEIGHT = 8;
const TOOLTIP_ARROW_WIDTH = 14;

function TooltipArrow() {
  return (
    <svg
      width={TOOLTIP_ARROW_WIDTH}
      height={TOOLTIP_ARROW_HEIGHT}
      viewBox={`0 0 ${TOOLTIP_ARROW_WIDTH} ${TOOLTIP_ARROW_HEIGHT}`}
      className="vesper-tooltip-arrow"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={`M 0,0 L ${TOOLTIP_ARROW_WIDTH},0 L ${TOOLTIP_ARROW_WIDTH / 2},${TOOLTIP_ARROW_HEIGHT} z`}
      />
    </svg>
  );
}
