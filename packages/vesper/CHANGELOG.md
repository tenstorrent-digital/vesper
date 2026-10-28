# @tenstorrent/vesper

## 0.5.1

### Patch Changes

- ed0452c: Removed the `copyOnHover` prop from `CodeBlock`. On devices that support hover, the copy-to-clipboard button is now always hidden until the code block is hovered or the button receives keyboard focus.
- ed0452c: Updated the following component styles to match updated designs in Figma: `Admonition`, `Button`, `Checkbox`, `Chip`, `Choicebox`, `Code`, `CodeBlock`, `Combobox`, `IconButton`, `RadioGroup`, `Select`, `Sheet`, `Snippet`, `StatusIndicator`, `Switch`, `Toast`, `Toggle`
- ed0452c: Bug fix: clear pending copy-to-clipboard timeouts in `Snippet` and `CodeBlock` when they unmount, and restart the `CodeBlock` copy confirmation timeout when its copy button is clicked again.
- ed0452c: Update CSS tokens:

  - Add a `--vesper-blur` token, along with a matching `blur-vesper` Tailwind utility
  - Rename `--vesper-text-alpha-disabled` to `--vesper-text-inverse-disabled` (and the `text-vesper-text-alpha-disabled` Tailwind utility to `text-vesper-text-inverse-disabled`)
  - `--vesper-background-inverse-primary` and `--vesper-background-inverse-secondary` now resolve to opaque `--vesper-stone-900` and `--vesper-stone-800` colors instead of their alpha counterparts
  - `--vesper-shadow-{100,200,300,400}` tokens now use a neutral black shadow color instead of a teal-tinted one

- ed0452c: Applied a backdrop blur (using the new `--vesper-blur` token) to disabled `Button`, `Checkbox`, `Chip`, `Switch`, and `Toggle` components.
- ed0452c: Added a `size` prop to `FormInputMessage`, which accepts `"sm"` (default) or `"lg"`. Small messages render with the `label-xxs` typography variant, and large messages render with the `label-xs` typography variant and increased padding.
- ed0452c: Added hover states to `TextInput`, `TextArea`, `Checkbox`, and `RadioGroup`.
- ed0452c: Added `SliderHorizontal` and `Stop` icons.
- ed0452c: Updated `SplitButton`:

  - Increase the default `menuWidth` from `200` to `280`
  - The `"subtle"` variant now renders its buttons with `tertiary` `Button` styles
  - The menu toggle button now has a fixed width for `md` and `lg` sizes, and the action button fills the remaining space

- ed0452c: Add a `ThemePersistenceScript` component to the `theme-switcher` module. Render it once in the document's `<head>` to save the active theme to `localStorage` and apply the saved theme before the page is first painted. Themes are kept in sync across browser tabs, and the `localStorage` key can be customized via the `storageKey` prop.
- ed0452c: Updated `ThemeSwitcher` and `useTheme`:

  - `ThemeSwitcher` and `useTheme` now stay in sync with any change to the `data-vesper-theme` attribute on the document root, not just changes made with `useTheme`'s setter function
  - The active theme is now styled based on the document root's `data-vesper-theme` attribute, so the correct theme displays before hydration
  - Restyle `ThemeSwitcher` with a transparent background, a filled indicator for the active theme, and a hover state for its buttons

- ed0452c: Added two new props to `Tooltip`:

  - `variant`: either `"contrast"` (default) or `"danger"`, which determines the tooltip's color scheme
  - `hideArrow`: when `true`, hides the tooltip's arrow and removes the arrow's height from the distance between the tooltip and its trigger

- ed0452c: Add new `Typography` variants such that every `copy-*` and `label-*` size now has a `-mono` counterpart. Also adjust the styling of existing variants: `display-*` variants now render with a lighter font weight and `tight` letter spacing, and `label-xs`/`label-xs-bold` now render with `normal` letter spacing.

## 0.5.0

### Minor Changes

- 00ca199: Update `theme-switcher` module to export a new hook, `useTheme`, which exposes the current theme and a setter function to consumers.

### Patch Changes

- 256a134: Widens the `message` prop in `form-input-message` to accept `null` and `false` values.

## 0.4.0

### Minor Changes

- c24297b: Convert `Menu` to a polymorphic component. This allows consumers to compose dropdown menus easier with existing Vesper components like `Button`, `IconButton`, and `TextButton` via the `as` prop.
- 8c0b47b: Added a new prop to `TabItem`, `contentAsPanel`, that allows consumers to control whether a tab panel's `content` renders as the tab panel itself via prop forwarding. The behavior prior to this change was to _always_ treat a tab's `content` as the panel itself.
- 3d90c86: Added a new prop to `Tooltip`, `wrapWithButton`, that allows consumers to control whether a tooltip's trigger renders with a wrapping `<button>` element instead of receiving a tooltip's forwarded props. The behavior prior to this change was to _always_ merge a tooltip's props with its trigger's props and omit the wrapping `<button>` element.

### Patch Changes

- 96d914e: Bug fix: adjust how polymorphic component props are inferred so that polymorphic components rendered as other polymorphic components don't lose their type-checking.

## 0.3.1

### Patch Changes

- 0b7702e: Declare callback props (eg. `onValueChange`, `onOpenChange`) as function properties instead of methods, so they are type-checked strictly (instead of bivariantly) against the handlers passed to them
- 774ba29: Bug fix: tighten CSS selector scoping across `accordion`, `sheet`, `badge`, `tag`, `button`, `admonition`, `tabs`, `chip`, and `text-button` so nested components do not inherit styles from parent components

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

![Simon](https://api.dicebear.com/10.x/initial-face/svg?seed=simon&borderRadius=50) ![Mackenzie](https://api.dicebear.com/10.x/initial-face/svg?seed=mackenzie&borderRadius=50) ![Neesh](https://api.dicebear.com/10.x/initial-face/svg?seed=neesh&borderRadius=50)

w love from Toronto, New York, and Santa Clara
