"use client";

import { useState } from "react";

import { Button } from "@tenstorrent/vesper/button";
import { Slider } from "@tenstorrent/vesper/slider";
import { Typography } from "@tenstorrent/vesper/typography";

interface SliderDemoProps {
  kind: "controlled" | "form" | "custom-thumb-labels";
}

export function SliderDemo(props: SliderDemoProps) {
  if (props.kind === "controlled") {
    return <ControlledSliderDemo />;
  }

  if (props.kind === "form") {
    return <FormSliderDemo />;
  }

  if (props.kind === "custom-thumb-labels") {
    return <CustomThumbLabelsSliderDemo />;
  }

  return null;
}

function ControlledSliderDemo() {
  const [volume, setVolume] = useState(75);

  return (
    <div className="gap-vesper-4 flex flex-col">
      <Slider
        value={volume}
        onValueChange={setVolume}
        thumbAriaLabel="Volume"
      />
      <Typography variant="copy-sm">Selected value: {volume}</Typography>
      <Button size="sm" onClick={() => setVolume(0)}>
        Mute
      </Button>
    </div>
  );
}

function FormSliderDemo() {
  const [submitted, setSubmitted] = useState<string | null>(null);

  return (
    <form
      className="gap-vesper-4 flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setSubmitted(String(data.get("volume") ?? ""));
      }}
    >
      <Slider name="volume" defaultValue={50} thumbAriaLabel="Volume" />
      <Button size="sm" type="submit">
        Submit
      </Button>
      {submitted !== null && (
        <Typography variant="copy-sm">Submitted value: {submitted}</Typography>
      )}
    </form>
  );
}

function CustomThumbLabelsSliderDemo() {
  const [volume, setVolume] = useState(40);

  return (
    <Slider
      showValueLabel
      value={volume}
      onValueChange={setVolume}
      valueLabel={`${volume}%`}
      thumbAriaLabel="Volume"
    />
  );
}
