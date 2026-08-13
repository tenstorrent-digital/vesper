---
"@tenstorrent/vesper": minor
---

Update icon generation script so root svg has `fill="none"`. This prevents icons which have only a stroke and no fill from rendering with a fill by accident after generating their component.
