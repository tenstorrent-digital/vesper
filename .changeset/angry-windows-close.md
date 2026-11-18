---
"@tenstorrent/vesper": patch
---

`<Modal>` no longer uses an imperative ref API, and the `useModal` hook has been removed. Instead, `<Modal>` can be controlled with the new `open` and `onOpenChange` props, or left uncontrolled with `defaultOpen`. `ref` is now forwarded to the underlying `<dialog>` element.

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

Or leave out `open`, and open the modal by calling `showModal()` on the `<dialog>` element through `ref`:

```tsx
const ref = useRef<HTMLDialogElement>(null);

<Button onClick={() => ref.current?.showModal()}>Open modal</Button>
<Modal ref={ref} title="Confirm" description="Are you sure?" />
```
