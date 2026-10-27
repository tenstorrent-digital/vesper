---
"@tenstorrent/vesper": patch
---

Updated `ThemeSwitcher` and `useTheme`:
- `ThemeSwitcher` and `useTheme` now stay in sync with any change to the `data-vesper-theme` attribute on the document root, not just changes made with `useTheme`'s setter function
- The active theme is now styled based on the document root's `data-vesper-theme` attribute, so the correct theme displays before hydration
- Restyle `ThemeSwitcher` with a transparent background, a filled indicator for the active theme, and a hover state for its buttons
