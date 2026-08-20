---
"@tenstorrent/vesper": minor
---

Split `text-input` multiline behavior out into its own component, `textarea`, and rework the `text-input` icon API. `icon` is replaced by `iconLeft` and `iconRight`, each of which can be made interactive via `iconLeftAction`/`iconRightAction` (a click `handler` plus a required `ariaLabel`), replacing the built-in clear button. `text-input` now also renders its message via `form-input-message`, prevents browser autofill from overriding its background color, and shows the focus ring for any focused element within the field.
