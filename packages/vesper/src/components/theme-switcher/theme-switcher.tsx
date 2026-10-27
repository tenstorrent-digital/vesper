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

const parseTheme = (theme?: string | null): VesperTheme =>
  VESPER_THEMES.find((t) => t === theme) ?? "system";

const readActiveTheme = (): VesperTheme =>
  parseTheme(document.documentElement.getAttribute(THEME_ATTRIBUTE));

const readServerTheme = (): VesperTheme => "system";

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
 * Every component that calls `useTheme` (including `ThemeSwitcher`) shares the same state, and re-renders whenever the attribute changes.
 *
 * Returns the `system` theme during server rendering and hydration, since the server can't read the document's theme.
 *
 * @example
 * const [theme, setTheme] = useTheme();
 *
 * @example
 * <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
 *   Toggle dark mode
 * </Button>
 */
export function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    readActiveTheme,
    readServerTheme,
  );
  return [theme, setTheme] as const;
}

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
 *
 * You may also pass any additional props to the underlying `div` element
 *
 * @example
 * <ThemeSwitcher />
 *
 * @example
 * <ThemeSwitcher size="sm" />
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
 * Sets up saving the theme under `storageKey`. First, it applies the saved theme to the document. After that, it
 * saves the theme whenever the attribute on the document changes (however it's changed), and applies themes saved
 * in other browser tabs.
 *
 * It's set up once per page, and keeps working while the page is open, whether or not anything uses `useTheme`.
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
   * only changes the attribute when the theme is different, so themes from other tabs aren't saved again. A removed theme (or cleared storage, where `key` is `null`) removes the attribute, which falls back to the system theme without saving it back into storage.
   */
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== storageKey) return;
    try {
      // `sessionStorage` changes in other frames on the page fire `storage` events too
      if (event.storageArea !== localStorage) return;
    } catch {
      return;
    }

    if (event.newValue === null) {
      root.removeAttribute(attribute);
    } else if (
      isTheme(event.newValue) &&
      event.newValue !== root.getAttribute(attribute)
    ) {
      root.setAttribute(attribute, event.newValue);
    }
  };
  window.addEventListener("storage", handleStorage);

  Reflect.set(window, setup, true);
}

export interface ThemePersistenceScriptProps {
  /** The `localStorage` key to save the theme to. @default vesper-theme */
  storageKey?: string;
  /** The nonce to allow the inline script with a Content Security Policy. */
  nonce?: string;
}

/**
 * An inline script that saves the theme to `localStorage`, and applies the saved theme before the page is first painted. Render it once, in the document's `<head>`.
 *
 * Once it runs, the theme is saved whenever the `data-vesper-theme` attribute on the document changes. Themes saved in other browser tabs are applied too. Clearing `localStorage` in another tab resets the theme to `system`.
 *
 * @param {string} [props.storageKey] - (optional) The `localStorage` key to save the theme to. @default vesper-theme
 * @param {string} [props.nonce] - (optional) The nonce to allow the inline script with a Content Security Policy
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
export function ThemePersistenceScript({
  storageKey = "vesper-theme",
  nonce,
}: ThemePersistenceScriptProps) {
  return (
    <script
      nonce={nonce}
      data-vesper-theme-storage-key={storageKey} // must match `STORAGE_KEY_ATTRIBUTE`
      dangerouslySetInnerHTML={{
        __html: `(${persistTheme.toString()})(${JSON.stringify(storageKey)})`,
      }}
    />
  );
}
