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

const AUTO_GENERATED_WARNING = getGeneratedCodeWarning(
  "yarn generate:tracking",
);

const spacingJSON: DesignTokenTree<number> = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../assets/tokens/Tracking.tokens.json"),
    "utf-8",
  ),
);

const trackingTokens = parseDesignTokenTree({
  tree: spacingJSON,
  processToken: (name, token) => [name.toLowerCase(), `${token.$value}px`],
});

// make sure tokens and styles folders exist
fs.mkdirSync(path.resolve(__dirname, "../src/tokens"), { recursive: true });
fs.mkdirSync(path.resolve(__dirname, "../src/styles"), { recursive: true });

// create tracking tokens file
fs.writeFileSync(
  path.resolve(__dirname, "../src/tokens/tracking.ts"),
  `${AUTO_GENERATED_WARNING}

  export const tracking = ${JSON.stringify(trackingTokens)}`,
);

const cssFileContents = `:root {
  ${Object.entries(trackingTokens)
    .map((entry) => {
      const [name, value] = entry;
      return `--vesper-tracking-${name}: ${value};`;
    })
    .join("\n")}
}`;

// create tracking css file
fs.writeFileSync(
  path.resolve(__dirname, "../src/styles/tracking.css"),
  `${AUTO_GENERATED_WARNING}

  ${cssFileContents}`,
);
