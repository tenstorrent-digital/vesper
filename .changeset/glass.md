---
"@tenstorrent/vesper": minor
---

Restyle every component as translucent glass. Surfaces tint and frost the content behind them, catch light along their rims, follow the pointer with a specular sheen, and ring back with a crisp "tink" when pressed. Transition durations are 25% shorter (`--vesper-transition-duration-fast` is `0.15s`, `-default` is `0.225s`, and `-slow` is `0.45s`). In Chromium-based browsers, a WebGL shader also refracts the content behind each surface. Set `data-vesper-glass="flat"` or `data-vesper-glass="off"` on the root element to turn off refraction or translucency.
