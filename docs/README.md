# Vesper Documentation

Documentation source for the Vesper design system. Every file here becomes a page on the documentation website, which lives in [`apps/website`](/apps/website).

## Page Mapping

Documents in `docs/` map directly to pages on the documentation site in `@apps/website`

| `docs/` File               | `@apps/website` URL path |
| -------------------------- | ------------------------ |
| `getting-started.mdx`      | `/getting-started`       |
| `components/accordion.mdx` | `/components/accordion`  |

> [!IMPORTANT]
>
> Page routes inside `apps/website/src/app` (like `/components`) will take precedence over any files in `docs/`

## Frontmatter

> Used for metadata and navigation only

```yaml
---
title: Accordion
description: A collapsible content panel
order: 1 # optional
---
```

## Components

Vesper components can be used **without importing them**. Components are provided to every document by [`mdx-components.tsx`](/apps/website/src/mdx-components.tsx)

```mdx
<Accordion title="Click to expand">This is the accordion content.</Accordion>
```

> [!IMPORTANT]
>
> Documents are rendered on the server, so a component that needs **non-serializable props** - event handlers, refs, or state - cannot be used here:
>
> ```mdx
> <!-- won't work since `onSelect` is a function 😞 -->
>
> <Menu items={[{ text: "Edit", onSelect: () => {} }]}>…</Menu>
> ```
>
> Those live in [`apps/website/src/demos`](/apps/website/src/demos) as client components and are exposed to documents by name, eg. `<MenuDemo />`.

## Links

Links resolve to other documents by relative path the path resolves on GitHub (it points at the real file) and is rewritten to the document's route when the site is built:

| In `docs/`                                  | On `@apps/website`        |
| ------------------------------------------- | ------------------------- |
| `[Icon Button](./icon-button.mdx)`          | `/components/icon-button` |
| `[Getting Started](../getting-started.mdx)` | `/getting-started`        |

## Some notes

### Do not use these in documentation

- `import` statements (components are already in scope) - see [MDX components](/apps/website/src/mdx-components.tsx) to add more
- JSX expressions in link destinations (maybe later)
- HTML comments (`<!-- -->`) in both `.md` and `.mdx` files since MDX has trouble with these - use `{/* my comment */}`
- image files (later)
