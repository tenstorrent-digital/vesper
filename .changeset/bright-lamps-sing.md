---
"@tenstorrent/vesper": patch
---

Widened the accepted `text` prop type for the `<Checkbox>` component from `string` to `NonNullable<ReactNode>`:

- An asterisk is only appended to the `text` of a required checkbox when `text` is a `string`
- The underlying `<input>` no longer receives a default `aria-label`, so its accessible name is now derived from the rendered `text` (including the asterisk of a required checkbox). Pass `aria-label` to override it
