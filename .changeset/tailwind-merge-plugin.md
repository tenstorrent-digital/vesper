---
"@tenstorrent/vesper": patch
---

Added `withVesper`, a `tailwind-merge` plugin exported from `@tenstorrent/vesper/tailwind-merge`. Pass it to `extendTailwindMerge` (eg. `extendTailwindMerge(withVesper)`) to resolve conflicts between Vesper's Tailwind classes and Tailwind's own classes. `tailwind-merge` (`^3.0.0`) is an optional peer dependency, which you only need to install to use `withVesper`.
