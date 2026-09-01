"use client";

import { useState } from "react";

import { Button } from "@tenstorrent/vesper/button";
import { Switch } from "@tenstorrent/vesper/switch";
import { Typography } from "@tenstorrent/vesper/typography";

interface ChipDemoProps {
  kind: "controlled" | "form";
}

export function SwitchDemo(props: ChipDemoProps) {
  if (props.kind === "controlled") {
    return <ControlledSwitchDemo />;
  }

  if (props.kind === "form") {
    return <FormSwitchDemo />;
  }

  return null;
}

function ControlledSwitchDemo() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  return (
    <div className="gap-vesper-4 flex flex-col">
      <Switch
        label="Allow notifications"
        checked={notificationsEnabled}
        onChange={(e) => setNotificationsEnabled(e.target.checked)}
      />
      <Typography variant="copy-sm">
        Checked: {notificationsEnabled ? "true" : "false"}
      </Typography>
      <Button size="sm" onClick={() => setNotificationsEnabled(false)}>
        Reset
      </Button>
    </div>
  );
}

function FormSwitchDemo() {
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
      <Switch
        required
        name="terms"
        value="accepted"
        label="I agree to the terms and conditions"
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
