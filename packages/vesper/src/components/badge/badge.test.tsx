import { render, within, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import {
  Badge,
  type BadgeProps,
  BADGE_SIZES,
  BADGE_VARIANTS,
} from "@/components/badge/badge";
import { Tenstorrent } from "@/components/icons/icons";

import "@/styles/test.css";

const BADGE_PERMUTATIONS = BADGE_VARIANTS.flatMap((variant) =>
  BADGE_SIZES.flatMap((size): BadgeProps[] => [
    { size, variant, subtle: true },
    { size, variant, subtle: false },
  ]),
);

const BADGE_A11Y_FAILING_PERMUTATIONS: (BadgeProps & { theme: string })[] = [
  ...BADGE_SIZES.flatMap((size) => [
    { size, variant: "accent" as const, subtle: true, theme: "light" },
    { size, variant: "success" as const, subtle: true, theme: "light" },
    { size, variant: "success" as const, subtle: false, theme: "light" },
    { size, variant: "warning" as const, subtle: true, theme: "light" },
    { size, variant: "warning" as const, subtle: false, theme: "light" },
    { size, variant: "danger" as const, subtle: true, theme: "light" },
    { size, variant: "danger" as const, subtle: false, theme: "light" },
    { size, variant: "info" as const, subtle: true, theme: "light" },
    { size, variant: "pink" as const, subtle: true, theme: "light" },
    { size, variant: "pink" as const, subtle: false, theme: "light" },
    { size, variant: "mint" as const, subtle: true, theme: "light" },
    { size, variant: "mint" as const, subtle: false, theme: "light" },
    { size, variant: "accent" as const, subtle: false, theme: "dark" },
    { size, variant: "success" as const, subtle: true, theme: "dark" },
    { size, variant: "warning" as const, subtle: false, theme: "dark" },
    { size, variant: "danger" as const, subtle: true, theme: "dark" },
    { size, variant: "danger" as const, subtle: false, theme: "dark" },
    { size, variant: "info" as const, subtle: true, theme: "dark" },
    { size, variant: "info" as const, subtle: false, theme: "dark" },
    { size, variant: "pink" as const, subtle: true, theme: "dark" },
    { size, variant: "pink" as const, subtle: false, theme: "dark" },
    { size, variant: "mint" as const, subtle: true, theme: "dark" },
    { size, variant: "purple" as const, subtle: true, theme: "dark" },
    { size, variant: "purple" as const, subtle: false, theme: "dark" },
    { size, variant: "contrast" as const, subtle: true, theme: "dark" },
  ]),
];

afterEach(cleanup);

describe("badge [unit]", () => {
  BADGE_VARIANTS.forEach((variant) => {
    test(`${variant} variant class`, () => {
      const result = render(<Badge variant={variant}>{variant}</Badge>);

      expect(result.container.firstChild).toHaveClass(
        `vesper-badge-${variant}`,
      );
    });
  });

  BADGE_SIZES.forEach((size) => {
    test(`${size} size class`, () => {
      const result = render(<Badge size={size}>{size}</Badge>);
      expect(result.container.firstChild).toHaveClass(`vesper-badge-${size}`);
    });
  });

  test("subtle variant class", () => {
    const result = render(
      <Badge variant="accent" subtle>
        Disabled
      </Badge>,
    );

    expect(result.container.firstChild).toHaveClass(
      "vesper-badge-accent-subtle",
    );
    expect(result.container.firstChild).not.toHaveClass("vesper-badge-accent");
  });

  test("renders icon when provided", () => {
    const result = render(
      <Badge variant="accent" icon={<Tenstorrent data-testid="icon" />}>
        With Icon
      </Badge>,
    );

    const view = within(result.container);
    expect(view.getByTestId("icon")).toBeDefined();
  });

  test("polymorphism", () => {
    const result = render(
      <Badge as="a" href="/link">
        As Link
      </Badge>,
    );
    const view = within(result.container);
    const link = view.getByRole("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/link");
  });

  test("additional prop passthrough", () => {
    const result = render(
      <Badge aria-label="custom label">With Aria Label</Badge>,
    );

    expect(result.container.firstChild).toHaveAttribute(
      "aria-label",
      "custom label",
    );
  });

  test("custom className", () => {
    const result = render(
      <Badge size="md" variant="accent" className="custom-class">
        Styled
      </Badge>,
    );

    const el = result.container.firstChild;
    expect(el).toHaveClass("vesper-badge");
    expect(el).toHaveClass("vesper-badge-accent");
    expect(el).toHaveClass("vesper-badge-md");
    expect(el).toHaveClass("custom-class");
  });
});

describe("badge [snapshot]", () => {
  BADGE_PERMUTATIONS.forEach((permutation) => {
    const { size, variant, subtle } = permutation;

    test(`${variant}, ${size}${subtle ? ", subtle" : ""}`, () => {
      const result = render(<Badge {...permutation}>Badge Text</Badge>);

      expect(result.container.firstChild).toMatchSnapshot();
    });
  });
});

describe("badge [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    BADGE_PERMUTATIONS.forEach((permutation) => {
      const { size, variant, subtle } = permutation;
      const label = `wcag2aaa (${variant}, ${size},${subtle ? " subtle," : ""} ${theme})`;

      const testFn = async () => {
        const result = render(<Badge {...permutation}>Badge Text</Badge>);

        expect(
          await axe.run(result.container, {
            runOnly: [
              "wcag2a",
              "wcag2aa",
              "wcag21a",
              "wcag21aa",
              "wcag22aa",
              "best-practice",
              "wcag2aaa",
            ],
          }),
        ).toHaveNoViolations();
      };

      const failsA11y = BADGE_A11Y_FAILING_PERMUTATIONS.some(
        (p) =>
          p.size === size &&
          p.variant === variant &&
          p.subtle === subtle &&
          p.theme === theme,
      );

      if (failsA11y) test.todo(label, testFn);
      else test(label, testFn);
    });
  });
});
