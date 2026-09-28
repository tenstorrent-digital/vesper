import { defineConfig } from "oxlint";

import base from "@repo/oxlint-config/base";
import { sharedIgnorePatterns } from "@repo/oxlint-config/ignore-patterns";

/**
 * oxlint configuration for repo-root files
 *
 * linting runs repo-wide from here: `yarn lint` (`oxlint .`, registered with
 * turbo as the `//#lint` root task) is the only lint entry point, there are no
 * per-workspace lint scripts
 *
 * apps may configure their own `oxlint.config.mts` config files - oxlint discovers
 * these nested configs on its own and uses those rules for the files in those apps
 */
export default defineConfig({
  extends: [base],
  ignorePatterns: [
    ...sharedIgnorePatterns,
    // agent tooling, not repo source (.claude is a symlink to .agents)
    ".agents/**",
    ".claude/**",
    ".pi/**",
  ],
});
