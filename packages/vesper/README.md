# @tenstorrent/vesper

Vesper is a design-system package that publishes a small set of foundational entrypoints today and is expected to grow to include additional component surfaces over time.

Current published entrypoints include:

- `@tenstorrent/vesper/styles.css` — global CSS token and component style imports
- `@tenstorrent/vesper/tokens` — token values as ESM exports
- `@tenstorrent/vesper/tailwind.css` — theme variables for first-class tailwind v4 integration support
- component entrypoints such as `@tenstorrent/vesper/Icon`, `@tenstorrent/vesper/Typography`, etc.
- tree-shakeable component barrels such as `@tenstorrent/vesper/icons`

## Development workflow

Most day-to-day work in this package falls into one of two categories:

1. Updating source assets
2. Creating new components
3. Building the package for local consumption or publishing

Typical flow:

1. Update source assets or component source files
2. Run the appropriate `generate:*` command when asset-derived source needs to be refreshed
3. Review the generated files in `src/`
4. Run type checks / lint if needed
5. Run `yarn dev` while iterating locally, or `yarn build` when you want a clean publishable output in `dist/`

Generated source lives in `src/`, while publishable artifacts live in `dist/`.

## Component development

We use [Storybook](https://storybook.js.org) for component development. From the monorepo root, `yarn dev:vesper` starts the storybook dev server on [localhost:3000](http://localhost:3000).

Storybook reads directly from `src`, so it needs no build step. It runs with `--exact-port`, so if something is already using port 3000 the task fails loudly rather than moving to another port — `apps/docs` proxies `/storybook` to that exact port in development.

Storybook is intended for local package development only. Workspaces that make use of the vesper package, such as `apps/docs`, should consume `@tenstorrent/vesper` from its built output.

### Creating new components

Creating a new component can be done by running the command `yarn scaffold:component` from within the `packages/vesper` directory, or from the project root.

The `scaffold:component` script will prompt you for two things:

1. The name of the component (required). The name should be written in PascalCase.
2. The root element of the component (optional). If you decide to specify the root element, it should be an intrinsic html element like div, input, h1, etc.

When all prompts have been answered, turbo will generate a new folder for the component containing:

1. `{component-name}.tsx` - the component file
2. `{component-name}.css` - the component css
3. `{component-name}.test.tsx` - test file for the component
4. `{component-name}.stories.tsx` - storybook file for the component

The scaffold command will also update `src/styles/index.css` to import the new css file, as well as modify the exports map in `package.json`. Note that the exports map points to built files in the `dist` folder so the package will need to be rebuilt via `yarn build` before the new exports can be used externally.

### Testing components

Scaffolding a component from the command line will create a `.test.tsx` file in the component folder. We use [vitest](https://vitest.dev/) with `playwright` and `axe` for in-browser unit, snapshot, and a11y testing. The scaffolded test file contains three describe blocks:

1. `component-name [unit]` - this describe block should be used for writing unit tests related to prop behavior. Use this block to assert that CSS classes are being applied correctly, event handlers are firing as expected, and polymorphism is working as intended.
2. `component-name [snapshot]` - this describe block should be used for writing snapshot tests. Many of our components have dozens of permutations, so we can use this describe block to create snapshots of them all so if something changes unexpectedly we get warned about it.
3. `component-name [a11y]` - this describe block should be used for asserting that all component permutations comply with WCAG 2 AAA standards. We use `axe` to confirm that all permutations for the component have no violations in both light and dark mode.

#### Updating snapshots

If a component's structure changes, we will need to update its snapshot tests. You can update snapshot tests across all test suites by running `yarn test:vesper:update` from the monorepo root, or `yarn test:update` from within the `vesper` package.

To update a specific test suite you can also supply a glob pattern to match whatever tests you would like to update the snapshots for:

```sh
yarn test -- -u src/components/menu/menu.test.tsx
```

### Regenerating icon components

Icon assets can be exported as SVGs from [the UI Icon Library Figma File](https://www.figma.com/design/U8rXyED2u4SLkvUggDJ4VU/UI-Icon-Library?node-id=0-1&p=f&t=A4w3uadySYXLNGuU-11).

When files in `assets/icons/` change, regenerate the icon source:

```sh
yarn generate:icons
```

This updates the generated files in `src/components/icon/`, including:

- individual icon components
- the registry used by `@tenstorrent/vesper/icon`
- the tree-shakeable barrel used by `@tenstorrent/vesper/icons`

## Building

Build the package with:

```sh
yarn build
```

`yarn build` produces a clean publishable package in `dist/`.

It orchestrates a few smaller scripts:

- `yarn build:tsc`
- `yarn build:alias`
- `yarn build:css`

Those steps perform the following work in order:

1. `yarn build:tsc` compiles source files to ESM plus declarations
2. `yarn build:alias` rewrites emitted import specifiers to relative ESM-compatible paths with `.js` extensions
3. `yarn build:css` copies every side-effectful file file under `src/` into the matching location under `dist/`

The result is a `dist/` directory that matches the package's export map and is ready for local consumption or publishing.

## Why the build is structured this way

The build pipeline is designed around a few goals:

### 1. Publish ESM that is easy for consumers to tree-shake

The package is emitted as ESM and exported from `dist/`. Public entrypoints are intended to support both ergonomic convenience APIs and more tree-shakeable surfaces, so consumers can opt into smaller bundles without much extra work.

Some convenience entrypoints may trade bundle efficiency for usability, while barrel-style or more granular component exports are intended to be friendlier to downstream tree shaking.

### 2. Preserve module boundaries

`tsc` preserves module boundaries by compiling source files into matching files in `dist/` instead of collapsing the package into a single bundle. That keeps the published output simple and gives downstream bundlers a better chance to eliminate unused component modules.

### 3. Treat CSS as side effects, but JS as side-effect free

`styles.css` is intentionally imported for side effects, so CSS files are preserved and copied into `dist`. JS modules are otherwise structured so bundlers can eliminate unused exports.

### 4. Keep build-specific TS behavior isolated

The package uses a single `tsconfig.json` for both type-checking and build output. Build orchestration stays minimal: clean `dist/`, run `tsc`, rewrite emitted import specifiers with `tsc-alias`, then mirror side-effectful files into matching paths under `dist/`.

### 5. Keep the published shape explicit

`package.json` exports point directly at built files in `dist/`, so the package contract is clear and stable for both local consumers and npm consumers.

## Notes

- `src/` contains authored and generated source files
- `dist/` contains publishable build output
- generated icon component files in `src/` should be updated by scripts, not by hand
