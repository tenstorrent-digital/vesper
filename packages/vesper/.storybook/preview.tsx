import type { Preview } from "@storybook/react-vite";
import "../src/styles/styles.css";

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
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [
    (Story, { globals }) => {
      const theme = globals.theme || "light";
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.background = "var(--vesper-stone-0)";

      return <Story />;
    },
  ],
  parameters: {
    a11y: {
      test: "error",
      options: {
        runOnly: {
          type: "tag",
          values: ["wcag2aaa"],
        },
      },
    },
  },
};

export default preview;
