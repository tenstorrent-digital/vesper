import { defineConfig } from "vitest/config";
import { resolve } from "path";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

const alias = {
  "@": resolve(__dirname, "src"),
};

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [storybookTest()],
  test: {
    projects: [
      {
        plugins: [storybookTest()],
        resolve: { alias },
        test: {
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: "chromium", name: "storybook" }],
          },
        },
      },
      {
        resolve: { alias },
        test: {
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: "chromium", name: "unit" }],
          },
          include: ["src/**/*.test.{ts,tsx}"],
          exclude: ["dist/**", "node_modules/**"],
        },
      },
    ],
  },
});
