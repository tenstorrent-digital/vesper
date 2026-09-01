"use client";

import { useState } from "react";

import { Button } from "@tenstorrent/vesper/button";
import { Select } from "@tenstorrent/vesper/select";
import {
  Tooltip,
  TOOLTIP_ALIGNMENTS,
  TOOLTIP_SIDES,
  TooltipAlign,
  TooltipSide,
} from "@tenstorrent/vesper/tooltip";

interface TooltipDemoProps {
  kind: "position";
}

export function TooltipDemo(props: TooltipDemoProps) {
  if (props.kind === "position") return <PositionTooltipDemo />;
  return null;
}

function PositionTooltipDemo() {
  const [side, setSide] = useState<TooltipSide>("top");
  const [align, setAlign] = useState<TooltipAlign>("center");

  return (
    <div className="flex flex-col items-center">
      <Tooltip
        open
        side={side}
        align={align}
        content={`${side} side, ${align} align`}
      >
        <Button className="mt-vesper-16 mb-vesper-20">Hover me</Button>
      </Tooltip>
      <div className="gap-vesper-4 flex">
        <Select
          value={side}
          aria-label="Tooltip side"
          onValueChange={(side) => setSide(side as TooltipSide)}
          options={TOOLTIP_SIDES.map((value) => ({ label: value, value }))}
          className="w-vesper-28"
        />
        <Select
          value={align}
          aria-label="Tooltip align"
          onValueChange={(align) => setAlign(align as TooltipAlign)}
          options={TOOLTIP_ALIGNMENTS.map((value) => ({ label: value, value }))}
          className="w-vesper-28"
        />
      </div>
    </div>
  );
}
