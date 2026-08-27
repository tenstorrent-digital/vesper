---
"@tenstorrent/vesper": minor
---

Wire up validation semantics, fix competing accessible names, and add explicit prop bags for `Checkbox`, `TextInput`, `TextArea`, `Select`, `Combobox`, `Range`, and `Slider`.

**Error state is now conveyed programmatically.** Setting `variant="error"` previously only changed the styling, so assistive technology had no way to know the field was invalid. The control is now marked `aria-invalid`:

```tsx
<TextInput variant="error" message="Enter a valid email address" />
// input now carries aria-invalid="true"
```

Passing `aria-invalid` yourself still takes precedence. The `message` continues to be associated via `aria-describedby`, which is universally supported; `aria-errormessage` is left to you, and is forwarded to the control if supplied.

**A supplied `aria-labelledby` no longer competes with the default `aria-label`.** These components default `aria-label` to the visible label text, which previously remained in place even when a consumer supplied `aria-labelledby`, leaving two sources for the accessible name. The default is now suppressed. An explicitly-passed `aria-label` is still kept.

**New `controlProps` and `wrapperProps` escape hatches**, for anything the routing rules can't infer — a vendor attribute, a control-scoped `data-testid`, or a ref to the wrapper:

```tsx
<TextInput
  controlProps={{ "data-1p-ignore": true }}
  wrapperProps={{ id: "field-wrapper" }}
/>
```

`className`, `style`, and event handlers are merged with the component's own rather than replacing them. A control ref remains the top-level `ref`.

**Props that are not forwarded are now type errors** instead of silent no-ops. `role`, `aria-hidden`, `children`, and `dangerouslySetInnerHTML` were accepted by the prop types but dropped at runtime; passing one no longer compiles. Use `hidden` or `inert` in place of `aria-hidden`.
