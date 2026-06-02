import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { getGeneratedCodeWarning } from "./utils";
import { getColorTokens } from "./get-color-tokens";
import { getSpacingTokens } from "./get-spacing-tokens";
import { getRadiusTokens } from "./get-radius-tokens";
import { getTrackingTokens } from "./get-tracking-tokens";
import { getLeadingTokens } from "./get-leading-tokens";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTO_GENERATED_WARNING = getGeneratedCodeWarning(
  "yarn generate:tailwind",
);

const colors = getColorTokens();
const colorThemeVariables = Object.entries(colors.light)
  .map(([token, value]) => `--color-vesper-${token}: ${value};`)
  .join("\n");

const spacing = getSpacingTokens();
const spacingThemeVariables = Object.entries(spacing)
  .map(([token, value]) => `--spacing-vesper-${token}: ${value};`)
  .join("\n");

const radius = getRadiusTokens();
const radiusThemeVariables = Object.entries(radius)
  .map(([token, value]) => `--radius-vesper-${token}: ${value};`)
  .join("\n");

const tracking = getTrackingTokens();
const trackingThemeVariables = Object.entries(tracking)
  .map(([token, value]) => `--tracking-vesper-${token}: ${value};`)
  .join("\n");

const leading = getLeadingTokens();
const leadingThemeVariables = Object.entries(leading)
  .map(([token, value]) => `--leading-vesper-${token}: ${value};`)
  .join("\n");

const tailwindThemeContent = [
  `${AUTO_GENERATED_WARNING}\n`,
  "@theme {",
  colorThemeVariables,
  spacingThemeVariables,
  radiusThemeVariables,
  trackingThemeVariables,
  leadingThemeVariables,
  "}",
].join("\n");

// make sure styles folder exist
fs.mkdirSync(path.resolve(__dirname, "../src/styles"), { recursive: true });

// create tailwind.css theme file
fs.writeFileSync(
  path.resolve(__dirname, "../src/styles/tailwind.css"),
  tailwindThemeContent,
);
