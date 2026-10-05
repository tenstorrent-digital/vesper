import fs from "node:fs";

import { getGeneratedCodeWarning, resolvePackagePath } from "../utils";
import { TOKEN_VARIABLE_GROUPS } from "./constants";

const AUTO_GENERATED_WARNING = getGeneratedCodeWarning(
  "yarn generate:tailwind-css",
);

const OUTPUT_FILE = "./src/styles/tailwind.css";

const imports = [
  `@import "./styles.css" layer(components);`,
  `@import "./tailwind-utilities.css";`,
].join("");

const tokens = Object.entries(TOKEN_VARIABLE_GROUPS).flatMap(
  ([group, tokens]) =>
    tokens.map((t) => {
      return `--${group}-vesper-${t.value}: var(--vesper-${group}-${t.value});`;
    }),
);

const theme = `@theme { ${tokens.join("")} }`;

const contents = [AUTO_GENERATED_WARNING, imports, theme].join("\n\n");

fs.writeFileSync(resolvePackagePath(OUTPUT_FILE), contents);
