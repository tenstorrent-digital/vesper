"use client";

import { SplitButton } from "@repo/vesper/split-button";

export function SplitButtonDemo() {
  return (
    <SplitButton
      menuItems={[
        { text: "Save as draft", onSelect: () => {} },
        { text: "Save and publish", onSelect: () => {} },
      ]}
    >
      Save
    </SplitButton>
  );
}
