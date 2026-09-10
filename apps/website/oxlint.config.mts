import { defineConfig } from "oxlint";

import { sharedIgnorePatterns } from "@repo/oxlint-config/ignore-patterns";
import nextConfig from "@repo/oxlint-config/next";

export default defineConfig({
  extends: [nextConfig],
  ignorePatterns: [
    ...sharedIgnorePatterns,

    // ignore generated storybook files
    "public/storybook/**"
  ],
  rules: {
    // allow unescaped entities (these get caught by typescript)
    "react/no-unescaped-entities": "off",
    // allow tabIndex on some additional elements
    "jsx-a11y/no-noninteractive-tabindex": [
      "error",
      {
        tags: [],
        roles: ["tabpanel", "region"],
        allowExpressionValues: true,
      },
    ],
  },
  overrides: [
  ],
  settings: {
    react: {
      // oxlint's "react" plugin doesn't support "detect" mode, so
      // this needs to be kept in step with the `react` dependency
      version: "19.2",
    },
  },
});
