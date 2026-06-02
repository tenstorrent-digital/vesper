import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { getGeneratedCodeWarning } from "./utils";
import { getTrackingTokens } from "./get-tracking-tokens";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTO_GENERATED_WARNING = getGeneratedCodeWarning(
  "yarn generate:tracking",
);

const trackingTokens = getTrackingTokens();

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
