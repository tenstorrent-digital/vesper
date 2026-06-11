import { defineConfig } from "vitest/config";
import { resolve } from "path";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: "chromium", name: "unit" }],
    },
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["dist/**", "node_modules/**"],
  },
});
