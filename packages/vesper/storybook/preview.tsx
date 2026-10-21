import type { Preview } from "@storybook/react-vite";

import axe from "axe-core";

import "@/styles/styles.css";
import { GLASS_BACKDROP_STYLES } from "@/utils/glass/glass.stories";

/**
 * axe-core tags we want to test for — mirrors vitest.setup.ts configuration
 *
 * @see https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#axe-core-tags for available tags
 * @see https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md for individual rules
 */
const ENABLED_TAGS = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
];

/**
 * Disable rules with the `cat.semantics` tag (mostly document-level structure
 * checks) that don't apply to individual component stories
 */
const disabledRules = Object.fromEntries(
  axe
    .getRules(ENABLED_TAGS)
    .filter((rule) => rule.tags.includes("cat.semantics"))
    .map((rule) => [rule.ruleId, { enabled: false }])
    .concat([["region", { enabled: false }]]),
);

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Global theme for components",
      toolbar: {
        title: "Theme",
        items: [
          { value: "light", title: "Light Mode", icon: "sun" },
          { value: "dark", title: "Dark Mode", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
    backdrop: {
      description: "Background behind components (glass is see-through)",
      toolbar: {
        title: "Backdrop",
        icon: "photo",
        items: [
          { value: "aurora", title: "Aurora" },
          { value: "type", title: "Type" },
          { value: "stripes", title: "Stripes" },
          { value: "plain", title: "Plain" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
    backdrop: "aurora",
  },
  decorators: [
    (Story, { globals }) => {
      const theme = globals.theme || "light";
      const backdrop: keyof typeof GLASS_BACKDROP_STYLES =
        globals.backdrop in GLASS_BACKDROP_STYLES ? globals.backdrop : "plain";
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.background = GLASS_BACKDROP_STYLES[backdrop];
      document.body.style.minHeight = "100vh";

      return <Story />;
    },
  ],
  parameters: {
    layout: "centered",
    controls: {
      disableSaveFromUI: true,
      expanded: true,
    },
    a11y: {
      test: "error",
      options: {
        runOnly: {
          type: "tag",
          values: ENABLED_TAGS,
        },
        rules: disabledRules,
      },
    },
  },
};

export default preview;
