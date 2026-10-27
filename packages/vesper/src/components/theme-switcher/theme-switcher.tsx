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

const THEME_ATTRIBUTE = "data-vesper-theme";

const STORAGE_KEY_ATTRIBUTE = "data-vesper-theme-storage-key";

export interface ThemeSwitcherProps extends Omit<
  ComponentProps<"div">,
  "children"
> {
  /** The size of the theme switcher. @default lg */
  size?: ThemeSwitcherSize;
  /** The theme to display during server rendering and hydration, when the document's theme can't be read yet. @default system */
  serverTheme?: VesperTheme | null;
}

const parseTheme = (theme?: string | null): VesperTheme =>
  VESPER_THEMES.find((t) => t === theme) ?? "system";

const readActiveTheme = (): VesperTheme =>
  parseTheme(document.documentElement.getAttribute(THEME_ATTRIBUTE));

const setTheme = (theme: VesperTheme) => {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
};

const subscribe = (listener: () => void) => {
  const storageKey = document
    .querySelector(`script[${STORAGE_KEY_ATTRIBUTE}]`)
    ?.getAttribute(STORAGE_KEY_ATTRIBUTE);

  if (storageKey) persistTheme(storageKey);

  const observer = new MutationObserver(listener);
  observer.observe(document.documentElement, {
    attributeFilter: [THEME_ATTRIBUTE],
  });
  return () => observer.disconnect();
};

/**
 * A hook for reading and setting the active color theme, which is stored in the `data-vesper-theme` attribute on the document root.
 *
 * Every component that calls `useTheme` (including `ThemeSwitcher`) shares the same state, and re-renders when the theme is changed.
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
  serverTheme?: VesperTheme | null,
): [VesperTheme, (theme: VesperTheme) => void] => {
  const theme = useSyncExternalStore(
    subscribe,
    readActiveTheme,
    () => serverTheme ?? "system",
  );
  return [theme, setTheme] as const;
};

/**
 * A three-way toggle for switching between system, light, and dark color themes by setting the `data-vesper-theme` attribute on the document root.
 *
 * @param {ThemeSwitcherSize} [props.size] - (optional) The size of the theme switcher. @default lg
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
 * Sets up saving the theme under `storageKey` by doing the following:
 * 1. Applies the theme saved in `localStorage` under `storageKey` (if any) to the document
 * 2. Sets up a `MutationObserver` that listens for theme changes and writes them to `localStorage` under `storageKey`
 * 3. Sets up event listeners that respond to theme changes in other tabs
 *
 * Runs as an inline script, so it's converted to a string and can't reference anything outside of itself
 */
function persistTheme(storageKey: string) {
  const root = document.documentElement;
  const attribute = "data-vesper-theme";

  const setup = Symbol.for("vesper-theme-persistence-script");
  if (Reflect.has(window, setup)) return;

  // the script is converted to a string, so it can't use anything from an outer scope
  // oxlint-disable-next-line unicorn/consistent-function-scoping
  const isTheme = (value: string | null): value is string =>
    value === "system" || value === "light" || value === "dark";

  try {
    const saved = localStorage.getItem(storageKey);
    if (isTheme(saved)) root.setAttribute(attribute, saved);
  } catch {
    // storage can be unavailable (eg. blocked by the browser)
    // leave the document's theme untouched here
  }

  const observer = new MutationObserver(() => {
    const theme = root.getAttribute(attribute);
    try {
      // removing the attribute removes the saved theme
      if (theme === null) {
        localStorage.removeItem(storageKey);
        return;
      }
      // don't save unknown or unchanged themes
      if (!isTheme(theme) || localStorage.getItem(storageKey) === theme) {
        return;
      }
      localStorage.setItem(storageKey, theme);
    } catch {
      // the theme still applies when storage is unavailable
    }
  });
  observer.observe(root, { attributeFilter: [attribute] });

  /**
   * Applies the theme that's currently saved. Another tab can save several themes before this tab handles the first `storage` event, and that event's `newValue` is out of date by then. Saving an outdated theme over the newer one would trigger `storage` events in the other tabs, and the tabs could keep saving each other's themes indefinitely.
   *
   * A removed theme (or cleared storage, where `key` is `null`) removes the attribute, which falls back to the system theme.
   */
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== storageKey) return;

    let saved: string | null;
    try {
      // `sessionStorage` changes in other frames on the page fire `storage` events too
      if (event.storageArea !== localStorage) return;
      saved = localStorage.getItem(storageKey);
    } catch {
      return;
    }

    if (saved === null) {
      root.removeAttribute(attribute);
    } else if (isTheme(saved) && saved !== root.getAttribute(attribute)) {
      root.setAttribute(attribute, saved);
    } else {
      return;
    }

    // the theme was already saved by another tab, so don't save it again
    observer.takeRecords();
  };
  window.addEventListener("storage", handleStorage);

  Reflect.set(window, setup, true);
}

export interface ThemePersistenceScriptProps extends Omit<
  ComponentProps<"script">,
  "children" | "dangerouslySetInnerHTML"
> {
  /** The `localStorage` key to save the theme to. @default vesper-theme */
  storageKey?: string;
}

/**
 * An inline script that saves the theme to `localStorage`, and applies the saved theme before the page is first painted. Render it once, in the document's `<head>`.
 *
 * Once it runs, the theme is saved whenever the `data-vesper-theme` attribute on the document changes. Themes saved in other browser tabs are applied too. Clearing `localStorage` in another tab resets the theme to `system`.
 *
 * @param {string} [props.storageKey] - (optional) The `localStorage` key to save the theme to. @default vesper-theme
 *
 * @example
 * <html lang="en" suppressHydrationWarning>
 *   <head>
 *     <ThemePersistenceScript />
 *   </head>
 *   <body>{children}</body>
 * </html>
 *
 * @example
 * // save the theme under a different `localStorage` key
 * <ThemePersistenceScript storageKey="my-app-theme" />
 *
 * @example
 * // with a Content Security Policy that uses a nonce
 * <ThemePersistenceScript nonce={nonce} />
 */
export function ThemePersistenceScript(props: ThemePersistenceScriptProps) {
  const { storageKey = "vesper-theme", ...rest } = props;

  return (
    <script
      {...rest}
      data-vesper-theme-storage-key={storageKey} // must match `STORAGE_KEY_ATTRIBUTE`
      dangerouslySetInnerHTML={{
        __html: `(${persistTheme.toString()})(${JSON.stringify(storageKey)})`,
      }}
    />
  );
}
