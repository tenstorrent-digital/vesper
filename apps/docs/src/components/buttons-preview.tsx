"use client";

import { ArrowUp, Tenstorrent } from "@repo/vesper/icons";
import { Button, type ButtonProps } from "@repo/vesper/button";
import { IconButton } from "@repo/vesper/icon-button";

const GROUPS: ButtonProps["variant"][] = [
  "contrast",
  "danger",
  "disabled",
  "ghost",
  "primary",
  "subtle",
  "tertiary",
  "warning",
];

const SIZES: ButtonProps["size"][] = ["lg", "md", "sm", "xs"];

export function ButtonsPreview() {
  return (
    <div className="bg-vesper-stone-50 text-vesper-stone-900 flex flex-wrap gap-vesper-4 p-vesper-4">
      {GROUPS.map((variant) => (
        <div key={variant} className="flex flex-col gap-vesper-4 items-start">
          {SIZES.map((size) => (
            <div key={size} className="flex gap-vesper-4">
              <Button size={size} variant={variant} iconLeft={<Tenstorrent />}>
                {variant}
              </Button>
              <IconButton size={size} variant={variant} icon={<ArrowUp />} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
