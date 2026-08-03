# Vesper

This monorepo houses the project code for Tenstorrent's software design system library, Vesper.

## Prerequisites

- This monorepo requires using `node >= 22`. If you are using node version manager, you can run `nvm use` to match the version specified in [.nvmrc](.nvmrc).
- Our package manager of choice is `yarn` classic (1.x)

## Installation

Clone the repo and install dependencies:

```sh
git clone https://github.com/tenstorrent-digital/vesper.git
cd vesper
yarn install
```

## Starting the development servers

```sh
yarn dev            # run the docs and the vesper package in dev mode
yarn dev:vesper     # Storybook for the component library (http://localhost:5173)
yarn dev:website    # documentation website (http://localhost:3000)
                    #   (note: builds @packages/vesper)
```

## Building apps/packages

```sh
yarn build            # build all apps and packages
yarn build:vesper     # build the component library only
yarn build:website    # build the documentation website only
yarn build:storybook  # build Storybook into apps/website/public/storybook
```

You usually don't need to build anything yourself locally.

## Testing

```sh
yarn test:vesper        # run the component library test suite
yarn test:watch:vesper  # run tests in watch mode
yarn check-types        # type-check all workspaces
```

## Formatting

We use [`prettier`](.prettierrc.ts) for formatting.

Please ensure that automatic formatting on save is configured in your editor.

To run formatting manually you can run the following command to format all files in the repository:

```sh
yarn format
```

You can also format specific files by passing them as arguments:

```sh
yarn format path/to/file.ts path/to/other-file.tsx
```

The same arguments work with `yarn format:check`, which checks formatting without writing any changes.

### Automatic Formatting Check

We use a git pre-commit hook to check that staged files have been formatted with [our formatting rules](.prettierrc.ts).

If you forgot to format some files in your changes, the hook will block your commit and offer to help you fix them.

### Installation

To install the hook, run the following command:

```sh
git config core.hooksPath .hooks
```

Alternatively, you can copy the hook to `.git/hooks` directly:

```sh
# Copy the hook to .git/hooks
cp .hooks/pre-commit .git/hooks/pre-commit

# Make the hook executable
chmod +x .git/hooks/pre-commit
```

<details>
<summary><h5>Bypass</h5></summary>

To bypass the hook for a single commit, add `--no-verify` to the end of your commit command

```sh
git commit --no-verify
```

</details>

## Developing `@tenstorrent/vesper`

Most day-to-day work when developing on top of the vesper package involves either creating new components, or updating existing components.

### Creating new components

If you need to create a new component in the `vesper` package, the quickest way to scaffold all the necessary code is to run `yarn scaffold:component` from the monorepo root.

The `scaffold:component` script will prompt you for two things:

1. The name of the component (required). The name should be written in PascalCase.
2. The root element of the component (optional). If you decide to specify the root element, it should be an intrinsic html element like div, input, h1, etc.

When all prompts have been answered, turbo will generate a new folder in `packages/vesper/src/components` containing:

1. `{component-name}.tsx` - the component file
2. `{component-name}.css` - the component css
3. `{component-name}.test.tsx` - test file for the component
4. `{component-name}.stories.tsx` - storybook file for the component

The scaffold command will also update `packages/vesper/src/styles/styles.css` to import the new css file, as well as modify the exports map in `package.json`.

### Updating existing components

Updating existing components involves modifying the files inside the corresponding component folder. A component's folder contains its main entrypoint file, css styles, test, and stories.

If you update a component to introduce new behavior, or change existing behavior, please make sure that you:

- Update any related JSDoc comments for the component and its prop types, as well as the related documentation in the `docs` folder
- Update the component tests to reflect the change in behavior
- Modify the component's story to enable showing the new behavior, if applicable

If a component's structure changes, we will need to update its snapshot tests. You can update snapshot tests across all test suites by running `yarn test:vesper:update` from the monorepo root, or `yarn test:update` from within the `vesper` package.

To update a specific test suite you can also supply a glob pattern to match whatever tests you would like to update the snapshots for:

```sh
yarn test:vesper -- -u src/components/menu/menu.test.tsx
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

### Writing documentation

Every component should have a corresponding documentation file in `docs/components`. If a component is missing documentation, you can scaffold the markdown file for its docs by running `yarn scaffold:documentation` from the workspace root. Doing so will create a new `{component-name}.mdx` file inside of `docs/components`, as well as update the component mappings in `apps/website/src/mdx-components.tsx`.

For more information on the docs folder and how our documentation files map to routes on the vesper documentation website, take a look at [the docs README.md file](docs/README.md).

## Releasing & publishing `@tenstorrent/vesper`

Publishing the `@tenstorrent/vesper` package happens through CI via [the release GitHub workflow](.github/workflows/release.yml). We use [changesets](https://changesets.dev) to automate changelog generation, package version incrementing, and publishing to the npm registry.

When there are changesets present on the `main` branch of this monorepo, there will be a `Version Packages` PR open on the vesper repository's Pull Requests tab on GitHub. When merged, this PR aggregates the changeset notes, buckets them into categories (patch/minor/major), appends them to the changelog, clears existing changesets, and publishes the `@tenstorrent/vesper` package to npm. When new changesets are added, a new `Version Pacakges` PR automatically opens again.
