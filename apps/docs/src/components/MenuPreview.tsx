"use client";

import { Blackhole, Globe, Tenstorrent } from "@repo/vesper/icons";
import { Menu } from "@repo/vesper/Menu";

export function MenuPreview() {
  return (
    <div className="bg-vesper-stone-100 text-vesper-stone-900 flex flex-col gap-vesper-4 p-vesper-4 pb-200">
      <Menu
        items={[
          {
            text: "Label",
            description: "The description",
            icon: <Tenstorrent />,
            style: "default",
            onSelect() {},
          },
          {
            text: "Label",
            description: "The description",
            icon: <Globe />,
            style: "selected",
            onSelect() {},
          },
          {
            text: "Label",
            description: "The description",
            icon: <Blackhole />,
            style: "danger",
            onSelect() {},
          },
          {
            text: "Label",
            description: "The description",
            style: "locked",
            onSelect() {},
          },
          {
            text: "Label",
            description: "The description",
            style: "disabled",
            onSelect() {},
          },
        ]}
      >
        <button>menu</button>
      </Menu>
    </div>
  );
}
