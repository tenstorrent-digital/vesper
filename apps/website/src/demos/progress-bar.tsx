"use client";

import { useState } from "react";

import { Button } from "@tenstorrent/vesper/button";
import { ProgressBar } from "@tenstorrent/vesper/progress-bar";
import { Typography } from "@tenstorrent/vesper/typography";

interface ProgressBarDemoProps {
  kind: "animated";
}

export function ProgressBarDemo(props: ProgressBarDemoProps) {
  if (props.kind === "animated") return <AnimatedProgressBarDemo />;
  return null;
}

function AnimatedProgressBarDemo() {
  const [value, setValue] = useState(66);

  return (
    <div className="gap-vesper-4 flex flex-col">
      <ProgressBar value={value} animated />
      <ProgressBar value={value} variant="steps" animated />
      <Button onClick={() => setValue(Math.round(Math.random() * 100))}>
        Change value
      </Button>
      <Typography>Current value: {value}</Typography>
    </div>
  );
}
