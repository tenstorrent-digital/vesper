---
"@tenstorrent/vesper": patch
---

Add a `ThemePersistenceScript` component to the `theme-switcher` module. Render it once in the document's `<head>` to save the active theme to `localStorage` and apply the saved theme before the page is first painted. Themes are kept in sync across browser tabs, and the `localStorage` key can be customized via the `storageKey` prop.
