"use client";

import { useSyncExternalStore, type ComponentProps } from "react";

import { ModeDark, ModeLight, ModeSystem } from "@/components/icons/icons";
import { cn } from "@/utils/cn";

export const THEME_SWITCHER_SIZES = ["sm", "lg"] as const;

export const VESPER_THEMES = ["system", "light", "dark"] as const;

export type ThemeSwitcherSize = (typeof THEME_SWITCHER_SIZES)[number];

export type VesperTheme = (typeof VESPER_THEMES)[number];

const THEME_ICONS = {
  system: ModeSystem,
  light: ModeLight,
  dark: ModeDark,
};

export interface ThemeSwitcherProps extends Omit<
  ComponentProps<"div">,
  "children"
> {
  /** The size of the theme switcher. @default lg */
  size?: ThemeSwitcherSize;
  /** The theme to display during server rendering and hydration, when the document's theme can't be read yet. @default system */
  serverTheme?: VesperTheme;
}

const store = {
  listeners: new Set<() => void>(),
  subscribe: (listener: () => void) => {
    store.listeners.add(listener);
    return () => store.listeners.delete(listener);
  },
  get: (): VesperTheme => {
    let theme = document.documentElement.getAttribute("data-vesper-theme");
    return VESPER_THEMES.find((t) => t === theme) ?? "system";
  },
  set: (theme: VesperTheme) => {
    document.documentElement.setAttribute("data-vesper-theme", theme);
    store.listeners.forEach((listener) => listener());
  },
};

/**
 * A hook for reading and setting the active color theme, which is stored in the `data-vesper-theme` attribute on the document root.
 *
 * Every component that calls `useTheme` (including `ThemeSwitcher`) shares the same state, and re-renders when the theme is changed with `setTheme`.
 *
 * @param {VesperTheme} [serverTheme] - (optional) The theme to return during server rendering and hydration. @default system
 *
 * @example
 * const [theme, setTheme] = useTheme();
 *
 * @example
 * // render the user's saved theme on the server
 * const [theme, setTheme] = useTheme(savedTheme);
 *
 * @example
 * <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
 *   Toggle dark mode
 * </Button>
 */
export const useTheme = (
  serverTheme?: VesperTheme,
): [VesperTheme, (theme: VesperTheme) => void] => {
  const theme = useSyncExternalStore(
    store.subscribe,
    store.get,
    () => serverTheme ?? "system",
  );
  return [theme, store.set] as const;
};

/**
 * A three-way toggle for switching between system, light, and dark color themes by setting the `data-vesper-theme` attribute on the document root.
 *
 * @param {ThemeSwitcherSize} [props.size] - (optional) The size of the theme switcher. @default lg
 * @param {VesperTheme} [props.serverTheme] - (optional) The theme to display during server rendering and hydration. @default system
 *
 * You may also pass any additional props to the underlying `div` element
 *
 * @example
 * <ThemeSwitcher />
 *
 * @example
 * <ThemeSwitcher size="sm" />
 *
 * @example
 * // render the user's saved theme on the server
 * <ThemeSwitcher serverTheme={savedTheme} />
 */
export function ThemeSwitcher(props: ThemeSwitcherProps) {
  const { className, size = "lg", serverTheme, ...rest } = props;
  const [currentTheme, setCurrentTheme] = useTheme(serverTheme);

  return (
    <div
      {...rest}
      data-vesper-theme={currentTheme}
      className={cn(
        "vesper-theme-switcher",
        `vesper-theme-switcher-${size}`,
        `vesper-theme-switcher-${currentTheme}`,
        className,
      )}
    >
      {VESPER_THEMES.map((theme) => {
        const Icon = THEME_ICONS[theme];
        return (
          <button
            key={theme}
            type="button"
            className={cn(
              "vesper-theme-switcher-button",
              theme === currentTheme && "vesper-theme-switcher-button-active",
            )}
            onClick={() => setCurrentTheme(theme)}
            aria-label={`Switch color theme to ${theme} ${theme === "system" ? "preference" : "mode"}`}
          >
            <Icon />
          </button>
        );
      })}
      <span className="vesper-theme-switcher-indicator" />
    </div>
  );
}
