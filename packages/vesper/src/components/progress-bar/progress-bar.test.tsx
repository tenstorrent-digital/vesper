import { render, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import axe from "axe-core";

import {
  ProgressBar,
  PROGRESS_BAR_SIZES,
  PROGRESS_BAR_VARIANTS,
  type ProgressBarProps,
} from "@/components/progress-bar/progress-bar";

import "@/styles/styles.css";

const PROGRESS_BAR_PERMUTATIONS = PROGRESS_BAR_VARIANTS.flatMap((variant) =>
  PROGRESS_BAR_SIZES.flatMap(
    (size): ProgressBarProps => ({ size, variant, value: 23 }),
  ),
);

afterEach(cleanup);

describe("progress-bar [unit]", () => {
  PROGRESS_BAR_SIZES.forEach((size) => {
    it(`applies the correct size class when size is set to "${size}"`, () => {
      const result = render(<ProgressBar size={size} value={23} />);

      expect(result.container.firstChild).toHaveClass(
        `vesper-progress-bar-${size}`,
      );
    });
  });

  it("applies the animated class when animated prop is set to true", () => {
    const result = render(<ProgressBar value={23} animated />);

    expect(result.container.firstChild).toHaveClass(
      "vesper-progress-bar-animated",
    );
  });

  it("passes additional props through to the element", () => {
    const result = render(<ProgressBar value={23} aria-label="custom label" />);

    expect(result.container.firstChild).toHaveAttribute(
      "aria-label",
      "custom label",
    );
  });

  it("merges custom className with component classes", () => {
    const result = render(<ProgressBar value={23} className="custom-class" />);

    const el = result.container.firstChild;
    expect(el).toHaveClass("vesper-progress-bar");
    expect(el).toHaveClass("custom-class");
  });
});

describe("progress-bar [snapshot]", () => {
  PROGRESS_BAR_PERMUTATIONS.forEach((permutation) => {
    const { size, variant } = permutation;

    it(`renders correctly when size="${size}" and variant="${variant}"`, () => {
      const result = render(
        <ProgressBar size={size} variant={variant} value={23} />,
      );

      expect(result.container.firstChild).toMatchSnapshot();
    });
  });
});

describe("progress-bar [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    describe(`${theme} mode`, () => {
      beforeEach(() => {
        document.documentElement.setAttribute("data-vesper-theme", theme);
      });

      afterEach(() => {
        document.documentElement.removeAttribute("data-vesper-theme");
      });

      PROGRESS_BAR_PERMUTATIONS.forEach((permutation) => {
        const { size, variant } = permutation;

        it(`renders without wcag2aaa violations when size="${size}" and variant="${variant}"`, async () => {
          const result = render(
            <ProgressBar size={size} variant={variant} value={23} />,
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
