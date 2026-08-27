---
"@tenstorrent/vesper": minor
---

Wire up validation semantics, fix competing accessible names, and add narrow escape hatches for `Checkbox`, `TextInput`, `TextArea`, `Select`, `Combobox`, `Range`, and `Slider`.

**Error state is now conveyed programmatically.** Setting `variant="error"` previously only changed the styling, so assistive technology had no way to know the field was invalid. The control is now marked `aria-invalid`:

```tsx
<TextInput variant="error" message="Enter a valid email address" />
// input now carries aria-invalid="true"
```

Passing `aria-invalid` yourself still takes precedence. The `message` continues to be associated via `aria-describedby`, which is universally supported; `aria-errormessage` is left to you, and is forwarded to the control if supplied.

**A supplied `aria-labelledby` no longer competes with the default `aria-label`.** These components default `aria-label` to the visible label text, which previously remained in place even when a consumer supplied `aria-labelledby`, leaving two sources for the accessible name. The default is now suppressed. An explicitly-passed `aria-label` is still kept.

**New `controlData`, `wrapperId`, and `wrapperRef` props**, covering the three things the routing rules deliberately don't:

```tsx
<TextInput
  type="password"
  controlData={{ "data-1p-ignore": true }}
  wrapperId="email-field"
  wrapperRef={wrapperRef}
/>
```

`data-*` attributes normally go to the wrapper; `controlData` puts them on the control instead, for password managers, analytics hooks, or a control-scoped test id. `wrapperId` and `wrapperRef` exist because the top-level `id` and `ref` now go to the control.

There is deliberately no way to pass arbitrary props, `className`, or `style` to the control — these components own their own appearance and semantics.

**Props that are not forwarded are now type errors** instead of silent no-ops. `role`, `aria-hidden`, `children`, and `dangerouslySetInnerHTML` were accepted by the prop types but dropped at runtime; passing one no longer compiles. Use `hidden` or `inert` in place of `aria-hidden`.
