"use client";

import { TextInput } from "@tenstorrent/vesper/text-input";

interface TextInputDemoProps {
  kind: "mask-replace-regex" | "mask-replace-string" | "mask-postal-code";
}

export function TextInputDemo({ kind }: TextInputDemoProps) {
  if (kind === "mask-replace-regex") {
    return (
      <TextInput
        placeholder="Enter your phone number"
        mask={{ format: "+1 (___) ___-____", replace: /\d/ }}
      />
    );
  }

  if (kind === "mask-replace-string") {
    return (
      <TextInput
        placeholder="Enter your product license"
        mask={{
          format: "xxxx-xxxx-xxxx-xxxx",
          replace: "x",
        }}
      />
    );
  }

  if (kind === "mask-postal-code") {
    return (
      <TextInput
        placeholder="Enter your postal code (ex: A0A 1B1)"
        mask={{
          format: "ABA BAB",
          replace: { A: /[a-zA-Z]/, B: /\d/ },
        }}
      />
    );
  }

  return null;
}
