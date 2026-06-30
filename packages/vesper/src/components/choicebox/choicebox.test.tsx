import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Choicebox } from "@/components/choicebox/choicebox";

import "@/styles/test.css";

afterEach(cleanup);

describe("choicebox [unit]", () => {
  test("renders a fieldset", () => {
    const { container } = render(<Choicebox />);
    expect(container.firstElementChild?.tagName).toBe("FIELDSET");
  });
});

describe("choicebox [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<Choicebox />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("choicebox [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    test(`wcag2aaa (${theme})`, async () => {
      const { container } = render(<Choicebox />);

      expect(
        await axe.run(container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
