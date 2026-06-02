# @repo/vesper

Vesper is a design-system package that publishes a small set of foundational entrypoints today and is expected to grow to include additional component surfaces over time.

Current published entrypoints include:

- `@repo/vesper/styles.css` — global CSS token and component style imports
- `@repo/vesper/tokens` — token values as ESM exports
- `@repo/vesper/tailwind.css` — theme variables for first-class tailwind v4 integration support
- component entrypoints such as `@repo/vesper/Icon`, `@repo/vesper/Typography`, etc.
- tree-shakeable component barrels such as `@repo/vesper/icons`

## Development workflow

Most day-to-day work in this package falls into one of two categories:

1. Updating source assets
2. Creating new components
3. Building the package for local consumption or publishing

Typical flow:

1. Update source assets or component source files
2. Run the appropriate generation command(s) when asset-derived source needs to be refreshed
3. Review the generated files in `src/`
4. Run type checks / lint if needed
5. Run `yarn dev` while iterating locally, or `yarn build` when you want a clean publishable output in `dist/`

Generated source lives in `src/`, while publishable artifacts live in `dist/`.

### What `yarn dev` does

`yarn dev` orchestrates three smaller watch scripts:

- `yarn dev:tsc`
- `yarn dev:alias`
- `yarn dev:side-effects`

Together they keep `dist/` up to date as source files change.

This is intended for local package development where another workspace, such as `apps/docs`, consumes `@repo/vesper` from its built output.

A few details are worth knowing:

- authored source uses extensionless and aliased imports
- `tsc` writes JS, `.d.ts`, sourcemaps, and declaration maps into `dist/`
- `tsc-alias` runs in watch mode alongside `tsc` and rewrites emitted import specifiers so the output stays valid ESM with explicit `.js` extensions and relative paths
- a `chokidar`-based file watcher runs alongside both processes and mirrors all side-effectful (`*.css`, `*.woff2`) files anywhere under `src/` into matching locations under `dist/`, including new, changed, and deleted files

### What `yarn build` does

`yarn build` produces a clean publishable package in `dist/`.

It orchestrates a few smaller scripts:

- `yarn build:tsc`
- `yarn build:alias`
- `yarn build:side-effects`

Those steps perform the following work in order:

1. `yarn build:tsc` compiles source files to ESM plus declarations
2. `yarn build:alias` rewrites emitted import specifiers to relative ESM-compatible paths with `.js` extensions
3. `yarn build:side-effects` copies every side-effectful file (`*.css`, `*.woff2`) file under `src/` into the matching location under `dist/`

The result is a `dist/` directory that matches the package's export map and is ready for local consumption or publishing.

## Creating new components

Creating a new component can be done by running the command `yarn scaffold:component` from within the `packages/vesper` directory, or from the project root.

The `scaffold:component` script will prompt you for two things:

1. The name of the component (required). The name should be written in PascalCase.
2. The root element of the component (optional). If you decide to specify the root element, it should be an intrinsic html element like div, input, h1, etc.

When all prompts have been answered, turbo will generate a new folder for the component containing the tsx and css files for the component. It will also modify `src/styles/index.css` to import the new css file, as well as modify the exports map in `package.json`. Note that the exports map points to built files in the `dist` folder so the package will need to be rebuilt via `yarn build` before the new exports can be used.

## Regenerating icons

Icon assets can be exported as SVGs from [the UI Icon Library Figma File](https://www.figma.com/design/U8rXyED2u4SLkvUggDJ4VU/UI-Icon-Library?node-id=0-1&p=f&t=A4w3uadySYXLNGuU-11).

When files in `assets/icons/` change, regenerate the icon source:

```sh
yarn generate:icons
```

This updates the generated files in `src/components/Icon/`, including:

- individual icon components
- the registry used by `@repo/vesper/Icon`
- the tree-shakeable barrel used by `@repo/vesper/icons`

## Regenerating tokens

Token assets can be exported as JSON from [the Variables panel in the Vesper Design System Figma file](https://www.figma.com/design/Zfqx4Z0yPJk6hyCHYgqw5L/Vesper-Design-System?node-id=0-1&p=f&view=variables&var-set-id=2216-3822&m=dev).

When token JSON files in `assets/tokens/` change, regenerate the token source and CSS:

```sh
yarn generate:colors
yarn generate:spacing
yarn generate:radius
yarn generate:tracking
yarn generate:leading
```

Or run the root command to regenerate all token outputs:

```sh
yarn generate:tokens
```

These commands update generated files in:

- `src/tokens/`
- `src/styles/`

## Regenerating tailwind theme file

First-class tailwind support is a must for Vesper, as the first project we are building with it is TT-Studio, which already uses tailwind for styling. Whenever tokens change, we should regenerate the tailwind.css theme file. You can regenerate this file by running the following command in the workspace root or the `vesper` package directory:

```sh
yarn generate:tailwind
```

This command updates the generated tailwind theme file at `src/styles/tailwind.css`

## Regenerating everything

If for some reason you need to regenerate everything (tokens + icons + tailwind theme), you can run the following command in the workspace root or in the `vesper` package directory:

```sh
yarn generate:all
```

## Building

Build the package with:

```sh
yarn build
```

For watch mode during local development:

```sh
yarn dev
```

The build uses the TypeScript compiler directly and writes ESM output plus type declarations to `dist/`. Source files are authored with bundler-style resolution so imports can stay extensionless and may use the package's `tsconfig` path aliases; emitted files are rewritten back to explicit ESM-compatible paths during the build.

## Why the build is structured this way

The build pipeline is designed around a few goals:

### 1. Publish ESM that is easy for consumers to tree-shake

The package is emitted as ESM and exported from `dist/`. Public entrypoints are intended to support both ergonomic convenience APIs and more tree-shakeable surfaces, so consumers can opt into smaller bundles without much extra work.

Some convenience entrypoints may trade bundle efficiency for usability, while barrel-style or more granular component exports are intended to be friendlier to downstream tree shaking.

### 2. Preserve module boundaries

`tsc` preserves module boundaries by compiling source files into matching files in `dist/` instead of collapsing the package into a single bundle. That keeps the published output simple and gives downstream bundlers a better chance to eliminate unused component modules.

### 3. Treat CSS/fonts as side effects, but JS as side-effect free

`styles.css` is intentionally imported for side effects, so CSS files are preserved and copied into `dist`. Font files are also required for typography to work as expected, so are treated as side-effects as well. JS modules are otherwise structured so bundlers can eliminate unused exports.

### 4. Keep build-specific TS behavior isolated

The package uses a single `tsconfig.json` for both type-checking and build output. Build orchestration stays minimal: clean `dist/`, run `tsc`, rewrite emitted import specifiers with `tsc-alias`, then mirror `src/**/*.{css,woff2}` into matching paths under `dist/`.

### 5. Keep the published shape explicit

`package.json` exports point directly at built files in `dist/`, so the package contract is clear and stable for both local consumers and npm consumers.

## Notes

- `src/` contains authored and generated source files
- `dist/` contains publishable build output
- generated files in `src/` should be updated by scripts, not by hand
