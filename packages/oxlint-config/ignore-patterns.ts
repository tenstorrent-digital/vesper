/**
 * ignore patterns shared by every oxlint config in the monorepo
 *
 * these are NOT be inherited via `extends`: oxlint always resolves
 * `ignorePatterns` relative to the directory of the config file that
 * declares them, and rejects any pattern containing `..`
 *
 * because of this, each oxlint config has to spread this array into its
 * own `ignorePatterns` so that the ignore patterns are always resolved
 * relative to the config file's directory
 *
 * should also be noted that oxlint respects .gitignore for file
 * _discovery_ - this means that files ignored by .gitignore are not
 * linted, but can be explicity named for oxlint to lint them
 *
 *
 * @example oxlint.config.mts
 * ```ts
 * ignorePatterns: [
 *   ...sharedIgnorePatterns,
 *   "test-results/**",
 *   "scripts/**",
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
