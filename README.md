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
yarn dev:vesper     # Storybook for the component library (http://localhost:3000)
yarn dev:website    # documentation website (http://localhost:3001)
                    #   (note: builds @packages/vesper)
```

## Generating new components

If you need to create a new component in the `vesper` package, the quickest way to scaffold all the necessary code is to run `yarn scaffold:component` from the monorepo root.

The `scaffold:component` script will prompt you for two things:

1. The name of the component (required). The name should be written in PascalCase.
2. The root element of the component (optional). If you decide to specify the root element, it should be an intrinsic html element like div, input, h1, etc.

When all prompts have been answered, turbo will generate a new folder for the component containing:

1. `{component-name}.tsx` - the component file
2. `{component-name}.css` - the component css
3. `{component-name}.test.tsx` - test file for the component
4. `{component-name}.stories.tsx` - storybook file for the component

The scaffold command will also update `src/styles/styles.css` to import the new css file, as well as modify the exports map in `package.json`.

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
