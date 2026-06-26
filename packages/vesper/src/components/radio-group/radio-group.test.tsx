import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Radio } from "@/components/radio/radio";

import "@/styles/test.css";

afterEach(cleanup);

describe("radio [unit]", () => {
  test("renders null", () => {
    const { container } = render(<Radio />);
    expect(container.firstChild).toBeNull();
  });
});

describe("radio [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<Radio />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("radio [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    test(`wcag2aaa (${theme})`, async () => {
      const { container } = render(<Radio />);

      expect(
        await axe.run(container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
