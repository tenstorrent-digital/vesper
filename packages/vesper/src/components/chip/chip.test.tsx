import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Chip } from "@/components/chip/chip";

import "@/styles/test.css";

afterEach(cleanup);

describe("chip [unit]", () => {
  test("renders a button", () => {
    const { container } = render(<Chip />);
    expect(container.firstElementChild?.tagName).toBe("BUTTON");
  });
});

describe("chip [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<Chip />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("chip [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    test(`wcag2aaa (${theme})`, async () => {
      const { container } = render(<Chip />);

      expect(
        await axe.run(container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
