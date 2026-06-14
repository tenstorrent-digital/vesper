import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    dedupe: ["react"],
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["dist/**", "node_modules/**"],
    setupFiles: ["./vitest.setup.ts"],
    reporters: ["default", "html"],
    outputFile: "test-results/index.html",
  },
});
