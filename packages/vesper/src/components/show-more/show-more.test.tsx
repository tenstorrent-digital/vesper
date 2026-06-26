import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { ShowMore } from "@/components/show-more/show-more";

import "@/styles/test.css";

afterEach(cleanup);

describe("show-more [unit]", () => {
  test("renders a div", () => {
    const { container } = render(<ShowMore />);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });
});

describe("show-more [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<ShowMore />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("show-more [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    test(`wcag2aaa (${theme})`, async () => {
      const { container } = render(<ShowMore />);

      expect(
        await axe.run(container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
