// prettier config for monorepo root
//
// notes:
// - run as a root task with `format:root` (see package.json)
// - also provides prettier settings for your editor's LSP to pickup
//
// see .prettierignore for ignored paths

import type { Config } from "prettier";

const config: Config = {
  trailingComma: "all",
  tabWidth: 2,
  semi: true,
  bracketSpacing: true,
  overrides: [
    /**
     * Prettier has an outstanding issue where it adds trailing commas to jsonc files, so we need to add this override as a workaround to this behavior.
     *
     * https://zed.dev/docs/languages/json
     * https://github.com/prettier/prettier/issues/15956
     */
    {
      files: ["*.jsonc"],
      options: {
        parser: "json",
        trailingComma: "none",
      },
    },

    /**
     * use the tailwindcss plugin for the docs app
     */
    {
      files: ["apps/website/**"],
      options: {
        plugins: ["prettier-plugin-tailwindcss"],
        tailwindFunctions: ["clsx", "cn"],
      },
    },
  ],
};

export default config;
