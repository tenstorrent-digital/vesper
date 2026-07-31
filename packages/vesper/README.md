# @tenstorrent/vesper

Vesper is a React component library for the Vesper design system.

## Development workflow

Most day-to-day work in this package involves either creating new components, or updating existing components. We use [Storybook](https://storybook.js.org) for component development. From the monorepo root, `yarn dev:vesper` starts the storybook dev server on [localhost:3000](http://localhost:3000).

Storybook is intended for local package development only. Workspaces that make use of the vesper package, such as the docs, should consume `@tenstorrent/vesper` from its built output.

### Creating new components

If you need to create a new component in the `vesper` package, the quickest way to scaffold all the necessary code is to run `yarn scaffold:component` from the monorepo root.

The `scaffold:component` script will prompt you for two things:

1. The name of the component (required). The name should be written in PascalCase.
2. The root element of the component (optional). If you decide to specify the root element, it should be an intrinsic html element like div, input, h1, etc.

When all prompts have been answered, turbo will generate a new folder in `src/components` containing:

1. `{component-name}.tsx` - the component file
2. `{component-name}.css` - the component css
3. `{component-name}.test.tsx` - test file for the component
4. `{component-name}.stories.tsx` - storybook file for the component

The scaffold command will also update `src/styles/styles.css` to import the new css file, as well as modify the exports map in `package.json`. Finally, a `{component-name}.mdx` documentation file will be created in the root `docs` folder for the new component.

### Updating existing components

Updating existing components involves modifying the files inside the corresponding component folder. A component's folder contains its main entrypoint file, css styles, test, and stories.

If you update a component to introduce new behavior, or change existing behavior, please make sure that you:

- Update any related JSDoc comments for the component and its prop types, as well as the related documentation in the `docs` folder
- Update the component tests to reflect the change in behavior
- Modify the component's story to enable showing the new behavior, if applicable

Additionally, if a component's structure changes, we will need to update its snapshot tests. You can update snapshot tests across all test suites by running `yarn test:vesper:update` from the monorepo root, or `yarn test:update` from within the `vesper` package.

To update a specific test suite you can also supply a glob pattern to match whatever tests you would like to update the snapshots for:

```sh
yarn test -- -u src/components/menu/menu.test.tsx
```

### Testing components

Scaffolding a component from the command line will create a `.test.tsx` file in the component folder. We use [vitest](https://vitest.dev/) with `playwright` and `axe` for in-browser unit, snapshot, and a11y testing. The scaffolded test file contains three describe blocks:

1. `component-name [unit]` - this block should be used for writing unit tests related to prop behavior. Use this block to assert that CSS classes are being applied correctly, event handlers are firing as expected, polymorphism is working as intended, etc.
2. `component-name [snapshot]` - this block should be used for writing snapshot tests. Many of our components have dozens of permutations, so we can use this describe block to create snapshots of them all so if something changes unexpectedly we get warned about it.
3. `component-name [a11y]` - this block should be used for asserting that all component permutations comply with WCAG 2 AAA standards. We use `axe` to confirm that all permutations for the component have no violations in both light and dark mode. Please note that currently we mark failing accessibility tests as `todo` – the vast majority of these `todo`-marked tests fail due to insufficient color contrast ratios, which depend on updates from the design team to fix.

### Regenerating icon components

Generated icon component files in `src/components/icons/*` should be updated by scripts, not by hand. Icon assets can be exported as SVGs from [the UI Icon Library Figma File](https://www.figma.com/design/U8rXyED2u4SLkvUggDJ4VU/UI-Icon-Library?node-id=0-1&p=f&t=A4w3uadySYXLNGuU-11).

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
3. `yarn build:css` copies every css file under `src/` into the matching location under `dist/`

The result is a `dist/` directory that matches the package's export map and is ready for local consumption or publishing.

## Releasing

Releasing the `@tenstorrent/vesper` package happens through CI via [the release GitHub workflow](../../.github/workflows/release.yml). We use [changesets](https://changesets.dev) to automate changelog generation, package version incrementing, and publishing to the npm registry.

When there are changesets present in this monorepo, there will be a `Version Packages` PR open on the vesper github Pull Requests tab. When merged, this PR aggregates the changeset notes, buckets them into categories (patch/minor/major), appends them to the changelog, clears existing changesets, and publishes the `@tenstorrent/vesper` package to npm. When new changesets are added, a new `Version Pacakges` PR automatically opens again.
