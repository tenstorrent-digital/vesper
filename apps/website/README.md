# website

## Development

> [!IMPORTANT]
>
> Do not run these commands from this folder. Run everything from the **monorepo root** instead.

```bash
yarn dev        # docs + storybook + the @tenstorrent/vesper watcher
```

| Service                    | URL                                                         |
| -------------------------- | ----------------------------------------------------------- |
| Docs site                  | [localhost:3000](http://localhost:3000)                     |
| Storybook                  | [localhost:5173](http://localhost:5173)                     |
| Storybook (proxied in dev) | [localhost:3000/storybook](http://localhost:3000/storybook) |

### Notes

The docs app imports `@tenstorrent/vesper` from its **built output** (`packages/vesper/dist`), not
its source. `yarn dev` therefore builds the package first, then keeps it in sync with the
`@tenstorrent/vesper#watch` task, so edits under `packages/vesper/src` show up here automatically.

Storybook runs with `--exact-port`, so a process already sitting on port 5173 fails the task
instead of silently relocating and breaking the `/storybook` rewrite in
[`src/proxy.ts`](./src/proxy.ts).

### Turbopack caching

Turbopack's persistent dev cache is disabled for this app in
[`next.config.ts`](./next.config.ts) because `@tenstorrent/vesper` is compiled by a separate watcher and its output changes are outside the Next dev server's lifecycle.

To clean the (whole monorepo's) cache and start fresh you can run:

```bash
yarn clean      # removes .next, dist, and turbo caches across the repo
```

### Component demos

A `tsx` code block in `docs/**` tagged `demo` is rendered as a live example directly above the
code block itself, so an example and the code shown for it can never drift apart:

````mdx
```tsx demo
import { Toggle } from "@tenstorrent/vesper/toggle";

export default function UncontrolledToggle() {
  return (
    <Toggle
      aria-label="Display options"
      defaultValue="grid"
      options={[
        { value: "grid", text: "Grid" },
        { value: "list", text: "List" },
      ]}
    />
  );
}
```
````

A demo is a self-contained module: it imports what it uses and default exports the component to
render, which is also what makes it a complete, copyable example on GitHub (where it is only ever
a code block).

How it works:

1. Demos are extracted into `src/generated-demos`, which is gitignored. The [`generate-demos`](./scripts/generate-demos.ts)
   script contains the code responsible for this step.
2. Generated demos are imported and rendered back into their source documents, above the code blocks they are defined by.
   The [`remark-tsx-demos`](./src/lib/mdx/remark-tsx-demos.mts) remark plugin does this for us when compiling the docs.

Shared utilities and variables used in both steps live at [`src/lib/mdx/demos.mts`](./src/lib/mdx/demos.mts).

`yarn dev` generates demos before it starts and regenerates them as documents are edited, and
`yarn build` generates them prior to building, so there is nothing extra to run. To regenerate them by hand, run:

```bash
yarn workspace website generate:demos
```
