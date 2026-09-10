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
 * each app still owns an `oxlint.config.mts` of its own, and oxlint discovers
 * those nested configs on its own, so that single run lints each app with its
 * own rules on top of the root files covered here - note that a nested config
 * takes over its whole subtree, so `apps/**` can't be excluded from here
 *
 * `packages/**` is ignored to match the eslint setup this replaced, where the
 * shared packages were never linted
 */
export default defineConfig({
  extends: [base],
  ignorePatterns: [
    ...sharedIgnorePatterns,
    "packages/**",
    // agent tooling, not repo source (.claude is a symlink to .agents)
    ".agents/**",
    ".claude/**",
    ".pi/**",
  ],
});
