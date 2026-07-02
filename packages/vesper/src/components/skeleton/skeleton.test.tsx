import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Skeleton } from "@/components/skeleton/skeleton";

import "@/styles/test.css";

afterEach(cleanup);

describe("skeleton [unit]", () => {
  test("renders a div", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });
});

describe("skeleton [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<Skeleton />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("skeleton [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    test(`wcag2aaa (${theme})`, async () => {
      const { container } = render(<Skeleton />);

      expect(
        await axe.run(container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
