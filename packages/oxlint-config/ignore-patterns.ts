/**
 * ignore patterns shared by every oxlint config in the monorepo
 *
 * these can NOT be inherited via `extends`: oxlint always resolves
 * `ignorePatterns` relative to the directory holding the config file that
 * declares them, and rejects any pattern containing `..`
 *
 * that means patterns declared in this package would only ever be matched
 * against files inside `packages/oxlint-config/`, so each config has to spread
 * this array into its own `ignorePatterns` instead
 *
 * @example oxlint.config.mts
 * ```ts
 * ignorePatterns: [
 *   ...sharedIgnorePatterns,
 *   ".sanity/**",
 *   "scripts/**",
 *   "components/studio/theme/**",
 * ]
 * ```
 */
export const sharedIgnorePatterns: string[] = [
  "**/node_modules/**",
  "**/dist/**",
  "**/.next/**",
  "**/build/**",
  "**/*.config.js",
  "**/*.config.mjs",
  "**/next-env.d.ts",
];

export default sharedIgnorePatterns;
