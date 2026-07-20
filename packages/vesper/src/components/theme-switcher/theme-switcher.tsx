import { type ComponentProps } from "react";

import { ModeDark, ModeLight, ModeSystem } from "@/components/icons/icons";

import { cn } from "@/utils/cn";

export const THEME_SWITCHER_SIZES = ["sm", "lg"] as const;

export type ThemeSwitcherSize = (typeof THEME_SWITCHER_SIZES)[number];

export type VesperTheme = "light" | "dark" | "system";

export interface ThemeSwitcherProps extends Omit<
  ComponentProps<"div">,
  "children"
> {
  /** The size of the theme switcher. Defaults to `"lg"`. */
  size?: ThemeSwitcherSize;
}

const setTheme = (theme: VesperTheme) =>
  document.documentElement.setAttribute("data-vesper-theme", theme);

/**
 * A segmented control for switching between light, dark, and system color themes.
 * Sets the `data-vesper-theme` attribute on the document's root element to apply the selected theme.
 *
 * @example
 * <ThemeSwitcher size="sm" />
 */
export function ThemeSwitcher({
  className,
  size = "lg",
  ...props
}: ThemeSwitcherProps) {
  return (
    <div
      className={cn(
        "vesper-theme-switcher",
        `vesper-theme-switcher-${size}`,
        className,
      )}
      {...props}
    >
      <button
        type="button"
        className="vesper-theme-switcher-button vesper-theme-switcher-button-system"
        onClick={() => setTheme("system")}
        aria-label="Switch color theme to system preference"
      >
        <ModeSystem />
      </button>
      <button
        type="button"
        className="vesper-theme-switcher-button vesper-theme-switcher-button-light"
        onClick={() => setTheme("light")}
        aria-label="Switch color theme to light mode"
      >
        <ModeLight />
      </button>
      <button
        type="button"
        className="vesper-theme-switcher-button vesper-theme-switcher-button-dark"
        onClick={() => setTheme("dark")}
        aria-label="Switch color theme to dark mode"
      >
        <ModeDark />
      </button>
      <span className="vesper-theme-switcher-indicator" />
    </div>
  );
}
