"use client";

import { type ReactNode, useState } from "react";
import {
  Tooltip as TooltipRoot,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

import { Typography } from "@/components/typography/typography";

import { isSingleReactElement } from "@/utils/isSingleReactElement";
import { useBaseRemSize } from "@/utils/useBaseRemSize";

export const TOOLTIP_SIDES = ["top", "right", "bottom", "left"] as const;

export const TOOLTIP_ALIGNMENTS = ["center", "start", "end"] as const;

export type TooltipSide = (typeof TOOLTIP_SIDES)[number];

export type TooltipAlign = (typeof TOOLTIP_ALIGNMENTS)[number];

export interface TooltipProps {
  /** The content displayed inside the tooltip popup. */
  content: ReactNode;
  /** The preferred side of the trigger to render the tooltip against. @default top */
  side?: TooltipSide;
  /** The distance in pixels from the trigger to the tooltip (in addition to the arrow height). @default 4 */
  sideOffset?: number;
  /** The alignment of the tooltip relative to the trigger along the perpendicular axis. @default center */
  align?: TooltipAlign;
  /** An offset in pixels from the aligned edge of the trigger. @default 0 */
  alignOffset?: number;
  /** Controls the open state of the tooltip (controlled mode). */
  open?: boolean;
  /** Callback fired when the open state changes. Receives the new open state as an argument. */
  onOpenChange?(value: boolean): void;
  /** The duration in milliseconds to wait before showing the tooltip after the pointer enters the trigger. @default 500 */
  delayDuration?: number;
  /** Whether the tooltip is open by default (uncontrolled mode). */
  defaultOpen?: boolean;
  /** The trigger element that the tooltip is attached to. */
  children?: ReactNode;
  /** The maximum width of the tooltip in pixels. Content will wrap if it exceeds this width. @default 240 */
  maxWidth?: number;
}

/**
 * A tooltip popup that displays informational content when hovering or focusing a trigger element.
 *
 * @param {ReactNode} props.content - The content displayed inside the tooltip popup
 * @param {ReactNode} [props.children] - (optional) The trigger element the tooltip attaches to
 * @param {TooltipSide} [props.side] - (optional) The preferred side of the trigger to render the tooltip. @default top
 * @param {number} [props.sideOffset] - (optional) Distance in pixels from the trigger. @default 4
 * @param {TooltipAlign} [props.align] - (optional) Alignment relative to the trigger. @default center
 * @param {number} [props.delayDuration] - (optional) Delay in milliseconds before showing. @default 500
 * @param {number} [props.maxWidth] - (optional) Maximum width of the tooltip in pixels. @default 240
 * @param {boolean} [props.open] - (optional) Controls the open state (controlled)
 * @param {(value: boolean) => void} [props.onOpenChange] - (optional) Callback fired when open state changes
 *
 * @example
 * <Tooltip content="Copy to clipboard">
 *   <IconButton icon={<Copy />} aria-label="Copy" />
 * </Tooltip>
 *
 * @example
 * <Tooltip content="Settings" side="right" delayDuration={200}>
 *   <Button>Hover me</Button>
 * </Tooltip>
 */
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
    sideOffset = 4,
  } = props;

  const [ref, setRef] = useState<HTMLButtonElement | null>(null);

  const baseRemSize = useBaseRemSize();

  /**
   * dialogs render in their own stacking context above the document body,
   * so tooltips that are rendered inside dialogs must portal into the dialog
   * element itself, or else they will render behind the dialog
   */
  const container = ref?.closest("dialog");

  if (!isSingleReactElement(children)) {
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
        <TooltipTrigger asChild ref={setRef}>
          {children}
        </TooltipTrigger>
        <TooltipPortal container={container}>
          <Typography
            variant="label-xs"
            className="vesper-tooltip"
            style={{ maxWidth: `calc(${maxWidth} * (1rem / 16))` }}
            as={TooltipContent}
            align={align}
            alignOffset={alignOffset * (baseRemSize / 16)}
            side={side}
            sideOffset={baseRemSize / 2 + sideOffset * (baseRemSize / 16)}
          >
            {content}
            <div className="vesper-tooltip-arrow" />
          </Typography>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  );
}
