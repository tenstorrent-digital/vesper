import type { BrowserCommand } from "vitest/node";

import { playwright } from "@vitest/browser-playwright";
import { resolve } from "path";
import { defineConfig } from "vitest/config";

/**
 * emulate the `prefers-contrast` media feature from tests
 *
 * @see `emulateHighContrast` in `src/test-utils/high-contrast.ts`
 */
const emulateContrast: BrowserCommand<
  [contrast: "more" | "no-preference" | null]
> = async ({ page }, contrast) => {
  await page.emulateMedia({ contrast });
};

export default defineConfig({
  resolve: {
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
    alias: {
      "@": resolve(import.meta.dirname, "src"),
    },
  },
  test: {
    browser: {
      enabled: true,
      // run headless in CI (default behaviour) and also allow
      // agents to run tests with the browser in headless mode
      headless: Boolean(process.env.CI) || process.env.AGENTS === "true",
      provider: playwright({
        launchOptions: {
          // run tests in the installed (and automatically updated) Google Chrome
          // rather than Playwright's bundled Chromium, which lags behind on security fixes
          channel: "chrome",
          // Playwright disables the Chromium sandbox unless this is explicitly enabled
          chromiumSandbox: true,
        },
      }),
      instances: [{ browser: "chromium" }],
      commands: { emulateContrast },
    },
    coverage: {
      enabled: true,
      reporter: ["text", "html"],
      provider: "v8",
      reportOnFailure: true,
      exclude: ["src/components/icons/**", "src/test-utils/**"],
    },
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["dist/**", "node_modules/**"],
    setupFiles: ["./vitest.setup.ts"],
    reporters: ["default", "html"],
    outputFile: "test-results/index.html",
  },
});
