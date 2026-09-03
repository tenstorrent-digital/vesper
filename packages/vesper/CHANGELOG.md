# @tenstorrent/vesper

## 0.1.0

### Minor Changes

- 8177394: Update `combobox` to use new `form-input-wrapper` component
- 47c7d3a: Add the `combobox` component
- 1706515: Update `text-area` to use new `form-input-wrapper` component
- 9cf23d5: Migrate `toggle.tsx` off of radix-ui
- ffb5139: Add `form-input-message` component
- dd2be99: Add `masked-input` component
- 753bccc: Updated `snippet` to show a checkmark when text successfully copied to clipboard
- cd5a8ca: Improve `switch` internal prop-forwarding
- e28a8c0: Update default typography variant to `copy-md` and allow inline `Code` to scale with surrounding text.
- b793773: Update existing icons and add `bug`, `circle-add-solid`, `circle-add`, `clock-countdown`, `clock-counter-clockwise`, `clock`, `eye-slash`, `eye`, `gear-solid`, `microphone`, and `sidebar` icons
- 223ddd3: Adds `size` prop to `chip` component
- 36494af: Update `range` and `slider` to use new `form-input-wrapper` component
- 4468a0b: Update `text-input` and `masked-input` to use new `form-input-wrapper` component
- 473af3e: Export `ToastHandle` and `ToastAction` interfaces from toast module, add JSDoc comments to `ToastOptions` interface
- ed940f4: Updates code-block TextMate theme to use Night Owl and Night Owl Light remapped to Vesper color tokens
- ead4b4f: Decouple `select` from `form-input-wrapper` and improve its internal prop-forwarding
- f1c18d4: Update component styles so that elements do not take up more width than necessary
- 3494fab: Adjust components that use radix portals to prioritize nearest dialog as portal target. Add a `container` prop to `Tooltip`, `Menu`, and `Select` to override the portal target.
- be9795f: Migrate a number of components away from `@radix-ui` and towards `@base-ui` as radix is no longer receiving regular updates and maintenance
- 1b0e229: Update how multiple refs that point to the same element get resolved by implementing `base-ui`s `useMergedRefs` utility
- de5c33a: Update `skeleton` to be styled with `width: fit-content;` by default. This allows a `skeleton` to hug its children's bounding box by default.
- 77e38ae: Update `Checkbox` to use `FormInputWrapper`. Rename the required adjacent-text prop from `label` to `text`, and add optional `label`, `message`, and `variant` props.
- c1a3ee7: Change `display-*` typography variants to reflect updated designs in Figma
- 89df43d: Decouple `slider` and `range` from `form-input-wrapper` and improve its internal prop-forwarding
- 65c0e6e: Split `text-input` multiline behavior out into its own component, `text-area`, and rework the `text-input` icon API. `icon` is replaced by `iconLeft` and `iconRight`, each of which can be made interactive via `iconLeftAction`/`iconRightAction` (a click `handler` plus a required `ariaLabel`), replacing the built-in clear button. `text-input` now also renders its message via `form-input-message`, prevents browser autofill from overriding its background color, and shows the focus ring for any focused element within the field.
- 4dd2794: Improve `toggle` internal prop-forwarding
- 6d9a880: Update icon generation script so root svg has `fill="none"`. This prevents icons which have only a stroke and no fill from rendering with a fill by accident after generating their component.
- f51421d: Decouple `Checkbox` from `form-input-wrapper` and improve its internal prop-forwarding. The `variant`, `label`, `message`, and `inputRef` props are removed, along with the exported `CHECKBOX_VARIANTS` constant and `CheckboxVariant` type. Use `ref` to access the underlying `<input>`.
- fc50381: Decouple `text-area` from `form-input-wrapper` and improve its internal prop-forwarding. Remove `label` and `message` props from `text-area`
- 6978042: Update `select` to use new `form-input-wrapper` component
- a318378: Keep reset styles scoped to vesper components. Move overriding of transition duration tokens when prefers-reduced-motion is active into `animation.css`
- 864d740: Decouple `text-input` from `form-input-wrapper` and improve its internal prop-forwarding. Replace `MaskedInput`'s `inputRef` prop with React's `ref` prop.
- 7e2384c: Decouple `combobox` from `form-input-wrapper` and improve its internal prop-forwarding
- 64dffbd: Migrate `Slider` and `Range` off of `@radix-ui/react-slider` and onto `@base-ui/react`
- 473af3e: Remove polymorphism from `Admonition` component
- b341b6c: Updates the default size prop for a number of components to default to "md" instead of "lg"

### Patch Changes

- a6a3142: Cap the height of the `Select` dropdown at `20rem` and hide its scrollbar so long option lists stay within the viewport
- e5241cf: Prevent focus state from flickering when select dropdown gets closed
- dff60ee: Prevent rendering tooltip and menu triggers with non-element children, as doing so in production environments throws an exception
- 351df74: Update README.md with installation and usage instructions, fix border-width Tailwind theme values, and update letterspacing values to be em-based instead of percentage-based.
- 7dcc567: Adjust design system color token values
