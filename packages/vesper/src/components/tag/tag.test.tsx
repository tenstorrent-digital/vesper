import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Tag } from "@/components/tag/tag";

import "@/styles/test.css";

afterEach(cleanup);

describe("tag [unit]", () => {
  test("renders a div", () => {
    const { container } = render(<Tag />);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });
});

describe("tag [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<Tag />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("tag [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    test(`wcag2aaa (${theme})`, async () => {
      const { container } = render(<Tag />);

      expect(
        await axe.run(container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
