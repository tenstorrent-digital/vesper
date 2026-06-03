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
            onSelect() {
              console.log("selected item");
            },
          },
          {
            text: "Label",
            description: "The description",
            icon: <Globe />,
            style: "selected",
            onSelect() {
              console.log("selected item");
            },
          },
          {
            text: "Label",
            description: "The description",
            icon: <Blackhole />,
            style: "danger",
            onSelect() {
              console.log("selected item");
            },
          },
          {
            text: "Label",
            description: "The description",
            style: "locked",
            onSelect() {
              console.log("selected item");
            },
          },
          {
            text: "Label",
            description: "The description",
            style: "disabled",
            onSelect() {
              console.log("selected item");
            },
          },
        ]}
      >
        <button>menu</button>
      </Menu>
    </div>
  );
}
