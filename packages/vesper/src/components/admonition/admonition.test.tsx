import { render, within, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import {
  Admonition,
  ADMONITION_SIZES,
  ADMONITION_VARIANTS,
  type AdmonitionProps,
} from "@/components/admonition/admonition";

import "@/styles/test.css";

const ADMONITION_PERMUTATIONS = ADMONITION_VARIANTS.flatMap((variant) =>
  ADMONITION_SIZES.flatMap((size): AdmonitionProps[] => [
    { size, variant, subtle: true },
    { size, variant, subtle: false },
  ]),
);

const ADMONITION_A11Y_FAILING_PERMUTATIONS: (AdmonitionProps & {
  theme: string;
})[] = [
  ...ADMONITION_SIZES.flatMap((size) => [
    { size, variant: "info" as const, subtle: false, theme: "light" },
    { size, variant: "success" as const, subtle: true, theme: "light" },
    { size, variant: "success" as const, subtle: false, theme: "light" },
    { size, variant: "warning" as const, subtle: true, theme: "light" },
    { size, variant: "warning" as const, subtle: false, theme: "light" },
    { size, variant: "danger" as const, subtle: true, theme: "light" },
    { size, variant: "danger" as const, subtle: false, theme: "light" },
    { size, variant: "info" as const, subtle: true, theme: "dark" },
    { size, variant: "info" as const, subtle: false, theme: "dark" },
    { size, variant: "success" as const, subtle: false, theme: "dark" },
    { size, variant: "danger" as const, subtle: true, theme: "dark" },
    { size, variant: "danger" as const, subtle: false, theme: "dark" },
    { size, variant: "secondary" as const, subtle: false, theme: "dark" },
  ]),
];

afterEach(cleanup);

describe("admonition [unit]", () => {
  ADMONITION_VARIANTS.forEach((variant) => {
    test(`${variant} variant class`, () => {
      const result = render(
        <Admonition variant={variant}>{variant}</Admonition>,
      );

      expect(result.container.firstChild).toHaveClass(
        `vesper-admonition-${variant}`,
      );
    });
  });

  ADMONITION_SIZES.forEach((size) => {
    test(`${size} size class`, () => {
      const result = render(<Admonition size={size}>{size}</Admonition>);
      expect(result.container.firstChild).toHaveClass(
        `vesper-admonition-${size}`,
      );
    });
  });

  test("subtle variant class", () => {
    const result = render(<Admonition subtle>Subtle</Admonition>);

    expect(result.container.firstChild).toHaveClass("vesper-admonition-subtle");
  });

  test("renders cta when provided", () => {
    const result = render(
      <Admonition cta={{ children: "explore" }}>With CTA</Admonition>,
    );

    const cta = within(result.container).getByRole("button");
    expect(cta).toBeDefined();
  });

  test("polymorphism", () => {
    const result = render(
      <Admonition as="a" href="/link">
        As Link
      </Admonition>,
    );
    const view = within(result.container);
    const link = view.getByRole("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/link");
  });

  test("additional prop passthrough", () => {
    const result = render(
      <Admonition aria-label="custom label">With Aria Label</Admonition>,
    );

    expect(result.container.firstChild).toHaveAttribute(
      "aria-label",
      "custom label",
    );
  });

  test("custom className", () => {
    const result = render(
      <Admonition className="custom-class">Styled</Admonition>,
    );

    const el = result.container.firstChild;
    expect(el).toHaveClass("vesper-admonition");
    expect(el).toHaveClass("custom-class");
  });

  test("children", () => {
    const result = render(<Admonition>Hello world</Admonition>);

    expect(result.container).toHaveTextContent("Hello world");
  });

  test("polymorphic cta", () => {
    const result = render(
      <Admonition ctaAs="a" cta={{ children: "Go", href: "/link" }}>
        With CTA Link
      </Admonition>,
    );

    const link = within(result.container).getByRole("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/link");
    expect(link).toHaveTextContent("Go");
  });
});

describe("admonition [snapshot]", () => {
  ADMONITION_PERMUTATIONS.forEach((permutation) => {
    const { size, variant, subtle } = permutation;

    test(`${variant}, ${size}${subtle ? ", subtle" : ""}`, () => {
      const result = render(<Admonition {...permutation}>content</Admonition>);

      expect(result.container.firstChild).toMatchSnapshot();
    });
  });
});

describe("admonition [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    ADMONITION_PERMUTATIONS.forEach((permutation) => {
      const { size, variant, subtle } = permutation;
      const label = `wcag2aaa (${variant}, ${size},${subtle ? " subtle," : ""} ${theme})`;

      const testFn = async () => {
        const result = render(
          <Admonition {...permutation}>content</Admonition>,
        );

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

      const failsA11y = ADMONITION_A11Y_FAILING_PERMUTATIONS.some(
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
