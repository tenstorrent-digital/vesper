---
"@tenstorrent/vesper": patch
---

Add a `dismissible` prop to the `Modal` component. When set to `false`, the user can't dismiss the modal: pressing `Escape` and clicking the backdrop are ignored, and the close button in the header is disabled. This is useful for critical flows, such as while a form is submitting. The modal can still be closed programmatically with `close()`.
