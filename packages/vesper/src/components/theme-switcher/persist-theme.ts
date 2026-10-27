/**
 * Sets up saving the theme under `storageKey` by doing the following:
 * 1. Applies the theme saved in `localStorage` under `storageKey` (if any) to the document
 * 2. Sets up a `MutationObserver` that listens for theme changes and writes them to `localStorage` under `storageKey`
 * 3. Sets up event listeners that respond to theme changes in other tabs
 *
 * Runs as an inline script, so it's converted to a string and can't reference anything outside of itself
 */
export function persistTheme(storageKey: string) {
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
