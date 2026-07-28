import { cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import {
  PROGRESS_BAR_SIZES,
  PROGRESS_BAR_VARIANTS,
  ProgressBar,
  type ProgressBarProps,
} from "@/components/progress-bar/progress-bar";

import "@/styles/test.css";

const PROGRESS_BAR_PERMUTATIONS = PROGRESS_BAR_VARIANTS.flatMap((variant) =>
  PROGRESS_BAR_SIZES.flatMap((size): ProgressBarProps => ({
    size,
    variant,
    value: 23,
  })),
);

afterEach(cleanup);

describe("progress-bar [unit]", () => {
  PROGRESS_BAR_SIZES.forEach((size) => {
    test(`${size} size class`, () => {
      const result = render(<ProgressBar size={size} value={23} />);

      expect(result.container.firstChild).toHaveClass(
        `vesper-progress-bar-${size}`,
      );
    });
  });

  test("animated class", () => {
    const result = render(<ProgressBar value={23} animated />);

    expect(result.container.firstChild).toHaveClass(
      "vesper-progress-bar-animated",
    );
  });

  test("default variant indicator element", () => {
    const result = render(<ProgressBar value={23} variant="default" />);

    const indicator = result.container.querySelector(
      ".vesper-progress-bar-indicator",
    ) as HTMLElement;

    expect(indicator.style.width).toBe("23%");
  });

  test("steps variant indicator element", () => {
    const result = render(
      <ProgressBar
        value={23}
        steps={10}
        variant="steps"
        stepRoundingStrategy={Math.round}
      />,
    );

    const indicator = result.container.querySelector(
      ".vesper-progress-bar-indicator",
    ) as HTMLElement;

    expect(indicator.style.width).toBe("20%");
  });

  test("steps variant indicator ticks", () => {
    const result = render(
      <ProgressBar value={23} steps={10} variant="steps" />,
    );

    expect(
      result.container.querySelectorAll(".vesper-progress-bar-tick"),
    ).toHaveLength(9);
  });

  test("additional prop passthrough", () => {
    const result = render(<ProgressBar value={23} aria-label="custom label" />);

    expect(result.container.firstChild).toHaveAttribute(
      "aria-label",
      "custom label",
    );
  });

  test("custom className", () => {
    const result = render(<ProgressBar value={23} className="custom-class" />);

    const el = result.container.firstChild;
    expect(el).toHaveClass("vesper-progress-bar");
    expect(el).toHaveClass("custom-class");
  });
});

describe("progress-bar [snapshot]", () => {
  PROGRESS_BAR_PERMUTATIONS.forEach((permutation) => {
    const { size, variant } = permutation;

    test(`${size}, ${variant}`, () => {
      const result = render(
        <ProgressBar size={size} variant={variant} value={23} />,
      );

      expect(result.container.firstChild).toMatchSnapshot();
    });
  });
});

const PROGRESS_BAR_A11Y_FAILING_PERMUTATIONS: (ProgressBarProps & {
  theme: string;
})[] = PROGRESS_BAR_VARIANTS.flatMap((variant) =>
  PROGRESS_BAR_SIZES.flatMap((size) => [
    { size, variant, value: 23, theme: "light" },
    { size, variant, value: 23, theme: "dark" },
  ]),
);

describe("progress-bar [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    PROGRESS_BAR_PERMUTATIONS.forEach((permutation) => {
      const { size, variant } = permutation;
      const label = `a11y (${size}, ${variant})`;

      const testFn = async () => {
        const result = render(
          <ProgressBar size={size} variant={variant} value={23} />,
        );

        expect(await axe.run(result.container)).toHaveNoViolations();
      };

      const failsA11y = PROGRESS_BAR_A11Y_FAILING_PERMUTATIONS.some(
        (p) => p.size === size && p.variant === variant && p.theme === theme,
      );

      if (failsA11y) test.todo(label, testFn);
      else test(label, testFn);
    });
  });
});
