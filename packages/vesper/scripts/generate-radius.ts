import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { getGeneratedCodeWarning } from "./utils";
import { getRadiusTokens } from "./get-radius-tokens";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTO_GENERATED_WARNING = getGeneratedCodeWarning("yarn generate:radius");

const radiusTokens = getRadiusTokens();

// make sure tokens and styles folders exist
fs.mkdirSync(path.resolve(__dirname, "../src/tokens"), { recursive: true });
fs.mkdirSync(path.resolve(__dirname, "../src/styles"), { recursive: true });

// create radius tokens file
fs.writeFileSync(
  path.resolve(__dirname, "../src/tokens/radius.ts"),
  `${AUTO_GENERATED_WARNING}

  export const radius = ${JSON.stringify(radiusTokens)}`,
);

const cssFileContents = `:root {
  ${Object.entries(radiusTokens)
    .map((entry) => {
      const [name, value] = entry;
      return `--vesper-radius-${name}: ${value};`;
    })
    .join("\n")}
}`;

// create radius css file
fs.writeFileSync(
  path.resolve(__dirname, "../src/styles/radius.css"),
  `${AUTO_GENERATED_WARNING}

  ${cssFileContents}`,
);
