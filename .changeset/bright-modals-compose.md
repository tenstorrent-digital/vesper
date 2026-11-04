---
"@tenstorrent/vesper": patch
---

Remove the `maxHeight`, `buttons`, `buttonsAlignment`, and `form` props from `Modal`. Consumers now compose a modal's content themselves by rendering it as children:

- Instead of `buttons`/`buttonsAlignment`, render `Button` components inside the modal and lay them out as needed
- Instead of `form`, render a `<form>` element inside the modal, with the form's fields and buttons inside it
- Instead of `maxHeight`, wrap long content in an element with its own `maxHeight` and `overflowY: "auto"`. The modal now grows to fit its content, and its body no longer scrolls on its own
