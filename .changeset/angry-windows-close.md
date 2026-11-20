---
"@tenstorrent/vesper": patch
---

`<Modal>` no longer uses an imperative ref API, and the `useModal` hook has been removed. Instead, control whether `<Modal>` is open with the new required `open` and `onOpenChange` props. `ref` is now forwarded to the underlying `<dialog>` element, but the modal only opens and closes when `open` changes, so don't call `showModal()` or `close()` on the `<dialog>` element through `ref`.

To migrate, store the open state yourself, and pass its setter to `onOpenChange` so the modal closes when the user dismisses it:

```tsx
const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(true)}>Open modal</Button>
<Modal
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Confirm"
  description="Are you sure?"
/>
```

`<Modal>` also has these changes:

- Widened the accepted `title` and `description` prop types from `string` to `NonNullable<ReactNode>`
- Pressing `Escape` now fires a `cancel` event on the `<dialog>` element, including when `dismissible` is `false`, so `onCancel` is called for every close request. Calling `preventDefault()` in `onCancel` keeps the modal open, even when the user presses `Escape` several times in a row
