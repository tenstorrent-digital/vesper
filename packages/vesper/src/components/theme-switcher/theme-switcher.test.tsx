import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import {
  THEME_SWITCHER_SIZES,
  ThemeSwitcher,
} from "@/components/theme-switcher/theme-switcher";

import "@/styles/test.css";

afterEach(cleanup);

describe("theme-switcher [unit]", () => {
  THEME_SWITCHER_SIZES.forEach((size) => {
    test(`${size} size class`, () => {
      const result = render(<ThemeSwitcher size={size} />);
      expect(result.container.firstChild).toHaveClass(
        `vesper-theme-switcher-${size}`,
      );
    });
  });

  test("additional prop passthrough", () => {
    const result = render(<ThemeSwitcher aria-label="custom label" />);

    expect(result.container.firstChild).toHaveAttribute(
      "aria-label",
      "custom label",
    );
  });

  test("custom className", () => {
    const result = render(<ThemeSwitcher size="lg" className="custom-class" />);

    const switcher = result.container.firstChild;
    expect(switcher).toHaveClass("vesper-theme-switcher");
    expect(switcher).toHaveClass("vesper-theme-switcher-lg");
    expect(switcher).toHaveClass("custom-class");
  });

  test("theme switching", () => {
    const result = render(<ThemeSwitcher />);

    const [system, light, dark] = result.getAllByRole("button");

    system?.click();
    expect(document.documentElement).toHaveAttribute(
      "data-vesper-theme",
      "system",
    );

    light?.click();
    expect(document.documentElement).toHaveAttribute(
      "data-vesper-theme",
      "light",
    );

    dark?.click();
    expect(document.documentElement).toHaveAttribute(
      "data-vesper-theme",
      "dark",
    );

    document.documentElement.removeAttribute("data-vesper-theme");
  });
});

describe("theme-switcher [snapshot]", () => {
  test("lg", async () => {
    const { container } = render(<ThemeSwitcher size="lg" />);

    expect(container.firstChild).toMatchSnapshot();
  });

  test("sm", async () => {
    const { container } = render(<ThemeSwitcher size="sm" />);

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

    test(`wcag2aaa (lg, ${theme})`, async () => {
      const { container } = render(<ThemeSwitcher size="lg" />);

      expect(
        await axe.run(container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (sm, ${theme})`, async () => {
      const { container } = render(<ThemeSwitcher size="sm" />);

      expect(
        await axe.run(container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
