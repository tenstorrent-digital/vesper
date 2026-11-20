---
"@tenstorrent/vesper": patch
---

`<Sheet>` no longer uses an imperative ref API, and the `useSheet` hook has been removed. Instead, control whether `<Sheet>` is open with the new required `open` and `onOpenChange` props. `ref` is now forwarded to the underlying `<dialog>` element, but the sheet only opens and closes when `open` changes, so don't call methods such as `showModal()` or `close()` on the `<dialog>` element through `ref`.

To migrate, store the open state yourself, and pass its setter to `onOpenChange` so the sheet closes when the user dismisses it:

```tsx
const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(true)}>Open sheet</Button>
<Sheet
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Settings"
  description="Manage your preferences."
/>
```

`<Sheet>` also has these changes:

- Widened the accepted `title` and `description` prop types from `string` to `NonNullable<ReactNode>`
- Pressing `Escape` now fires a `cancel` event on the `<dialog>` element, including in popover mode, so `onCancel` is called for every close request. Calling `preventDefault()` in `onCancel` keeps the sheet open, even when the user presses `Escape` several times in a row
