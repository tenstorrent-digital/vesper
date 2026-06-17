import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { ThemeSwitcher } from "@/components/theme-switcher/theme-switcher";

import "@/styles/test.css";

afterEach(cleanup);

describe("theme-switcher [unit]", () => {
  test("renders a div", () => {
    const { container } = render(<ThemeSwitcher />);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });
});

describe("theme-switcher [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<ThemeSwitcher />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("theme-switcher [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    test(`wcag2aaa (${theme})`, async () => {
      const { container } = render(<ThemeSwitcher />);

      expect(
        await axe.run(container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
