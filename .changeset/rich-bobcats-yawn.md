---
"@tenstorrent/vesper": minor
---

Decouple `Checkbox` from `form-input-wrapper` and improve its internal prop-forwarding. The `variant`, `label`, `message`, and `inputRef` props are removed, along with the exported `CHECKBOX_VARIANTS` constant and `CheckboxVariant` type. Use `ref` to access the underlying `<input>`.
