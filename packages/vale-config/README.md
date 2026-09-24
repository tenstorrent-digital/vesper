# `@turbo/eslint-config`

Prose style rules for [`vale`](https://docs.vale.sh).

The `vale` configuration for the monorepo is [`.vale.ini`](/.vale.ini) in the monorepo root

The prose rules in `styles/` are **managed** by `vale`, based on our rules and packages in `.vale.ini`. These styles are installed by running:

```sh
yarn run vale sync
```

To lint prose (including JSDoc comments in our source code), you can run the following from the monorepo root:

```sh
yarn run lint:prose
```
