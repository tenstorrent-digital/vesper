import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getTokenVariableGroups } from "./get-token-variable-groups";
import { getGeneratedCodeWarning } from "./utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTO_GENERATED_WARNING = getGeneratedCodeWarning(
  "yarn generate:tailwind-css",
);

const OUTPUT_FILE = "src/styles/tailwind.css";

const variables = getTokenVariableGroups();

const imports = [
  `@import "./styles.css" layer(components);`,
  `@import "./tailwind-utilities.css";`,
].join("");

const colors = variables.colors.map(
  (v) => `--color-vesper-${v.name}: var(--vesper-${v.name});`,
);

const spacing = variables.spacing.map(
  (v) => `--spacing-vesper-${v.parts[1]}: var(--vesper-${v.name});`,
);

const strokes = variables.strokes.flatMap((v) => [
  `--border-width-vesper-${v.parts[1]}: var(--vesper-${v.name});`,
  `--outline-width-vesper-${v.parts[1]}: var(--vesper-${v.name});`,
]);

const radius = variables.radius.map(
  (v) => `--radius-vesper-${v.parts[1]}: var(--vesper-${v.name});`,
);

const tracking = variables.tracking.map(
  (v) => `--tracking-vesper-${v.parts[1]}: var(--vesper-${v.name});`,
);

const leading = variables.leading.map(
  (v) => `--leading-vesper-${v.parts[1]}: var(--vesper-${v.name});`,
);

const fonts = variables.fonts.map(
  (v) => `--font-vesper-${v.parts[1]}: var(--vesper-${v.name});`,
);

const shadows = variables.shadows.map(
  (v) =>
    `--shadow-vesper-${v.parts.slice(1).join("-")}: var(--vesper-${v.name});`,
);

const animation = variables.animation.map(
  (v) =>
    `--transition-duration-vesper-${v.parts[v.parts.length - 1]}: var(--vesper-${v.name});`,
);

const theme = [
  "@theme {",
  ...colors,
  ...spacing,
  ...strokes,
  ...radius,
  ...tracking,
  ...leading,
  ...fonts,
  ...shadows,
  ...animation,
  "}",
].join("");

const contents = [AUTO_GENERATED_WARNING, imports, theme].join("\n\n");

fs.writeFileSync(path.resolve(__dirname, "..", OUTPUT_FILE), contents);
