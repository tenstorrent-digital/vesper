import type { Preview } from "@storybook/react-vite";
import "../src/styles/styles.css";

const isVitest =
  typeof (globalThis as Record<string, unknown>).__vitest_browser__ !==
  "undefined";

const preview: Preview = {
  async afterEach({ canvasElement }) {
    if (!isVitest) return;
    const { expect } = await import("vitest");
    expect(canvasElement.innerHTML).toMatchSnapshot();
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
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
