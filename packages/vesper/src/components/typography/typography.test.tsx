import { render, within, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import {
  Typography,
  TYPOGRAPHY_VARIANTS,
} from "@/components/typography/typography";

import "@/styles/test.css";

afterEach(cleanup);

describe("typography [unit]", () => {
  TYPOGRAPHY_VARIANTS.forEach((variant) => {
    test(`${variant} variant class`, () => {
      const result = render(<Typography variant={variant}>Text</Typography>);

      expect(result.container.firstChild).toHaveClass(
        `vesper-typography-${variant}`,
      );
    });
  });

  test("polymorphism", () => {
    const result = render(
      <Typography as="a" href="/link">
        As Link
      </Typography>,
    );
    const view = within(result.container);
    const link = view.getByRole("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/link");
  });

  test("additional prop passthrough", () => {
    const result = render(
      <Typography aria-label="custom label">With Aria Label</Typography>,
    );

    expect(result.container.firstChild).toHaveAttribute(
      "aria-label",
      "custom label",
    );
  });

  test("custom className", () => {
    const result = render(
      <Typography variant="copy-sm" className="custom-class">
        Styled
      </Typography>,
    );

    const el = result.container.firstChild;
    expect(el).toHaveClass("vesper-typography-copy-sm");
    expect(el).toHaveClass("custom-class");
  });
});

describe("typography [snapshot]", () => {
  TYPOGRAPHY_VARIANTS.forEach((variant) => {
    test(`${variant}`, () => {
      const result = render(
        <Typography variant={variant}>{variant}</Typography>,
      );

      expect(result.container.firstChild).toMatchSnapshot();
    });
  });
});

describe("typography [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    TYPOGRAPHY_VARIANTS.forEach((variant) => {
      test(`a11y (${variant}, ${theme})`, async () => {
        const result = render(
          <Typography variant={variant}>{variant}</Typography>,
        );

        expect(await axe.run(result.container)).toHaveNoViolations();
      });
    });
  });
});
