---
"@tenstorrent/vesper": patch
---

Declare callback props (eg. `onValueChange`, `onOpenChange`) as function properties instead of methods, so they are type-checked strictly (instead of bivariantly) against the handlers passed to them
