import { defineConfig } from "oxlint";

import { sharedIgnorePatterns } from "@repo/oxlint-config/ignore-patterns";
import reactInternalConfig from "@repo/oxlint-config/react-internal";

export default defineConfig({
  extends: [reactInternalConfig],

  ignorePatterns: [
    ...sharedIgnorePatterns,

    "coverage/**",
    "test-results/**",
    "vitest.shims.d.ts"
  ],
});
