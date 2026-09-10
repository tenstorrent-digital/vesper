# `@repo/oxlint-config`

Shared [Oxlint](https://oxc.rs/docs/guide/usage/linter) configurations for the monorepo.

## Usage

Configs are consumed from an `oxlint.config.mts` file in each app:

```ts
import nextConfig from "@repo/oxlint-config/next";
import { sharedIgnorePatterns } from "@repo/oxlint-config/ignore-patterns";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [nextConfig],
  ignorePatterns: [...sharedIgnorePatterns, "some/app/specific/path/**"],
});
```

## Exports

### Baseline configs

For apps and packages to use - these are configs that extend the `base` config.

| Export                               | Purpose                                                        |
| ------------------------------------ | -------------------------------------------------------------- |
| `@repo/oxlint-config/base`           | Core + TypeScript + Turborepo rules, shared by everything      |
| `@repo/oxlint-config/next`           | `base` plus React, React hooks, jsx-a11y, Next.js              |
| `@repo/oxlint-config/react-internal` | `base` plus React and React hooks, for internal react packages |

> [!NOTE]
>
> The monorepo uses the `base` config

### Utilities

| Export                                | Purpose                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------ |
| `@repo/oxlint-config/ignore-patterns` | `sharedIgnorePatterns` — [see below](#ignore-patterns-are-not-inherited) |

## Notes

### Plugins (Rulesets)

> [_**What a plugin means in Oxlint**_](https://oxc.rs/docs/guide/usage/linter/plugins.html#what-a-plugin-means-in-oxlint)
>
> A plugin is a named group of rules. Enabling a plugin makes its rules available, and category flags control which rules are enabled and at what severity.

#### Native plugins (and defaults)

Oxlint provides built-in implementations for a set of supported plugins (mostly ported from ESLint). A list of supported plugins (and defaults) is available [here](https://oxc.rs/docs/guide/usage/linter/plugins.html#supported-plugins).

We set default plugins explicitly in `plugins` in [our `base.ts` config](./base.ts) so we can extend them.

#### JS plugins (`eslint` plugins)

Rules with no native Oxlint implementation (`eslint` plugins) are loaded as [JS plugins](https://oxc.rs/docs/guide/usage/linter/js-plugins). We use `eslint-plugin-turbo`.

### Rule Categories

Groups of rules in Oxlint can be enabled (with severity) using [`categories`](https://oxc.rs/docs/guide/usage/linter/config-file-reference.html#categories). Enabled rules can then be overridden individually in `rules`.

### Type-aware linting

`base.ts` sets [`options.typeAware`](https://oxc.rs/docs/guide/usage/linter/type-aware.html) so the `typescript/*` rules that need type information (`no-floating-promises`, `no-unsafe-type-assertion`, …) run as part of `yarn lint`.

These rules are executed by [`tsgolint`](https://github.com/oxc-project/tsgolint), which is a separate binary (`oxlint-tsgolint`) built on [`typescript-go`](https://github.com/microsoft/typescript-go). Two consequences:

- `oxlint-tsgolint` has to be installed alongside `oxlint` — it is a `devDependency` of the repo root (where `oxlint .` runs) and of each app/package that has `oxlint`
- **TypeScript 7+ is required**, and every `tsconfig.json` has to be valid under TypeScript 7 — options removed in 6.0/7.0 (`baseUrl`, `moduleResolution: node10`, `downlevelIteration`, …) make `tsgolint` skip the project, and `types` no longer defaults to "everything in `node_modules/@types`", so global type packages are listed explicitly

> [!NOTE]
>
> `options.typeAware` (and `options.typeCheck`) are only read from the **root** config. Nested configs inherit them through `extends` but cannot turn them on by themselves.

We deliberately do **not** enable oxlint's `--type-check` / `options.typeCheck`: TypeScript diagnostics stay with the per-package `check-types` task (`tsc --noEmit`) so type errors and lint problems are reported by the tools that own them.

### `ignorePatterns` are not inherited

`Oxlint` resolves `ignorePatterns` relative to the directory containing the config file that declares them, and rejects patterns containing `..`. Patterns declared in this package would therefore only ever match files inside `packages/oxlint-config/`.

This is why `sharedIgnorePatterns` is exported as a plain array for each app to spread into its own `ignorePatterns`, instead of being set in `base`.
