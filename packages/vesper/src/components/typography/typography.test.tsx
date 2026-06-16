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
    test(`applies the correct variant class when variant is set to "${variant}"`, () => {
      const result = render(<Typography variant={variant}>Text</Typography>);

      expect(result.container.firstChild).toHaveClass(
        `vesper-typography-${variant}`,
      );
    });
  });

  test('renders as a custom element via the "as" prop', () => {
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

  test("passes additional props through to the element", () => {
    const result = render(
      <Typography aria-label="custom label">With Aria Label</Typography>,
    );

    expect(result.container.firstChild).toHaveAttribute(
      "aria-label",
      "custom label",
    );
  });

  test("merges custom className with component classes", () => {
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
    test(`renders correctly when variant="${variant}"`, () => {
      const result = render(
        <Typography variant={variant}>{variant}</Typography>,
      );

      expect(result.container.firstChild).toMatchSnapshot();
    });
  });
});

describe("typography [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    describe(`${theme} mode`, () => {
      beforeEach(() => {
        document.documentElement.setAttribute("data-vesper-theme", theme);
      });

      afterEach(() => {
        document.documentElement.removeAttribute("data-vesper-theme");
      });

      TYPOGRAPHY_VARIANTS.forEach((variant) => {
        test(`renders without wcag2aaa violations when variant="${variant}"`, async () => {
          const result = render(
            <Typography variant={variant}>{variant}</Typography>,
          );

          expect(
            await axe.run(result.container, {
              runOnly: "wcag2aaa",
            }),
          ).toHaveNoViolations();
        });
      });
    });
  });
});
