import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  DesignTokenTree,
  getGeneratedCodeWarning,
  parseDesignTokenTree,
} from "./utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTO_GENERATED_WARNING = getGeneratedCodeWarning("yarn generate:spacing");

const spacingJSON: DesignTokenTree<number> = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../assets/tokens/Spacing.tokens.json"),
    "utf-8",
  ),
);

const spacingTokens = parseDesignTokenTree({
  tree: spacingJSON,
  processToken: (name, token) => [
    name.toLowerCase().replace("space-", ""),
    `${token.$value}px`,
  ],
});

// make sure tokens and styles folders exist
fs.mkdirSync(path.resolve(__dirname, "../src/tokens"), { recursive: true });
fs.mkdirSync(path.resolve(__dirname, "../src/styles"), { recursive: true });

// create spacing tokens file
fs.writeFileSync(
  path.resolve(__dirname, "../src/tokens/spacing.ts"),
  `${AUTO_GENERATED_WARNING}

  export const spacing = ${JSON.stringify(spacingTokens)}`,
);

const cssFileContents = `:root {
  ${Object.entries(spacingTokens)
    .map((entry) => {
      const [name, value] = entry;
      return `--vesper-spacing-${name}: ${value};`;
    })
    .join("\n")}
}`;

// create spacing css file
fs.writeFileSync(
  path.resolve(__dirname, "../src/styles/spacing.css"),
  `${AUTO_GENERATED_WARNING}

  ${cssFileContents}`,
);
