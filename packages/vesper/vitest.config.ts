import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    browser: {
      enabled: true,
      provider: playwright({
        launchOptions: {
          args: ["--font-render-hinting=none", "--disable-lcd-text"],
        },
      }),
      instances: [{ browser: "chromium" }],
    },
    coverage: {
      enabled: true,
      reporter: ["text", "html"],
      provider: "v8",
      reportOnFailure: true,
      exclude: ["src/components/icons/**"],
    },
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["dist/**", "node_modules/**"],
    setupFiles: ["./vitest.setup.ts"],
    reporters: ["default", "html"],
    outputFile: "test-results/index.html",
  },
});
