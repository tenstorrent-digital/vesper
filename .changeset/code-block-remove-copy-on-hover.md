---
"@tenstorrent/vesper": patch
---

Removed the `copyOnHover` prop from `CodeBlock`. On devices that support hover, the copy-to-clipboard button is now always hidden until the code block is hovered or the button receives keyboard focus.
