"use client";

import { useState } from "react";

import { Chip, type ChipProps } from "@tenstorrent/vesper/chip";

export function ChipDemo({
  selected: initialSelected = false,
  ...props
}: Pick<
  ChipProps,
  | "selected"
  | "disabled"
  | "variant"
  | "size"
  | "children"
  | "iconLeft"
  | "iconRight"
>) {
  const [selected, setSelected] = useState(initialSelected);

  return <Chip selected={selected} onChange={setSelected} {...props} />;
}
