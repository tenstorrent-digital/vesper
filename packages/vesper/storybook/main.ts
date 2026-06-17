import type { StorybookConfig } from "@storybook/react-vite";

import { dirname, resolve } from "path";

import { fileURLToPath } from "url";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
const __dirname = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [getAbsolutePath("@storybook/addon-a11y")],
  framework: getAbsolutePath("@storybook/react-vite"),
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      tsconfigPath: resolve(__dirname, "../tsconfig.storybook.json"),
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      savePropValueAsString: false,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  viteFinal(config, { configType }) {
    if (configType === "PRODUCTION") {
      config.base = "/storybook/";
    }
    config.resolve = config.resolve || {};

    if (Array.isArray(config.resolve.alias)) {
      config.resolve.alias = [
        ...config.resolve.alias,
        { find: "@", replacement: resolve(__dirname, "../src") },
      ];
      return config;
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      "@": resolve(__dirname, "../src"),
    };
    return config;
  },
  core: {
    disableTelemetry: true,
  },
};
export default config;
