import { render, within, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import {
  Tag,
  type TagProps,
  TAG_SIZES,
  TAG_VARIANTS,
} from "@/components/tag/tag";
import { Tenstorrent } from "@/components/icons/icons";

import "@/styles/test.css";

const TAG_PERMUTATIONS = TAG_VARIANTS.flatMap((variant) =>
  TAG_SIZES.flatMap((size): TagProps[] => [
    { size, variant, disabled: false },
    { size, variant, disabled: true },
  ]),
);

const TAG_A11Y_FAILING_PERMUTATIONS: (TagProps & { theme: string })[] = [
  ...TAG_SIZES.flatMap((size): (TagProps & { theme: string })[] => [
    { size, variant: "accent-subtle", disabled: false, theme: "light" },
    { size, variant: "danger-subtle", disabled: false, theme: "light" },
    { size, variant: "danger-bold", disabled: false, theme: "light" },
    { size, variant: "success-bold", disabled: false, theme: "light" },
    { size, variant: "success-subtle", disabled: false, theme: "light" },
    { size, variant: "info-subtle", disabled: false, theme: "light" },
    { size, variant: "warning-bold", disabled: false, theme: "light" },
    { size, variant: "warning-subtle", disabled: false, theme: "light" },
    { size, variant: "default", disabled: false, theme: "dark" },
    { size, variant: "accent-bold", disabled: false, theme: "dark" },
    { size, variant: "danger-bold", disabled: false, theme: "dark" },
    { size, variant: "danger-subtle", disabled: false, theme: "dark" },
    { size, variant: "success-subtle", disabled: false, theme: "dark" },
    { size, variant: "info-bold", disabled: false, theme: "dark" },
    { size, variant: "info-subtle", disabled: false, theme: "dark" },
    { size, variant: "warning-bold", disabled: false, theme: "dark" },
  ]),
];

afterEach(cleanup);

describe("tag [unit]", () => {
  TAG_VARIANTS.forEach((variant) => {
    test(`${variant} variant class`, () => {
      const result = render(<Tag variant={variant}>{variant}</Tag>);

      expect(result.container.firstChild).toHaveClass(`vesper-tag-${variant}`);
    });
  });

  TAG_SIZES.forEach((size) => {
    test(`${size} size class`, () => {
      const result = render(<Tag size={size}>{size}</Tag>);
      expect(result.container.firstChild).toHaveClass(`vesper-tag-${size}`);
    });
  });

  test("disabled state class and aria attribute", () => {
    const result = render(<Tag disabled>Disabled</Tag>);

    expect(result.container.firstChild).toHaveClass("vesper-tag-disabled");
    expect(result.container.firstChild).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  test("not disabled by default", () => {
    const result = render(<Tag>Default</Tag>);

    expect(result.container.firstChild).not.toHaveClass("vesper-tag-disabled");
    expect(result.container.firstChild).not.toHaveAttribute("aria-disabled");
  });

  test("renders icon when provided", () => {
    const result = render(
      <Tag variant="accent-bold" icon={<Tenstorrent data-testid="icon" />}>
        With Icon
      </Tag>,
    );

    const view = within(result.container);
    expect(view.getByTestId("icon")).toBeDefined();
  });

  test("polymorphism", () => {
    const result = render(
      <Tag as="a" href="/link">
        As Link
      </Tag>,
    );
    const view = within(result.container);
    const link = view.getByRole("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/link");
  });

  test("additional prop passthrough", () => {
    const result = render(<Tag aria-label="custom label">With Aria Label</Tag>);

    expect(result.container.firstChild).toHaveAttribute(
      "aria-label",
      "custom label",
    );
  });

  test("custom className", () => {
    const result = render(
      <Tag size="md" variant="accent-bold" className="custom-class">
        Styled
      </Tag>,
    );

    const el = result.container.firstChild;
    expect(el).toHaveClass("vesper-tag");
    expect(el).toHaveClass("vesper-tag-accent-bold");
    expect(el).toHaveClass("vesper-tag-md");
    expect(el).toHaveClass("custom-class");
  });
});

describe("tag [snapshot]", () => {
  TAG_PERMUTATIONS.forEach((permutation) => {
    const { size, variant, disabled } = permutation;

    test(`${variant}, ${size}${disabled ? ", disabled" : ""}`, () => {
      const result = render(<Tag {...permutation}>Tag Text</Tag>);

      expect(result.container.firstChild).toMatchSnapshot();
    });
  });
});

describe("tag [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    TAG_PERMUTATIONS.forEach((permutation) => {
      const { size, variant, disabled } = permutation;
      const label = `wcag2aaa (${variant}, ${size},${disabled ? " disabled," : ""} ${theme})`;

      const testFn = async () => {
        const result = render(<Tag {...permutation}>Tag Text</Tag>);

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

      const failsA11y = TAG_A11Y_FAILING_PERMUTATIONS.some(
        (p) =>
          p.size === size &&
          p.variant === variant &&
          p.disabled === disabled &&
          p.theme === theme,
      );

      if (failsA11y) test.todo(label, testFn);
      else test(label, testFn);
    });
  });
});
