import globals from "globals";

import config from "@repo/eslint-config/react-internal";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  { ignores: ["dist/**"] },
];
