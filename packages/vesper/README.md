# @repo/vesper

Vesper is a design-system package that publishes a small set of foundational entrypoints today and is expected to grow to include additional component surfaces over time.

Current published entrypoints include:

- `@repo/vesper/styles.css` — global CSS token imports
- `@repo/vesper/tokens` — token values as ESM exports
- component entrypoints such as `@repo/vesper/Icon`
- tree-shakeable component barrels such as `@repo/vesper/icons`

## Development workflow

Most day-to-day work in this package falls into one of two categories:

1. Updating source assets
2. Building the package for local consumption or publishing

Typical flow:

1. Update source assets or component source files
2. Run the appropriate generation command(s) when asset-derived source needs to be refreshed
3. Review the generated files in `src/`
4. Run type checks / lint if needed
5. Build the package to `dist/`

Generated source lives in `src/`, while publishable artifacts live in `dist/`.

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

## Building

Build the package with:

```sh
yarn build
```

For watch mode during local development:

```sh
yarn dev
```

The build uses `tsup` and writes ESM output plus type declarations to `dist/`.

## Why the build is structured this way

The build pipeline is designed around a few goals:

### 1. Publish ESM that is easy for consumers to tree-shake

The package is emitted as ESM and exported from `dist/`. Public entrypoints are intended to support both ergonomic convenience APIs and more tree-shakeable surfaces, so consumers can opt into smaller bundles without much extra work.

Some convenience entrypoints may trade bundle efficiency for usability, while barrel-style or more granular component exports are intended to be friendlier to downstream tree shaking.

### 2. Preserve module boundaries

`tsup` is configured with `bundle: false` so files remain separate modules in `dist/` instead of being collapsed into one library bundle. That keeps the published output simple and gives downstream bundlers a better chance to eliminate unused component modules.

### 3. Treat CSS as a side effect, but JS as side-effect free

`styles.css` is intentionally imported for side effects, so CSS files are preserved and copied into `dist/styles`. JS modules are otherwise structured so bundlers can eliminate unused exports.

### 4. Keep build-specific TS behavior isolated

The package uses a separate `tsconfig.build.json` for `tsup`. This avoids `NodeNext` declaration-generation issues during the build while leaving the package's normal type-checking setup in place.

### 5. Keep the published shape explicit

`package.json` exports point directly at built files in `dist/`, so the package contract is clear and stable for both local consumers and npm consumers.

## Notes

- `src/` contains authored and generated source files
- `dist/` contains publishable build output
- generated files in `src/` should be updated by scripts, not by hand
