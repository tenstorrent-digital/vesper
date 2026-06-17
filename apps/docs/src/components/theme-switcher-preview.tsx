"use client";

import { ThemeSwitcher } from "@repo/vesper/theme-switcher";

export function ThemeSwitcherPreview() {
  return (
    <div className="bg-vesper-stone-50 flex flex-col gap-vesper-4 p-vesper-4">
      <ThemeSwitcher />
    </div>
  );
}
