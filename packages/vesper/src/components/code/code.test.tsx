import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Code } from "@/components/code/code";

import "@/styles/test.css";

afterEach(cleanup);

describe("code [unit]", () => {
  test("renders a code", () => {
    const { container } = render(<Code />);
    expect(container.firstElementChild?.tagName).toBe("CODE");
  });
});

describe("code [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<Code />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("code [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    test(`a11y (${theme})`, async () => {
      const { container } = render(<Code />);

      expect(await axe.run(container)).toHaveNoViolations();
    });
  });
});
