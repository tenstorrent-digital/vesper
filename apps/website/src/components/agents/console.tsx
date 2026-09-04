"use client";

import { useState } from "react";

import { Button } from "@tenstorrent/vesper/button";
import { Checkbox } from "@tenstorrent/vesper/checkbox";
import { AIAgentSolid, Checkmark, Copy } from "@tenstorrent/vesper/icons";
import { Material } from "@tenstorrent/vesper/material";
import { addToast } from "@tenstorrent/vesper/toast";
import { Typography } from "@tenstorrent/vesper/typography";

import { setAgentMode } from "./agent-mode";

/**
 * a block of text with a copy button
 *
 * used for the prompt packs — long enough that `Snippet` (which is a one-liner
 * with a copy affordance) is the wrong shape
 */
export const CopyBlock = ({ label, text }: { label: string; text: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addToast({
        variant: "success",
        timeout: 3000,
        content: `“${label}” copied — ${text.length.toLocaleString()} characters.`,
      });
    } catch {
      addToast({
        variant: "danger",
        timeout: 4000,
        content: "Clipboard access denied. Select the text the old way.",
      });
    }
  };

  return (
    <Material
      variant="inset"
      style={{
        display: "grid",
        gap: "var(--vesper-spacing-3)",
        padding: "var(--vesper-spacing-4)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--vesper-spacing-3)",
        }}
      >
        <Typography
          as="span"
          variant="label-xs-mono"
          style={{
            textTransform: "uppercase",
            letterSpacing: "var(--vesper-tracking-widest)",
            color: "var(--vesper-text-tertiary)",
          }}
        >
          {label}
        </Typography>
        <Button
          size="xs"
          variant="ghost"
          style={{ marginLeft: "auto" }}
          iconLeft={copied ? <Checkmark /> : <Copy />}
          onClick={() => void copy()}
        >
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      <Typography
        as="pre"
        variant="copy-xs-mono"
        style={{
          margin: 0,
          whiteSpace: "pre-wrap",
          color: "var(--vesper-text-secondary)",
          lineHeight: 1.7,
        }}
      >
        {text}
      </Typography>
    </Material>
  );
};

/** the very serious verification step */
export const TuringTollbooth = () => {
  const [checked, setChecked] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "var(--vesper-spacing-4)",
      }}
    >
      <Checkbox
        text="I am not a human"
        checked={checked}
        onChange={(event) => {
          const next = event.target.checked;
          setChecked(next);

          addToast({
            variant: next ? "success" : "warning",
            timeout: 5000,
            content: next
              ? "Verified. Toll waived. Proceed to the cheat sheet."
              : "Suspicious. A human would also have unchecked that.",
          });
        }}
      />

      <Typography
        as="span"
        variant="copy-xs"
        style={{ color: "var(--vesper-text-tertiary)" }}
      >
        {checked
          ? "Thank you. Your honesty is noted and immediately forgotten."
          : "Required for absolutely nothing."}
      </Typography>
    </div>
  );
};

/** turns on the phosphor skin from inside the console */
export const AgentModeCta = () => (
  <Button
    iconLeft={<AIAgentSolid />}
    onClick={() => {
      setAgentMode(true);
      addToast({
        variant: "success",
        timeout: 5000,
        content: "Agent mode engaged. Press ⌥A to go back to being seen.",
      });
    }}
  >
    Engage agent mode
  </Button>
);
