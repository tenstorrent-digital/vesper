import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
import onlyWarn from "eslint-plugin-only-warn";
import simpleImportSort from "eslint-plugin-simple-import-sort";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export default [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": [
        "warn",
        {
          groups: [
            // packages
            // `react` related packages come first
            ["^react", "^@?\\w"],

            // internal packages from monorepo
            // note: `@tenstorrent/vesper` is developed here but published to npm, so it is
            // grouped with monorepo packages rather than treated as a third-party import
            ["^(@repo|@tenstorrent)(/.*|$)"],

            // imports from named paths in tsconfig.json (in order)
            ["^(@/components)(/.*|$)"],
            ["^(@/lib)(/.*|$)"],
            ["^(@/utils)(/.*|$)"],
            // then any other named path
            ["^(@/\\w)(/.*|$)"],

            // side effect
            ["^\\u0000"],

            // parent imports, `..` last
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            // other relative imports
            // put same-folder imports and `.` last
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],

            // css
            ["^.+\\.s?css$"],
          ],
        },
      ],
      "simple-import-sort/exports": "warn",
    },
  },
  {
    ignores: ["dist/**"],
  },
];
