"use client";

import { useSyncExternalStore, type ComponentProps } from "react";

import { ModeDark, ModeLight, ModeSystem } from "@/components/icons/icons";
import { cn } from "@/utils/cn";

import { persistTheme } from "./persist-theme";

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
 * Converts `value` to a JavaScript string that can be placed inside an inline `<script>` element.
 *
 * `JSON.stringify` escapes quotes and backslashes, but not `<`. Inside a `<script>` element, `</script>` ends the script early, and the start of an HTML comment followed by `<script>` stops the next `</script>` from ending it. Escaping `<` as `\u003c` keeps the string's value the same, and prevents both.
 */
const toInlineScriptString = (value: string) =>
  JSON.stringify(value).replaceAll("<", "\\u003c");

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
        __html: `(${persistTheme.toString()})(${toInlineScriptString(storageKey)})`,
      }}
    />
  );
}
