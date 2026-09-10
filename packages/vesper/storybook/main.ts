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
    /**
     * NOTE:
     *
     * `react-docgen-typescript` needs the typescript JS compiler API,
     * which typescript 7 does not ship (it is expected to return in 7.1 - see
     * links below). In order to use `react-docgen-typescript`, we've had to
     * alias the `typescript` dependency to the compatibility package:
     * `@typescript/typescript6`
     *
     * `tsc` still comes from `@typescript/native` (typescript v7)
     *
     * Later, when:
     *
     * 1. typescript v7.x adds the API that `react-docgen-typescript` needs to support v7
     * 2. `react-docgen-typescript` supports typescript v7 natively
     * 3. storybook (and it's bundled dependencies) support typescript v7
     *
     * we can remove the alias and just use the typescript v7 package directly
     * with `"typescript"` in our package.json
     *
     * @see `package.json`
     * @see `packages/vesper/package.json`
     * @see `apps/website/package.json`
     * @see https://github.com/storybookjs/storybook/discussions/35515
     * @see https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0
     */
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
  features: {
    sidebarOnboardingChecklist: false,
  },
  core: {
    disableTelemetry: true,
    allowedHosts:
      // allow all hosts in development
      process.env.NODE_ENV === "development" ? true : undefined,
  },
};
export default config;
