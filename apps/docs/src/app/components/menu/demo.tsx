"use client";

import { Button } from "@tenstorrent/vesper/button";
import { Menu } from "@tenstorrent/vesper/menu";

export function MenuDemo() {
  return (
    <Menu
      items={[
        { text: "Edit", onSelect: () => {} },
        { text: "Duplicate", onSelect: () => {} },
        { text: "Delete", style: "danger", onSelect: () => {} },
      ]}
    >
      <Button variant="subtle">Open Menu</Button>
    </Menu>
  );
}
