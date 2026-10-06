import fs from "node:fs/promises";

import { getGeneratedCodeWarning, resolvePackagePath } from "../utils";
import {
  TOKEN_VARIABLE_GROUPS,
  TAILWIND_UTILITY_FILE_NAMES,
} from "./constants";

const AUTO_GENERATED_WARNING = getGeneratedCodeWarning(
  "yarn generate:tailwind",
);

const OUTPUT_FILE = "./src/styles/tailwind.css";

/**
 * Generates `src/styles/tailwind.css`, the stylesheet that makes vesper's
 * styles, tokens, and custom utilities available to tailwind. It contains:
 *
 * 1. Imports for vesper's styles, and for each of our custom tailwind utility
 *    files (see `TAILWIND_UTILITY_FILE_NAMES`)
 * 2. A theme block that registers each vesper css variable as a tailwind theme
 *    variable named `--{group}-vesper-{token}`, so tailwind generates classes
 *    like `bg-vesper-stone-500`, `rounded-vesper-2`, etc.
 */
export async function generateTailwindTheme() {
  const imports = [
    `@import "./styles.css" layer(components);`,
    ...TAILWIND_UTILITY_FILE_NAMES.map(
      (name) => `@import "./tailwind-utilities/${name}.css";`,
    ),
  ].join("\n");

  const tokens = Object.entries(TOKEN_VARIABLE_GROUPS).flatMap(
    ([group, tokens]) =>
      tokens.map((t) => {
        return `--${group}-vesper-${t.value}: var(--vesper-${group}-${t.value});`;
      }),
  );

  const theme = ["@theme {", ...tokens, "}"].join("\n");

  const contents = [AUTO_GENERATED_WARNING, imports, theme].join("\n\n");

  return await fs.writeFile(resolvePackagePath(OUTPUT_FILE), contents);
}
