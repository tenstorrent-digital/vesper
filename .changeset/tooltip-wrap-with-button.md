---
"@tenstorrent/vesper": minor
---

Added a new prop to `Tooltip`, `wrapWithButton`, that allows consumers to control whether a tooltip's trigger renders with a wrapping `<button>` element instead of receiving a tooltip's forwarded props. The behavior prior to this change was to _always_ merge a tooltip's props with its trigger's props and omit the wrapping `<button>` element.
