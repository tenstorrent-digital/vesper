import { generateTailwindMerge } from "./generate-tailwind-merge";
import { generateTailwindMergeTest } from "./generate-tailwind-merge-test";
import { generateTailwindTheme } from "./generate-tailwind-theme";

await Promise.all([
  generateTailwindMerge(),
  generateTailwindMergeTest(),
  generateTailwindTheme(),
]);
