---
"@tenstorrent/vesper": patch
---

Replace the per-component `ForwardedPropTypes` allowlists in `Checkbox`, `TextInput`, and `TextArea` with a shared attribute router, so a prop's destination is decided in one place instead of three. Prop destinations are unchanged, and are now locked in by a shared contract test suite.

`onSubmit` and `onReset` are no longer forwarded to the underlying control. Both events fire on the `<form>` element and bubble upwards, so a descendant input could never receive them.
