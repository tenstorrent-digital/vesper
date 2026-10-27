---
"@tenstorrent/vesper": patch
---

Bug fix: clear pending copy-to-clipboard timeouts in `Snippet` and `CodeBlock` when they unmount, and restart the `CodeBlock` copy confirmation timeout when its copy button is clicked again.
