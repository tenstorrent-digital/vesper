import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Range } from "@/components/range/range";

import "@/styles/test.css";

afterEach(cleanup);

describe("range [unit]", () => {
  test("renders null", () => {
    const { container } = render(<Range />);
    expect(container.firstChild).toBeNull();
  });
});

describe("range [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<Range />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("range [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    test(`wcag2aaa (${theme})`, async () => {
      const { container } = render(<Range />);

      expect(
        await axe.run(container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
