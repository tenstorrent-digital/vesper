import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { getGeneratedCodeWarning } from "./utils";
import { getLeadingTokens } from "./get-leading-tokens";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTO_GENERATED_WARNING = getGeneratedCodeWarning("yarn generate:leading");

const leadingTokens = getLeadingTokens();

// make sure tokens and styles folders exist
fs.mkdirSync(path.resolve(__dirname, "../src/tokens"), { recursive: true });
fs.mkdirSync(path.resolve(__dirname, "../src/styles"), { recursive: true });

// create leading tokens file
fs.writeFileSync(
  path.resolve(__dirname, "../src/tokens/leading.ts"),
  `${AUTO_GENERATED_WARNING}

  export const leading = ${JSON.stringify(leadingTokens)}`,
);

const cssFileContents = `:root {
  ${Object.entries(leadingTokens)
    .map((entry) => {
      const [name, value] = entry;
      return `--vesper-leading-${name}: ${value};`;
    })
    .join("\n")}
}`;

// create leading css file
fs.writeFileSync(
  path.resolve(__dirname, "../src/styles/leading.css"),
  `${AUTO_GENERATED_WARNING}

  ${cssFileContents}`,
);
