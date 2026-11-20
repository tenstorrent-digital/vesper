---
"@tenstorrent/vesper": patch
---

Narrowed the `title` prop type for the `<Accordion>` component from `ReactNode` to `NonNullable<ReactNode>`, so passing `null` or `undefined` as a title is now a type error
