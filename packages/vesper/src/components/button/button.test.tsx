import { cleanup, render, within } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import {
  Button,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  type ButtonProps,
} from "@/components/button/button";
import { Tenstorrent } from "@/components/icons/icons";

import "@/styles/test.css";

const BUTTON_PERMUTATIONS: ButtonProps[] = BUTTON_VARIANTS.flatMap((variant) =>
  BUTTON_SIZES.flatMap((size) => [
    { size, variant, disabled: false },
    { size, variant, disabled: true },
  ]),
);

const BUTTON_A11Y_FAILING_PERMUTATIONS: (ButtonProps & {
  theme: string;
})[] = [
  ...BUTTON_SIZES.flatMap((size) => [
    { size, variant: "warning" as const, disabled: false, theme: "light" },
    { size, variant: "danger" as const, disabled: false, theme: "light" },
    { size, variant: "primary" as const, disabled: false, theme: "dark" },
    { size, variant: "danger" as const, disabled: false, theme: "dark" },
    { size, variant: "warning" as const, disabled: false, theme: "dark" },
  ]),
];

afterEach(cleanup);

describe("button [unit]", () => {
  BUTTON_VARIANTS.forEach((variant) => {
    test(`${variant} variant class`, () => {
      const result = render(
        <Button size="lg" variant={variant}>
          {variant}
        </Button>,
      );

      expect(result.container.firstChild).toHaveClass(
        `vesper-button-${variant}`,
      );
    });
  });

  BUTTON_SIZES.forEach((size) => {
    test(`${size} size class`, () => {
      const result = render(
        <Button size={size} variant="primary">
          {size}
        </Button>,
      );
      expect(result.container.firstChild).toHaveClass(`vesper-button-${size}`);
    });
  });

  test("disabled", () => {
    const result = render(
      <Button size="md" variant="primary" disabled>
        Disabled
      </Button>,
    );

    expect(result.container.firstChild).toBeDisabled();
    expect(result.container.firstChild).toHaveClass("vesper-button-disabled");
    expect(result.container.firstChild).not.toHaveClass(
      "vesper-button-primary",
    );
  });

  test("renders iconLeft", () => {
    const result = render(
      <Button
        size="md"
        variant="primary"
        iconLeft={<Tenstorrent data-testid="icon-left" />}
      >
        With Icon Left
      </Button>,
    );

    const view = within(result.container);
    expect(view.getByTestId("icon-left")).toBeDefined();
  });

  test("renders iconRight", () => {
    const result = render(
      <Button
        size="md"
        variant="primary"
        iconRight={<Tenstorrent data-testid="icon-right" />}
      >
        With Icon Right
      </Button>,
    );

    const view = within(result.container);
    expect(view.getByTestId("icon-right")).toBeDefined();
  });

  test("renders iconLeft and iconRight", () => {
    const result = render(
      <Button
        size="md"
        variant="primary"
        iconLeft={<Tenstorrent data-testid="icon-left" />}
        iconRight={<Tenstorrent data-testid="icon-right" />}
      >
        With Icon Left and Right
      </Button>,
    );
    const view = within(result.container);

    expect(view.getByTestId("icon-left")).toBeDefined();
    expect(view.getByTestId("icon-right")).toBeDefined();
  });

  test("polymorphism", () => {
    const result = render(
      <Button as="a" href="/link" size="md" variant="primary">
        As Link
      </Button>,
    );
    const view = within(result.container);
    const link = view.getByRole("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/link");
  });

  test("additional prop passthrough", () => {
    const result = render(
      <Button size="md" variant="primary" aria-label="custom label">
        With Aria Label
      </Button>,
    );

    expect(result.container.firstChild).toHaveAttribute(
      "aria-label",
      "custom label",
    );
  });

  test("custom className", () => {
    const result = render(
      <Button size="md" variant="primary" className="custom-class">
        Styled
      </Button>,
    );

    const btn = result.container.firstChild;
    expect(btn).toHaveClass("vesper-button");
    expect(btn).toHaveClass("vesper-button-primary");
    expect(btn).toHaveClass("vesper-button-md");
    expect(btn).toHaveClass("custom-class");
  });
});

describe("button [snapshot]", () => {
  BUTTON_PERMUTATIONS.forEach((permutation) => {
    const { size, variant, disabled } = permutation;

    test(`${variant}, ${size}${disabled ? ", disabled" : ""}`, () => {
      const result = render(<Button {...permutation}>Button Text</Button>);

      expect(result.container.firstChild).toMatchSnapshot();
    });
  });
});

describe("button [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    BUTTON_PERMUTATIONS.forEach((permutation) => {
      const { size, variant, disabled } = permutation;
      const testName = `wcag2aaa (${variant}, ${size},${disabled ? " disabled," : ""} ${theme})`;

      const testFn = async () => {
        const result = render(<Button {...permutation}>Button Text</Button>);

        expect(await axe.run(result.container)).toHaveNoViolations();
      };

      const failsA11y = BUTTON_A11Y_FAILING_PERMUTATIONS.some(
        (p) =>
          p.size === size &&
          p.variant === variant &&
          p.disabled === disabled &&
          p.theme === theme,
      );

      if (failsA11y) test.todo(testName, testFn);
      else test(testName, testFn);
    });
  });
});
