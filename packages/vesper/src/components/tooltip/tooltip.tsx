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
  content: ReactNode;
  side?: TooltipSide;
  sideOffset?: number;
  align?: TooltipAlign;
  alignOffset?: number;
  open?: boolean;
  onOpenChange?(value: boolean): void;
  delayDuration?: number;
  defaultOpen?: boolean;
  children?: ReactNode;
  maxWidth?: number;
}

export function Tooltip({
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
}: TooltipProps) {
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
