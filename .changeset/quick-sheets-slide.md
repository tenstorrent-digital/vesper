---
"@tenstorrent/vesper": patch
---

`<Sheet>` no longer uses an imperative ref API, and the `useSheet` hook has been removed. Instead, `<Sheet>` can be controlled with the new `open` and `onOpenChange` props, or left uncontrolled with `defaultOpen`. `ref` is now forwarded to the underlying `<dialog>` element.

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

Or leave out `open`, and open the sheet by calling `showModal()` (or `showPopover()` in popover mode) on the `<dialog>` element through `ref`:

```tsx
const ref = useRef<HTMLDialogElement>(null);

<Button onClick={() => ref.current?.showModal()}>Open sheet</Button>
<Sheet ref={ref} title="Settings" description="Manage your preferences." />
```
