import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { StatusIndicator } from "@/components/status-indicator/status-indicator";

import "@/styles/test.css";

afterEach(cleanup);

describe("status-indicator [unit]", () => {
  test("renders a div", () => {
    const { container } = render(<StatusIndicator />);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });
});

describe("status-indicator [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<StatusIndicator />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("status-indicator [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    test(`wcag2aaa (${theme})`, async () => {
      const { container } = render(<StatusIndicator />);

      expect(
        await axe.run(container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
