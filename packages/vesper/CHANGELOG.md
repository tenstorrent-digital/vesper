# @tenstorrent/vesper

## 0.3.0

### Minor Changes

- a1ddb25: Update `SplitButton` default variant to be `"subtle"` instead of `"contrast"`
- a1ddb25: Update `Admonition` default size to be `"md"` instead of `"sm"`
- 75fa75d: Allow `Sheet` content to be rendered inside of a `<form>` by exposing a `form` prop in the same way the `Modal` component does

### Patch Changes

- 041cc5d: decrement minimum supported node version
- 041cc5d: Fix: Declare optional `children` prop for `Badge` and `Tag`
- 5207d64: Bug fix: ensure `<Toasts />` renders with max z-index so its content gets placed above everything else in its stacking context
- 6f98fb5: Update the default variant for `Code` to inherit its text color
- a594d7d: Update the styling of `admonition.tsx` to match updated designs in Figma
- ec340f7: Adjust styling in `badge`, `button`, and `tag` components to meet wcag2aa a11y requirements
- 6f98fb5: Update `bg-vesper-dot-pattern-*` tailwind utilities so the individual CSS properties they are composed of can be overridden by other tailwind utility classes
- df39ec0: Fix a bug where `<Tabs>` was not correctly rendering the active tab when `variant="secondary"`

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
