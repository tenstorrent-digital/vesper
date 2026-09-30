import fs from "node:fs";
import path from "node:path";

import { getTokenVariableGroups } from "./get-token-variable-groups";
import { getGeneratedCodeWarning } from "./utils";

const AUTO_GENERATED_WARNING = getGeneratedCodeWarning(
  "yarn generate:tailwind-css",
);

const OUTPUT_FILE = "src/styles/tailwind.css";

const variables = getTokenVariableGroups();

const imports = [
  `@import "./styles.css" layer(components);`,
  `@import "./tailwind-utilities.css";`,
].join("");

const tokens = Object.entries(variables).flatMap(([group, tokens]) =>
  tokens.map((t) => {
    return `--${group}-vesper-${t.value}: var(--vesper-${group}-${t.value});`;
  }),
);

const theme = `@theme { ${tokens.join("")} }`;

const contents = [AUTO_GENERATED_WARNING, imports, theme].join("\n\n");

fs.writeFileSync(
  path.resolve(import.meta.dirname, "..", OUTPUT_FILE),
  contents,
);
