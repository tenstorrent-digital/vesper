import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Slider } from "@/components/slider/slider";

import "@/styles/test.css";

afterEach(cleanup);

describe("slider [unit]", () => {
  test("renders null", () => {
    const { container } = render(<Slider />);
    expect(container.firstChild).toBeNull();
  });
});

describe("slider [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<Slider />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("slider [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    test(`wcag2aaa (${theme})`, async () => {
      const { container } = render(<Slider />);

      expect(
        await axe.run(container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
