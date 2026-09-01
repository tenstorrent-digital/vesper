"use client";

import { useState } from "react";

import { Button } from "@tenstorrent/vesper/button";
import { Grid, List } from "@tenstorrent/vesper/icons";
import { Toggle } from "@tenstorrent/vesper/toggle";
import { Typography } from "@tenstorrent/vesper/typography";

interface ToggleDemoProps {
  kind: "controlled" | "form";
}

export function ToggleDemo(props: ToggleDemoProps) {
  if (props.kind === "controlled") {
    return <ControlledToggleDemo />;
  }

  if (props.kind === "form") {
    return <FormToggleDemo />;
  }

  return null;
}

function ControlledToggleDemo() {
  const [value, setValue] = useState("");

  return (
    <div className="gap-vesper-4 flex flex-col">
      <Toggle
        aria-label="Display options"
        value={value}
        onValueChange={setValue}
        options={[
          { value: "list", icon: <List />, ariaLabel: "List view" },
          { value: "grid", icon: <Grid />, ariaLabel: "Grid view" },
        ]}
      />
      <Typography variant="copy-sm">
        Value: {value || "nothing selected"}
      </Typography>
    </div>
  );
}

function FormToggleDemo() {
  const [submitted, setSubmitted] = useState<string>("");

  return (
    <form
      className="gap-vesper-4 flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log(Object.fromEntries(data.entries()));
        setSubmitted(String(data.get("billing_period") ?? ""));
      }}
    >
      <Toggle
        name="billing_period"
        aria-label="Billing period"
        options={[
          { value: "weekly", text: "Weekly" },
          { value: "monthly", text: "Monthly" },
          { value: "yearly", text: "Yearly" },
        ]}
      />
      <Button size="sm" type="submit">
        Submit
      </Button>
      {!!submitted && (
        <Typography variant="copy-sm">Submitted value: {submitted}</Typography>
      )}
    </form>
  );
}
