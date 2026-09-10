import { defineConfig } from "oxlint";

import base from "./base.ts";

/**
 * oxlint configuration for internal react libraries
 * that are bundled by their consumers
 */
export default defineConfig({
  extends: [base],
  plugins: [
    // additional rulesets (extended from `base`)
    "react",
  ],
  categories: {
    correctness: "error",
    suspicious: "warn",
  },
  rules: {
    "react/react-in-jsx-scope": "off",
  },
});
