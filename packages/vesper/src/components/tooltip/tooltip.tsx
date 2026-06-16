import {
  Tooltip as TooltipRoot,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
  type TooltipProps as RadixTooltipProps,
} from "@radix-ui/react-tooltip";
import { Typography } from "@/components/typography/typography";

export interface TooltipProps extends Omit<
  RadixTooltipProps,
  "disableHoverableContent"
> {
  text: string;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  align?: "center" | "start" | "end";
  alignOffset?: number;
}

export function Tooltip({
  children,
  text,
  defaultOpen,
  delayDuration,
  open,
  onOpenChange,
  align = "center",
  alignOffset = 0,
  side = "top",
  sideOffset: _sideOffset = 4,
}: TooltipProps) {
  const sideOffset = TOOLTIP_ARROW_HEIGHT + _sideOffset;

  return (
    <TooltipProvider>
      <TooltipRoot
        defaultOpen={defaultOpen}
        delayDuration={delayDuration}
        onOpenChange={onOpenChange}
        open={open}
      >
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <Typography
          variant="label-xs"
          className="vesper-tooltip"
          as={TooltipContent}
          align={align}
          alignOffset={alignOffset}
          side={side}
          sideOffset={sideOffset}
        >
          {text}
          <TooltipArrow />
        </Typography>
      </TooltipRoot>
    </TooltipProvider>
  );
}

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
