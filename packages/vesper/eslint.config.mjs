import { config } from "@repo/eslint-config/react-internal";

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  { ignores: ["test-results/**", "vitest.shims.d.ts"] },
];
