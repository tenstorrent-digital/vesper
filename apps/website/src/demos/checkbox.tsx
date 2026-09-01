"use client";

import { useState } from "react";

import { Button } from "@tenstorrent/vesper/button";
import { Checkbox } from "@tenstorrent/vesper/checkbox";
import { Choicebox } from "@tenstorrent/vesper/choicebox";
import { Typography } from "@tenstorrent/vesper/typography";

const TOPPINGS = [
  { value: "cheese", label: "Cheese" },
  { value: "mushrooms", label: "Mushrooms" },
  { value: "olives", label: "Olives" },
];

interface CheckboxDemoProps {
  kind: "controlled" | "indeterminate" | "form";
}

export function CheckboxDemo(props: CheckboxDemoProps) {
  if (props.kind === "controlled") {
    return <ControlledCheckboxDemo />;
  }

  if (props.kind === "indeterminate") {
    return <IndeterminateCheckboxDemo />;
  }

  if (props.kind === "form") {
    return <FormCheckboxDemo />;
  }

  return null;
}

function ControlledCheckboxDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="gap-vesper-4 flex flex-col">
      <Checkbox
        text="Sign up for our newsletter"
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
      />
      <Typography variant="copy-sm">
        Checked: {checked ? "true" : "false"}
      </Typography>
      <Button size="sm" onClick={() => setChecked(false)}>
        Reset
      </Button>
    </div>
  );
}

function IndeterminateCheckboxDemo() {
  const [selected, setSelected] = useState<string[]>(["cheese"]);

  const allSelected = selected.length === TOPPINGS.length;
  const someSelected = selected.length > 0 && !allSelected;

  return (
    <div className="gap-vesper-4 flex flex-col">
      <Checkbox
        text="Select all toppings"
        checked={allSelected}
        indeterminate={someSelected}
        onChange={(event) =>
          setSelected(
            event.target.checked
              ? TOPPINGS.map((topping) => topping.value)
              : [],
          )
        }
      />
      <Choicebox
        multiselect
        name="toppings"
        options={TOPPINGS}
        values={selected}
        onChange={setSelected}
      />
    </div>
  );
}

function FormCheckboxDemo() {
  const [submitted, setSubmitted] = useState<string | null>(null);

  return (
    <form
      className="gap-vesper-4 flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setSubmitted(String(data.get("terms") ?? ""));
      }}
    >
      <Checkbox
        required
        name="terms"
        value="accepted"
        text="I agree to the terms and conditions"
      />
      <Button size="sm" type="submit">
        Submit
      </Button>
      {submitted !== null && (
        <Typography variant="copy-sm">
          Submitted value: terms={submitted}
        </Typography>
      )}
    </form>
  );
}
