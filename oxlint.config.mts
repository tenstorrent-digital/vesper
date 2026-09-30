import { defineConfig } from "oxlint";

import base from "@repo/oxlint-config/base";
import { sharedIgnorePatterns } from "@repo/oxlint-config/ignore-patterns";

/**
 * oxlint configuration for repo-root files
 *
 * linting runs repo-wide from here (`lint:root`, registered with turbo as the
 * `//#lint:root` root task), except for `apps/**`: each app has its own `lint`
 * task that runs after its dependencies are built, since type-aware lint rules
 * read their types from the build output (eg. `@tenstorrent/vesper`'s `dist`)
 *
 * `apps/**` is skipped with `--ignore-pattern` (see `package.json`) instead of in
 * `ignorePatterns` below: a nested config takes over its whole subtree, so apps
 * can't be excluded from here
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
