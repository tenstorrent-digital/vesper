"use client";

import { useEffect } from "react";

import { ThemeSwitcher } from "@tenstorrent/vesper/theme-switcher";

import { THEME_STORAGE_KEY } from "@/lib/constants";

/**
 * `ThemeSwitcher` from the design system, plus persistence
 *
 * the component itself only sets `data-vesper-theme` on the document root — it
 * deliberately leaves storage to the app, so the choice is mirrored into
 * `localStorage` here and replayed before first paint by the inline script in
 * `src/app/layout.tsx`
 */
export const ThemeToggle = ({ className }: { className?: string }) => {
  useEffect(() => {
    const root = document.documentElement;

    const observer = new MutationObserver(() => {
      const theme = root.getAttribute("data-vesper-theme");
      if (theme) localStorage.setItem(THEME_STORAGE_KEY, theme);
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-vesper-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return <ThemeSwitcher size="sm" className={className} />;
};
