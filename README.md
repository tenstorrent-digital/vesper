# Vesper

This monorepo houses the project code for Tenstorrent's software design system library, Vesper.

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
