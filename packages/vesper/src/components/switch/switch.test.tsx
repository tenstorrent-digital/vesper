import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Switch } from "@/components/switch/switch";

import "@/styles/test.css";

afterEach(cleanup);

describe("switch [unit]", () => {
  test("renders null", () => {
    const { container } = render(<Switch />);
    expect(container.firstChild).toBeNull();
  });
});

describe("switch [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<Switch />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("switch [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    test(`wcag2aaa (${theme})`, async () => {
      const { container } = render(<Switch />);

      expect(
        await axe.run(container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
