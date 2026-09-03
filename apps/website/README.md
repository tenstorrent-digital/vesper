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

## Structure

```
src/
  app/
    page.tsx              home — hero, control deck, component wall, specimen
    [...doc]/             every `.md`/`.mdx` file in the monorepo root `docs/`
    components/           the filterable component gallery
    agents/               the agent console (+ `manifest.json`)
    raw/[...doc]/         raw markdown, reached as `<any-page>.md`
    llms.txt/             site map for language models
    llms-full.txt/        every document, concatenated
  components/
    shell/                top bar, rail, mobile drawer, footer
    doc/                  document header, table of contents, prev/next
    search/               the ⌘K command palette
    showcase/             one live preview per component (gallery + home)
    home/                 hero, marquee, control deck, wall, specimen
    agents/               agent mode, and the console's interactive pieces
  lib/
    nav.ts                the navigation model every surface reads from
    agents.ts             everything served to machines
    search.ts             the palette's index
    filesystem/docs/      the `docs/` index, loader, and raw source reader
    mdx/                  remark/rehype plugins
    style/css/            globals, prose, surfaces, home, agents
```

`src/lib/nav.ts` is the single source of truth for navigation: it merges the
documents in `docs/` with the app's own routes, so adding a file to `docs/`
gives you a sidebar entry, a breadcrumb, a search result, a prev/next link, a
sitemap entry, and an `llms.txt` line without touching this app.

## Endpoints for agents

A good share of the traffic to a component library's docs is a crawler or a
coding agent. Rather than make them parse the rendered HTML, the same content
is served as plain text:

| Route                   | What it is                                                |
| ----------------------- | --------------------------------------------------------- |
| `/llms.txt`             | one line per page, linking to markdown (llmstxt.org)      |
| `/llms-full.txt`        | every document in `docs/`, concatenated                   |
| `/<any-page>.md`        | that page's raw markdown source                           |
| `/agents`               | cheat sheet, prompt packs, and house rules                |
| `/agents/manifest.json` | the above as JSON, mirrored at `/.well-known/agents.json` |

All of them are generated at build time from `docs/`, so they cannot drift from
the rendered pages. The `.md` and `/.well-known/` routes are rewrites — see
[`src/proxy.ts`](./src/proxy.ts).

There is also **agent mode** (⌥A, or the robot in the top bar): a site-wide
phosphor skin built entirely by re-pointing Vesper tokens.
