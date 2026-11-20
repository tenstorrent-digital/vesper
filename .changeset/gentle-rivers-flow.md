---
"@tenstorrent/vesper": patch
---

Replaced the `message` prop of the `<FormInputMessage>` component with `children`, which accepts any `ReactNode`. Instead of `<FormInputMessage message="Invalid key" />`, render `<FormInputMessage>Invalid key</FormInputMessage>`
