"use client";

import { useState } from "react";

import { Button } from "@tenstorrent/vesper/button";
import { Select } from "@tenstorrent/vesper/select";
import { Typography } from "@tenstorrent/vesper/typography";

const FRUITS = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Mango", value: "mango" },
  { label: "Peach", value: "peach" },
];

interface SelectDemoProps {
  kind: "controlled" | "form";
}

export function SelectDemo(props: SelectDemoProps) {
  if (props.kind === "controlled") {
    return <ControlledSelectDemo />;
  }

  if (props.kind === "form") {
    return <FormSelectDemo />;
  }

  return null;
}

function ControlledSelectDemo() {
  const [fruit, setFruit] = useState<string | null>("apple");

  return (
    <div className="gap-vesper-4 flex flex-col">
      <Select
        label="Fruit"
        placeholder="Select a fruit"
        options={FRUITS}
        value={fruit}
        onValueChange={setFruit}
      />
      <Typography variant="copy-sm">
        Selected value: {fruit === "" ? "(none)" : fruit}
      </Typography>
      <Button size="sm" onClick={() => setFruit(null)}>
        Reset
      </Button>
    </div>
  );
}

function FormSelectDemo() {
  const [submitted, setSubmitted] = useState<string | null>(null);

  return (
    <form
      className="gap-vesper-4 flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setSubmitted(String(data.get("fruit") ?? ""));
      }}
    >
      <Select
        required
        name="fruit"
        label="Fruit"
        placeholder="Select a fruit"
        options={FRUITS}
      />
      <Button size="sm" type="submit">
        Submit
      </Button>
      {submitted !== null && (
        <Typography variant="copy-sm">Submitted value: {submitted}</Typography>
      )}
    </form>
  );
}
