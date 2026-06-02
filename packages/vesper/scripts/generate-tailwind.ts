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
const colorThemeVariables = Object.keys(colors.light)
  .map((token) => `--color-vesper-${token}: var(--vesper-${token});`)
  .join("\n");

const spacing = getSpacingTokens();
const spacingThemeVariables = Object.keys(spacing)
  .map((token) => `--spacing-vesper-${token}: var(--vesper-spacing-${token});`)
  .join("\n");

const radius = getRadiusTokens();
const radiusThemeVariables = Object.keys(radius)
  .map((token) => `--radius-vesper-${token}: var(--vesper-radius-${token});`)
  .join("\n");

const tracking = getTrackingTokens();
const trackingThemeVariables = Object.keys(tracking)
  .map(
    (token) => `--tracking-vesper-${token}: var(--vesper-tracking-${token});`,
  )
  .join("\n");

const leading = getLeadingTokens();
const leadingThemeVariables = Object.keys(leading)
  .map((token) => `--leading-vesper-${token}: var(--vesper-leading-${token});`)
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
