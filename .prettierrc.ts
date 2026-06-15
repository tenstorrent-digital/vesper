// prettier config for monorepo root
// see .prettierignore for ignored paths

import type { Config } from "prettier";

const config: Config = {
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
  ],
};

export default config;
