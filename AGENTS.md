# Agent Development Guide

Monorepo for Vesper, a design system React component library, with apps and shared packages for development and documentation.

## Architecture

### Monorepo Overview

- Monorepo managed using Turbo (turborepo)
- All repository scripts and commands should be run from the monorepo root

### Layout and Apps

- `packages/vesper/` - Design system components
- `apps/website/` — Design system documentation frontend
- `docs/` — Design system documentation source (`.md`/`.mdx`)
- `packages/oxlint-config/` — Shared Oxlint configurations
- `packages/typescript-config/` — Shared TypeScript configurations

## Package Management

- You **must** use the latest version of Yarn (classic): 1.x
  ```bash
  yarn --version      # check yarn version: must be 1.x
  ```
- **You must not use npm to manage dependencies**
- Installing dependencies:
  - Install packages from the monorepo root using `yarn workspace <workspace-name> add <package>`
  - You must never edit dependencies directly in any `package.json`
- These rules do not apply to documentation files (see [Documentation Files](#documentation-files-md-mdx))

## Commands

- Scripts should be run from the repo root:
  ```
  # run a script in root package.json (preferred)
  yarn run <script>
  ```
- Monorepo root `package.json` scripts should use Turbo (turborepo) "tasks"
  - Tasks to run scripts that are defined in `{apps,packages}/**/package.json`
  - Tasks are configured in the root `turbo.jsonc`
  - Individual apps/packages may define their own `turbo.jsonc` to override root settings
- Use `yarn workspace <workspace-name> <yarn-command> <script>` to run a script in an app/package
- Do not navigate into an app/package directory to run script from that app's `package.json`
- Running one-off commands:
  - Use `npx <command>` to run a command without installing it as a dependency
  - Do not use `yarn dlx`
- These rules do not apply to documentation files (see [Documentation Files](#documentation-files-md-mdx))

## Other Tools

- GitHub CLI `gh` for PRs
- Github CLI stacked PRs extension `gh stack -h`
- `linear-cli` for Linear issue tracking

## Setup

```bash
# install dependencies
yarn install
```

## Documentation Files (`.md`, `.mdx`)

The Package Management, Commands, and Setup rules above describe how **you** install packages and run commands in this monorepo. They are not content rules for documentation.

- Do not apply them to `.md` or `.mdx` files
- Leave package manager commands written in documentation (prose, code blocks, examples, and component demos) exactly as authored — eg. `npm install @repo/vesper` in `docs/` is intentional
- Only change package manager commands in documentation when explicitly asked to

## Testing and Quality

You can use the following commands from the repository root to validate your work:

```bash
yarn quality:agent          # check everything: linting, formatting and types
yarn lint --format agent    # check for linting problems only (oxlint, does not write)
yarn format                 # check formatting only (oxfmt --check, does not write)
yarn check-types            # check for type errors only (tsc --noEmit, per workspace)
```

Before you commit any changes, run the following commands to ensure your code is free of linting and type errors, and properly formatted:

```bash
# fix any auto-fixable linting problems, then format code
yarn quality:fix

# then check whatever couldn't be fixed automatically (lint, format, types)
yarn quality:agent
```

`lint` and `format` are repo-wide turbo root tasks (`//#lint`, `//#format`): running `yarn lint --format agent` or `yarn format` invokes oxlint/oxfmt directly over the whole monorepo in a single pass. `check-types` stays a per-package task so each workspace is checked against its own `tsconfig.json`. `yarn quality` runs all three through turbo, so its results are cached

When running tests, set `AGENTS=true` so the browser runs in headless mode:

```bash
AGENTS=true yarn test
```

## Linting

Linting is handled by Oxlint

- Shared configs live in `packages/oxlint-config/` and are consumed by name (`@repo/oxlint-config/next`)
- Each workspace has its own `oxlint.config.mts`, discovered automatically by the repo-wide `oxlint .` run (the `//#lint` root turbo task) — there are no per-package lint scripts

### Disabling Lint Rules

- Use `oxlint-disable-next-line [rule-name]` or `oxlint-disable [rule-name]`
- Prefer `oxlint-disable-next-line` over `oxlint-disable`
- When using `oxlint-disable-next-line` or `oxlint-disable` inline comments, you must:
  - Add the `[rule-name]` for the rule to disable in the inline comment
  - Add a comment explaining why the rule is disabled
- If you disable a rule for a block of code using `oxlint-disable [rule-name]`, you must re-enable it using `oxlint-enable [rule-name]`
- Do not use `eslint-disable-next-line` or `eslint-disable` comments since we use Oxlint

## Formatting

Formatting is handled by Oxfmt

- `yarn format` and `yarn format:fix` run `oxfmt --check` and `yarn format:fix`, respectively — both cover the entire codebase from the monorepo root

## Linear and Github Pull Requests

Linear

- Use linear-cli to get issue IDs and details
- Linear Issue IDs may also be found in the branch name (format: `tt-000`)

Github Pull Requests

- Use GitHub CLI (`gh`) to view pull requests
- When asked to create a pull request, add `Closes [TT-000]` to the pull request body, where `[TT-000]` is replaced with the Linear issue ID
  - If you don't know the Linear issue ID, please ask the user

## Forbidden Git Operations

- `git reset --hard` - destroys uncommitted changes
- `git checkout .` - destroys uncommitted changes
- `git clean -fd` - deletes untracked files
- `git stash` - stashes ALL changes including other agents' work

## Documenting components

When writing JSDoc comments for component props interfaces:

- Keep the component description itself brief (one sentence should suffice).
- For props with default values, append the param description with `@default VALUE`.

When writing JSDoc comments for React component functions:

- Keep the component description itself brief (one sentence should suffice).
- Underneath the component description, list out the most relevant component props with a description and default value (if any).
- For optional props, use the syntax: `@param {TYPE} [props.PROP_NAME] - (optional) DESCRIPTION`.
- For required props, use the syntax: `@param {TYPE} props.PROP_NAME - DESCRIPTION`.
- For props with default values, append the param description with `@default VALUE`.
- If props can be forwarded to underlying elements, please call this out after listing the relevant props.
- Finally, document some simple examples using `@example` syntax.

For full examples of how this formatting might look like, please refer to existing JSDoc comments for exported components and their props in `packages/vesper/src/components/*.tsx`
