---
"@tenstorrent/vesper": patch
---

Update CSS tokens:

- Add a `--vesper-blur-disabled` token, along with a matching `blur-vesper-disabled` Tailwind utility
- Rename `--vesper-text-alpha-disabled` to `--vesper-text-inverse-disabled` (and the `text-vesper-text-alpha-disabled` Tailwind utility to `text-vesper-text-inverse-disabled`)
- `--vesper-background-inverse-primary` and `--vesper-background-inverse-secondary` now resolve to opaque `--vesper-stone-900` and `--vesper-stone-800` colors instead of their alpha counterparts
- `--vesper-shadow-{100,200,300,400}` tokens now use a neutral black shadow color instead of a teal-tinted one
