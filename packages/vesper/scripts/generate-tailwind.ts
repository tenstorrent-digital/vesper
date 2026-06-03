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

const colorTokens = getColorTokens();
const colorThemeVariables = Object.keys(colorTokens.light)
  .map((token) => `--color-vesper-${token}: var(--vesper-${token});`)
  .join("\n");

const spacingTokens = getSpacingTokens();
const spacingThemeVariables = Object.keys(spacingTokens)
  .map((token) => `--spacing-vesper-${token}: var(--vesper-spacing-${token});`)
  .join("\n");

const radiusTokens = getRadiusTokens();
const radiusThemeVariables = Object.keys(radiusTokens)
  .map((token) => `--radius-vesper-${token}: var(--vesper-radius-${token});`)
  .join("\n");

const trackingTokens = getTrackingTokens();
const trackingThemeVariables = Object.keys(trackingTokens)
  .map(
    (token) => `--tracking-vesper-${token}: var(--vesper-tracking-${token});`,
  )
  .join("\n");

const leadingTokens = getLeadingTokens();
const leadingThemeVariables = Object.keys(leadingTokens)
  .map((token) => `--leading-vesper-${token}: var(--vesper-leading-${token});`)
  .join("\n");

const shadowThemeVariables = [
  "--shadow-vesper-100: var(--vesper-shadow-100);",
  "--shadow-vesper-200: var(--vesper-shadow-200);",
  "--shadow-vesper-300: var(--vesper-shadow-300);",
  "--shadow-vesper-400: var(--vesper-shadow-400);",
  "--shadow-vesper-inset-100: var(--vesper-shadow-inset-100);",
  "--shadow-vesper-inset-200: var(--vesper-shadow-inset-200);",
].join("\n");

const tailwindThemeContent = [
  `${AUTO_GENERATED_WARNING}\n`,
  "@theme {",
  colorThemeVariables,
  spacingThemeVariables,
  radiusThemeVariables,
  trackingThemeVariables,
  leadingThemeVariables,
  shadowThemeVariables,
  "}",
].join("\n");

// make sure styles folder exist
fs.mkdirSync(path.resolve(__dirname, "../src/styles"), { recursive: true });

// create tailwind.css theme file
fs.writeFileSync(
  path.resolve(__dirname, "../src/styles/tailwind.css"),
  tailwindThemeContent,
);
