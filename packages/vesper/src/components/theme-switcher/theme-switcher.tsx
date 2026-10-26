"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ComponentProps,
} from "react";

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
}

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
  const { className, size = "lg", ...rest } = props;
  const [currentTheme, setCurrentTheme] = useTheme();

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
            className="vesper-theme-switcher-button"
            onClick={() => setCurrentTheme(theme)}
            aria-label={`Switch color theme to ${theme} ${theme === "system" ? "preference" : "mode"}`}
            data-vesper-theme-value={theme}
          >
            <Icon />
          </button>
        );
      })}
      <span className="vesper-theme-switcher-indicator" />
    </div>
  );
}

/**
 * A hook for reading and setting the active color theme, which is stored in the `data-vesper-theme` attribute on the document root.
 *
 * Every component that calls `useTheme` (including `ThemeSwitcher`) shares the same state, and re-renders when the theme is changed with `setTheme`.
 *
 * Must be called inside a `ThemeProvider`, and throws an error otherwise.
 *
 * @example
 * const [theme, setTheme] = useTheme();
 *
 * @example
 * <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
 *   Toggle dark mode
 * </Button>
 */
export function useTheme(): UseThemeValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      "`useTheme` and `ThemeSwitcher` must be used inside a `ThemeProvider`. Wrap your app in `<ThemeProvider>` from `@tenstorrent/vesper/theme-switcher`.",
    );
  }
  return context;
}

export type UseThemeValue = [
  theme: VesperTheme,
  setTheme: (theme: VesperTheme) => void,
];

const parseTheme = (theme?: string | null): VesperTheme =>
  VESPER_THEMES.find((t) => t === theme) ?? "system";

const readActiveTheme = (): VesperTheme =>
  parseTheme(document.documentElement.getAttribute("data-vesper-theme"));

const writeActiveTheme = (theme: VesperTheme) => {
  document.documentElement.setAttribute("data-vesper-theme", theme);
  listeners.forEach((listener) => listener());
};

const readPersistedTheme = (storageKey: string): VesperTheme | null => {
  try {
    return parseTheme(localStorage.getItem(storageKey));
  } catch {
    return null;
  }
};

const writePersistedTheme = (storageKey: string): VesperTheme | null => {
  try {
    localStorage.setItem(storageKey, readActiveTheme());
    return readPersistedTheme(storageKey);
  } catch {
    return null;
  }
};

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const ThemeContext = createContext<UseThemeValue | null>(null);

export interface ThemeProviderProps {
  children?: ReactNode;
  /** The theme to display during server rendering and hydration, when the document's theme can't be read yet. @default system */
  serverTheme?: VesperTheme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  serverTheme,
  storageKey,
}: ThemeProviderProps) {
  // server render and hydration use `serverTheme`; after that, read what the blocking script put on <html>
  const theme = useSyncExternalStore(
    subscribe,
    readActiveTheme,
    () => serverTheme ?? "system",
  );

  const setTheme = useCallback(
    (next: VesperTheme) => {
      writeActiveTheme(next);
      if (storageKey) writePersistedTheme(storageKey);
    },
    [storageKey],
  );

  useEffect(() => {
    if (!storageKey) return () => {};

    const saved = readPersistedTheme(storageKey);
    if (saved && saved !== readActiveTheme()) writeActiveTheme(saved);

    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey) writeActiveTheme(parseTheme(e.newValue));
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  const value = useMemo<UseThemeValue>(
    () => [theme, setTheme],
    [theme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {storageKey && <ThemeScript storageKey={storageKey} />}
      {children}
    </ThemeContext.Provider>
  );
}

const themeScript = function themeScript(storageKey: string) {
  try {
    const theme = localStorage.getItem(storageKey);
    const resolved: VesperTheme | null =
      theme === "light" || theme === "dark" || theme === "system"
        ? theme
        : null;

    if (resolved) {
      document.documentElement.setAttribute("data-vesper-theme", resolved);
    }
  } catch {}
};

function ThemeScript({ storageKey }: { storageKey: string }) {
  const fn = themeScript.toString();
  const key = JSON.stringify(storageKey);
  return <script dangerouslySetInnerHTML={{ __html: `(${fn})(${key})` }} />;
}
