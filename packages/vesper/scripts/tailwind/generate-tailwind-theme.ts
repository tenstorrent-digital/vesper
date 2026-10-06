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
