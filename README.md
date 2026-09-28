# Vesper

This monorepo houses the project code for Tenstorrent's software design system library, Vesper.

## Prerequisites

- This monorepo requires using `node` v24, with a minimum version specified in [.nvmrc](.nvmrc) and [package.json](package.json). If you are using node version manager, you can run `nvm use` to match the version specified in [.nvmrc](.nvmrc).
- Our package manager of choice is `yarn` classic (1.x) to handle dependencies and workspace commands across the monorepo.

## Installing

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

## Quality

You can run quality checks (linting, formatting, and type-checking) by running the following commands:

```sh
yarn quality            # run linting, formatting, and type-checking
yarn quality:fix        # fix problems
```

### Linting and Formatting

We use `oxlint` for linting, and `oxfmt` for formatting.

> [!IMPORTANT]
>
> Please ensure that automatic formatting on save is configured in your editor. [See below for more details about editor support.](#editor-support)

```sh
# linting
yarn lint                # check for linting errors
yarn lint:fix            # fix auto-fixable lint problems

# formatting
yarn format              # check formatting
yarn format:fix          # fix auto-fixable formatting problems
yarn format:fix file.ts  # fix auto-fixable formatting problems for a specific file
```

#### Config

For configurations, please see:

- [`packages/oxlint-config`](./packages/oxlint-config) for shared `oxlint` configs
- `oxlint.config.mts` for each package and app's own `oxlint` config
- [`.oxfmtrc.json`](.oxfmtrc.json) for the `oxfmt` config used across the monorepo

#### Editor Support

We have editor support for using `oxlint` and `oxfmt` for your editor's LSP, lint, and format tools.

See individual editor settings for more details:

- [Zed](.zed/settings.json) (requires [extension](https://github.com/oxc-project/oxc-zed))
- [Helix](.helix/languages.toml)
- [VSCode](.vscode/settings.json) (requires [extension](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode))

### Vale

We use [`vale`](https://docs.vale.sh) to lint prose across the monorepo. This includes the documentation in [`docs/`](./docs/) and any code comments in the codebase.

To check for prose errors, you can run:

```sh
yarn vale [files/*|file.ts] # check prose with vale
yarn vale:diff              # check prose with vale against `main`
```

Please use `vale:diff` to ensure your work conforms to our prose standards. It would also be helpful if you could address any prose errors in any files you change. This helps ensure that prose across the monorepo is consistent and follows our standards.

The configuration for `vale` is available in [`.vale.ini`](./.vale.ini)

## Developing `@tenstorrent/vesper`

### Creating new components

To create a new component, the quickest way to scaffold all the necessary code is to run `yarn scaffold:component` from the monorepo root:

```sh
yarn scaffold:component
```

You will be prompted for:

1. The name of the component (required)
2. The root element of the component (optional). The root element should be an intrinsic HTML element like div, input, h1, etc. Specifying the root element will set up the newly scaffolded component's props to extend the attributes of the underlying element.

When all prompts have been answered, turbo will generate a new folder in `packages/vesper/src/components` containing:

1. `{name}.tsx` - the component file
2. `{name}.css` - the component css
3. `{name}.test.tsx` - test file for the component
4. `{name}.stories.tsx` - storybook file for the component

The scaffold command will also update `packages/vesper/src/styles/styles.css` to import the new css file, as well as modify the exports map in `packages/vesper/package.json`.

### Updating existing components

Updating existing components involves modifying the files inside the corresponding component folder. A component's folder contains its main entrypoint file, css styles, test, and stories.

If you update a component to introduce new behavior, or change existing behavior, please make sure that you:

1. Update any related JSDoc comments for the component and its prop types, as well as the related documentation in the `docs/` folder
2. Update the component tests to reflect the change in behavior
3. Modify the component's story to enable showing the new behavior, if applicable

If a component's structure changes, you will need to update its snapshot tests. You can update snapshot tests across all test suites by running `yarn test:vesper:update` from the monorepo root, or `yarn test:update` from within the `vesper` package.

To update a specific test suite you can also supply a glob pattern to match whatever tests you would like to update the snapshots for:

```sh
yarn test:vesper -- -u src/components/menu/menu.test.tsx
```

### Tests

We use [vitest](https://vitest.dev/) with `playwright` and `axe` for in-browser unit, snapshot, and a11y testing.

Each component's test file contains three describe blocks:

1. `component-name [unit]` - This block should be used for writing unit tests related to prop behavior. Use this block to assert that CSS classes are being applied correctly, event handlers are firing as expected, polymorphism is working as intended, etc.
2. `component-name [snapshot]` - This block should be used for writing snapshot tests. Many of our components have dozens of permutations, so we can use this describe block to create snapshots of them all so if something changes unexpectedly we get warned about it.
3. `component-name [a11y]` - This block should be used for running the configured accessibility checks for the covered component permutations. We use `axe` to test that all permutations for each component pass [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/) for both light and dark mode.

> [!NOTE]
>
> Please note that currently we mark failing accessibility tests as `todo` – the vast majority of these `todo`-marked tests fail due to insufficient color contrast ratios, which depend on updates from the design team to fix.

### Regenerating icon components

Generated icon component files in `src/components/icons/*` should not be updated by hand. Icon assets can be exported as SVGs from [the UI Icon Library Figma File](https://www.figma.com/design/U8rXyED2u4SLkvUggDJ4VU/UI-Icon-Library?node-id=0-1&p=f&t=A4w3uadySYXLNGuU-11).

When files in `assets/icons/` change, regenerate the icon source:

```sh
yarn generate:icons
```

This updates the generated files in `src/components/icons/`, including:

- individual icon components
- the registry used by `@tenstorrent/vesper/icon`
- the tree-shakeable barrel used by `@tenstorrent/vesper/icons`

### Regenerating the tailwind-merge plugin

The `withVesper` tailwind-merge plugin (`src/utils/tailwind-merge.ts`) and its tests (`src/utils/tailwind-merge.test.ts`) are generated from the theme variables in `src/styles/tailwind.css` and the utilities in `src/styles/tailwind-utilities.css`, and should not be updated by hand.

When either stylesheet changes, regenerate the plugin and its tests:

```sh
yarn generate:tailwind-merge
```

If the script reports an unsupported theme variable namespace or CSS property, add it to `NAMESPACES` or `PROPERTIES` in `scripts/generate-tailwind-merge.ts`, then run the command again.

### Writing documentation

Every component should have a corresponding documentation file in `docs/components`. If a component is missing documentation, you can scaffold the markdown file for its docs by running `yarn scaffold:documentation` from the workspace root. Doing so will create a new `{component-name}.mdx` file inside of `docs/components`, as well as update the component mappings in `apps/website/src/mdx-components.tsx`.

For more information on the docs folder and how our documentation files map to routes on the vesper documentation website, take a look at [the docs README.md file](docs/README.md).

## Releasing `@tenstorrent/vesper`

Releasing the `@tenstorrent/vesper` package happens through CI via two GitHub workflows. We use [changesets](https://changesets.dev) to automate changelog generation, package version incrementing, and release tagging.

### Versioning

[The version workflow](.github/workflows/version.yml) runs automatically on every push to `main`. When there are changesets present on the `main` branch of this monorepo, it opens (or updates) a `Version Packages` PR on the vesper repository's Pull Requests tab on GitHub. That PR aggregates the changeset notes, buckets them into categories (patch/minor/major), appends them to the changelog, and clears the existing changesets. When new changesets are added, a new `Version Packages` PR automatically opens again.

### Releasing

[The release workflow](.github/workflows/release.yml) also runs on every push to `main`, but its first job just checks whether a release is actually pending (no changesets remain, and the version in `packages/vesper/package.json` has no git tag yet).

When a release is pending, the publishing job pauses and waits for manual approval from a reviewer on the `release` GitHub environment. This is intentional friction around publishing to npm. Once approved, it creates Git tags and GitHub releases and publishes the `@tenstorrent/vesper` package to npm.
