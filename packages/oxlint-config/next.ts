import { defineConfig } from "oxlint";

import base from "./base.ts";

/**
 * oxlint configuration for our next.js apps
 */
export default defineConfig({
  extends: [base],
  plugins: [
    // additional rulesets (extended from `base`)
    "react",
    "jsx-a11y",
    "nextjs",
  ],
  categories: {
    correctness: "error",
    suspicious: "warn",
  },
  rules: {
    // allow using JSX without React in scope
    "react/react-in-jsx-scope": "off",
    // some object keys from sanity use underscores (_ref, _type)
    "no-underscore-dangle": "off",
    // allow using `index` as key
    "react/no-array-index-key": "off",
  },
});
