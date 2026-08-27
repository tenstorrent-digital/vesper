---
"@tenstorrent/vesper": minor
---

Route form input props to the element each one belongs on. Previously most props fell through to the presentational wrapper, so control-specific attributes were silently applied to a `<div>` where they were either ignored or invalid.

**Props that changed destination**

| Prop                                                                                                       | Before  | After                                        |
| ---------------------------------------------------------------------------------------------------------- | ------- | -------------------------------------------- |
| `aria-*` (except the region-scoped ones below)                                                             | wrapper | control                                      |
| `aria-live`, `-atomic`, `-relevant`, `-busy`, `-posinset`, `-setsize`, `-level`, `aria-col*`, `aria-row*`  | wrapper | wrapper (unchanged)                          |
| `title`                                                                                                    | wrapper | control — enables `pattern` validation hints |
| `ref`                                                                                                      | wrapper | control                                      |
| `data-*`, `className`, `style`                                                                             | wrapper | wrapper (unchanged)                          |
| focus, keyboard, input, clipboard, and `onInvalid` handlers on `Select`, `Combobox`, `Range`, and `Slider` | wrapper | control                                      |
| `id` on `Range` and `Slider`                                                                               | wrapper | control                                      |
| `role`, `aria-hidden`                                                                                      | wrapper | dropped — see below                          |

**`inputRef`, `textareaRef`, and `triggerRef` are removed.** Use `ref`, which now resolves to the control:

```diff
- <TextInput inputRef={inputRef} />
+ <TextInput ref={inputRef} />
```

This also means props spread from form libraries land correctly — `<TextInput {...register("email")} />` now passes React Hook Form's `ref` to the `<input>` rather than the wrapper.

**`role` and `aria-hidden` are no longer forwarded.** `role` would override a native control's implicit role or one a primitive manages itself; `aria-hidden` on the wrapper would hide a subtree containing a focusable element, which is invalid ARIA — use `hidden` or `inert` to hide the whole field.

**Fixes**

- `Select` and `Combobox` no longer duplicate `role` onto the wrapper, which previously produced two nested `role="combobox"` elements and a tab stop that focused nothing.
- Non-bubbling handlers such as `onInvalid`, `onMouseEnter`, and `onPointerEnter` now reach the element where they can actually fire.
- `Range` and `Slider` accept an `id` on the slider itself rather than the wrapper.

Attributes managed by the underlying primitives are no longer overridable: `aria-expanded`, `aria-controls`, `aria-haspopup`, and `tabIndex` on `Select`; `aria-expanded`, `aria-controls`, `aria-autocomplete`, and `aria-activedescendant` on `Combobox`; and the value ARIA attributes on `Range` and `Slider`.
