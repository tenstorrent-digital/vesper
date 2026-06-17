"use client";

import { Tooltip } from "@repo/vesper/tooltip";
import { Typography } from "@repo/vesper/typography";

export function TooltipPreview() {
  return (
    <div className="bg-vesper-stone-50 text-vesper-stone-900 flex flex-col items-start gap-vesper-4 p-vesper-4">
      <Tooltip content="the tooltip text">
        <Typography as="button">hover me to see a tooltip</Typography>
      </Tooltip>
      <Tooltip side="right" content="the tooltip text">
        <Typography as="button">
          hover me to see a tooltip to the side of the trigger
        </Typography>
      </Tooltip>
      <Tooltip
        content="If you do too much it's going to lose its effectiveness. Look around.
      Look at what we have. Beauty is everywhere you only have to look to see
      it."
      >
        <Typography as="button">
          hover me to see a tooltip with a lot of text
        </Typography>
      </Tooltip>
      <Tooltip
        side="bottom"
        content="If you do too much it's going to lose its effectiveness. Look around.
      Look at what we have. Beauty is everywhere you only have to look to see
      it."
      >
        <Typography as="button">
          hover me to see a tooltip below the trigger
        </Typography>
      </Tooltip>
      <Tooltip
        align="start"
        content="If you do too much it's going to lose its effectiveness. Look around.
      Look at what we have. Beauty is everywhere you only have to look to see
      it."
      >
        <Typography as="button">
          hover me to see a tooltip aligned to the start of the trigger
        </Typography>
      </Tooltip>
      <Tooltip
        align="end"
        content="If you do too much it's going to lose its effectiveness. Look around.
      Look at what we have. Beauty is everywhere you only have to look to see
      it."
      >
        <Typography as="button">
          hover me to see a tooltip aligned to the end of the trigger
        </Typography>
      </Tooltip>
    </div>
  );
}
