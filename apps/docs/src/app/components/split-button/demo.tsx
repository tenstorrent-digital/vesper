"use client";

import { SplitButton } from "@tenstorrent/vesper/split-button";

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
