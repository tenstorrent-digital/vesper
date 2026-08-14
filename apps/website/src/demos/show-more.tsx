"use client";

import { useState } from "react";

import { ShowMore } from "@tenstorrent/vesper/show-more";
import { Typography } from "@tenstorrent/vesper/typography";

interface ShowMoreDemoProps {
  type: "without-content" | "with-content";
}

export function ShowMoreDemo(props: ShowMoreDemoProps) {
  const [expanded, setExpanded] = useState(false);

  if (props.type === "with-content") {
    return (
      <div className="w-full">
        {expanded && <Typography>Additional content revealed here.</Typography>}
        <ShowMore expanded={expanded} onClick={() => setExpanded(!expanded)} />
      </div>
    );
  }

  if (props.type === "without-content") {
    return (
      <ShowMore
        className="w-full"
        expanded={expanded}
        onClick={() => setExpanded(!expanded)}
      />
    );
  }

  return null;
}
