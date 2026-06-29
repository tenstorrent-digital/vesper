import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Checkbox } from "@/components/checkbox/checkbox";

import "@/styles/test.css";

afterEach(cleanup);

describe("checkbox [unit]", () => {
  test("renders null", () => {
    const { container } = render(<Checkbox />);
    expect(container.firstChild).toBeNull();
  });
});

describe("checkbox [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<Checkbox />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("checkbox [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    test(`wcag2aaa (${theme})`, async () => {
      const { container } = render(<Checkbox />);

      expect(
        await axe.run(container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
