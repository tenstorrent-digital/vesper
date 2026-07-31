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
