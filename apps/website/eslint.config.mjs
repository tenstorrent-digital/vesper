import { globalIgnores } from "eslint/config";

import next from "@repo/eslint-config/next";

/** @type {import("eslint").Linter.Config} */
export default [
  ...next,

  /**
   * ignore `public/storybook` (the built storybook bundle) copied in
   * by `@tenstorrent/vesper#build:storybook`
   */
  globalIgnores(["public/storybook/**"]),
];
