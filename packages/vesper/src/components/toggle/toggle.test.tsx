import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Toggle } from "@/components/toggle/toggle";

import "@/styles/test.css";

afterEach(cleanup);

describe("toggle [unit]", () => {
  test("renders null", () => {
    const { container } = render(<Toggle />);
    expect(container.firstChild).toBeNull();
  });
});

describe("toggle [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<Toggle />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("toggle [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    test(`wcag2aaa (${theme})`, async () => {
      const { container } = render(<Toggle />);

      expect(
        await axe.run(container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
