import { defineConfig } from "oxlint";

/**
 * base oxlint configuration
 *
 * use with `extends: [base]` in `oxlint.config.mts`
 */
export default defineConfig({
  /**
   * oxlint default rulesets (plugins)
   * @see https://oxc.rs/docs/guide/usage/linter/plugins.html#supported-plugins
   */
  plugins: ["eslint", "typescript", "unicorn"],
  jsPlugins: ["eslint-plugin-turbo"],
  env: {
    builtin: true,
    browser: true,
    node: true,
  },
  globals: {
    React: "readonly",
    JSX: "readonly",
  },
  options: {
    // enable type-aware (typescript/*) rules
    // see: https://oxc.rs/docs/guide/usage/linter/type-aware.html
    typeAware: true,
    reportUnusedDisableDirectives: "error",
  },
  categories: {
    correctness: "error",
    suspicious: "warn",
    perf: "error", // cult of speed
  },
  rules: {
    // error on undeclared env vars
    "turbo/no-undeclared-env-vars": "error",
    // allow shadowing
    "no-shadow": "off",
    "no-unused-vars": [
      "warn",
      {
        // allow args/vars starting with `_` to be unused
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
  },
});
