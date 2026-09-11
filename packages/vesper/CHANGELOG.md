# @tenstorrent/vesper

## 0.2.0

Post-public-pre-internal-launch jitters settled.

This minor release ships with accessibility improvements, and contains our first **breaking change** (‼️), where we remove `MaskedInput` completely ahead of wider adoption (forgive us if you were among the 3 people who downloaded the last release and have already vibecoded your way to 1M MAU and series A funding!!).

### Minor Changes

- f3905b1: Accessibility update: `text-area`, `text-input`, `combobox`, and `select` components now render their inputs with a minimum font size of 16px on mobile screens.
- 8db5345: Remove `masked-input` component. Consumers who still need input masking behavior can install `@maskito/{core,react}` and use the `useMaskito` hook instead. Refer to [the maskito docs](https://maskito.dev/frameworks/react) for more information.

### Patch Changes

- ea824e5: Fix a bug where an uncontrolled `Toggle` with a `defaultValue` would clear itself on mount

## 0.1.1

### Patch Changes

- 78f735b: Update `README.md` install instructions

## 0.1.0

Initial release

![Simon](https://api.dicebear.com/10.x/initial-face/svg?seed=simon&borderRadius=50)
![Mackenzie](https://api.dicebear.com/10.x/initial-face/svg?seed=mackenzie&borderRadius=50)
![Neesh](https://api.dicebear.com/10.x/initial-face/svg?seed=neesh&borderRadius=50)

w love from Toronto, New York, and Santa Clara
