---
"@tenstorrent/vesper": minor
---

Remove `masked-input` component. Consumers who still need input masking behavior can install `@maskito/{core,react}` and use the `useMaskito` hook instead. Refer to [the maskito docs](https://maskito.dev/frameworks/react) for more information.
