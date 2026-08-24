"use client";

import { useState } from "react";

import { Button } from "@tenstorrent/vesper/button";
import { Combobox } from "@tenstorrent/vesper/combobox";
import { Typography } from "@tenstorrent/vesper/typography";

const FRUITS = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Orange", value: "orange" },
  { label: "Pineapple", value: "pineapple" },
  { label: "Grape", value: "grape" },
  { label: "Mango", value: "mango" },
  { label: "Strawberry", value: "strawberry" },
  { label: "Blueberry", value: "blueberry" },
  { label: "Raspberry", value: "raspberry" },
  { label: "Blackberry", value: "blackberry" },
  { label: "Cherry", value: "cherry" },
  { label: "Peach", value: "peach" },
  { label: "Pear", value: "pear" },
  { label: "Plum", value: "plum" },
  { label: "Kiwi", value: "kiwi" },
  { label: "Watermelon", value: "watermelon" },
  { label: "Cantaloupe", value: "cantaloupe" },
  { label: "Honeydew", value: "honeydew" },
  { label: "Papaya", value: "papaya" },
  { label: "Guava", value: "guava" },
  { label: "Lychee", value: "lychee" },
  { label: "Pomegranate", value: "pomegranate" },
  { label: "Apricot", value: "apricot" },
  { label: "Grapefruit", value: "grapefruit" },
  { label: "Passionfruit", value: "passionfruit" },
];

interface ComboboxDemoProps {
  kind: "fruits" | "controlled" | "form";
}

export function ComboboxDemo(props: ComboboxDemoProps) {
  if (props.kind === "fruits") {
    return <Combobox placeholder="e.g. Apple" options={FRUITS} />;
  }

  if (props.kind === "controlled") {
    return <ControlledComboboxDemo />;
  }

  if (props.kind === "form") {
    return <FormComboboxDemo />;
  }

  return null;
}

function ControlledComboboxDemo() {
  const [fruit, setFruit] = useState<string | null>("apple");

  return (
    <div className="gap-vesper-4 flex flex-col">
      <Combobox
        label="Fruit"
        placeholder="e.g. Apple"
        options={FRUITS}
        value={fruit}
        onValueChange={setFruit}
      />
      <Typography variant="copy-sm">
        Selected value: {fruit ?? "null"}
      </Typography>
      <Button size="sm" onClick={() => setFruit(null)}>
        Reset
      </Button>
    </div>
  );
}

function FormComboboxDemo() {
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
      <Combobox
        required
        name="fruit"
        label="Fruit"
        placeholder="e.g. Apple"
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
