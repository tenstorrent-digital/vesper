import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { getGeneratedCodeWarning } from "./utils";
import { getColorTokens } from "./get-color-tokens";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTO_GENERATED_WARNING = getGeneratedCodeWarning("yarn generate:colors");

const colors = getColorTokens();

// make sure tokens and styles folders exist
fs.mkdirSync(path.resolve(__dirname, "../src/tokens"), { recursive: true });
fs.mkdirSync(path.resolve(__dirname, "../src/styles"), { recursive: true });

// create colors tokens file
fs.writeFileSync(
  path.resolve(__dirname, "../src/tokens/colors.ts"),
  `${AUTO_GENERATED_WARNING}

  export const colors = ${JSON.stringify(colors)}`,
);

const lightModeCSSVars = Object.entries(colors.light)
  .map((token) => {
    const [name, value] = token;
    return `--vesper-${name}: ${value};`;
  })
  .join("\n");

const darkModeCSSVars = Object.entries(colors.dark)
  .map((token) => {
    const [name, value] = token;
    return `--vesper-${name}: ${value};`;
  })
  .join("\n");

const cssFileContents = [
  `:root { ${lightModeCSSVars} }`,
  `@media (prefers-color-scheme: dark) { :root { ${darkModeCSSVars} }  }`,
  `.vesper-light-mode { ${lightModeCSSVars} }`,
  `.vesper-dark-mode { ${darkModeCSSVars} }`,
].join("\n\n");

// create colors css file
fs.writeFileSync(
  path.resolve(__dirname, "../src/styles/colors.css"),
  `${AUTO_GENERATED_WARNING}

  ${cssFileContents}`,
);
