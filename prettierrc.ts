// prettier config for monorepo root
// see .prettierignore for ignored paths

import type { Config } from "prettier";

const config: Config = {
  trailingComma: "all",
  tabWidth: 2,
  semi: true,
  bracketSpacing: true,
  overrides: [
    {
      files: ["*.jsonc", "*.json"],
      options: {
        parser: "json",
        trailingComma: "none",
      },
    },
  ],
};

export default config;
