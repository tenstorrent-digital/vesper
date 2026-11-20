---
"@tenstorrent/vesper": patch
---

Removed the `buttons` and `form` props from `<Sheet>`. Compose the sheet's content yourself instead, by rendering `<Button>` components and native `<form>` elements as its children.

To migrate, render your buttons inside the sheet's children, and wrap them in a `<form>` element if they should submit one:

```tsx
<Sheet
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Invite"
  description="Invite a teammate."
>
  <form
    style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}
    onSubmit={handleSubmit}
  >
    <TextInput required type="email" aria-label="Email address" name="email" />
    <div
      style={{ display: "flex", justifyContent: "flex-end", marginTop: "auto" }}
    >
      <Button type="submit">Send invite</Button>
    </div>
  </form>
</Sheet>
```
