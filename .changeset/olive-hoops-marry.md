---
"@tenstorrent/vesper": patch
---

Route `onScroll` and `onWheel` to the control rather than the wrapper on form inputs. The element that overflows is the `<textarea>` or input, never the presentational wrapper — and because `onScroll` doesn't bubble, routing it to the wrapper meant it could never fire at all:

```tsx
<TextArea onScroll={handleScroll} />
// previously attached to the wrapper, where a scroll event never reaches it
```

No workaround is needed for this any more; `controlProps={{ onScroll }}` can be removed.
