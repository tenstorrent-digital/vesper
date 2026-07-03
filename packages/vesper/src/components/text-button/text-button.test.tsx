import { render, within, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import {
  TextButton,
  type TextButtonProps,
  TEXT_BUTTON_SIZES,
  TEXT_BUTTON_VARIANTS,
} from "@/components/text-button/text-button";
import { Tenstorrent } from "@/components/icons/icons";

import "@/styles/test.css";

const TEXT_BUTTON_PERMUTATIONS: TextButtonProps[] =
  TEXT_BUTTON_VARIANTS.flatMap((variant) =>
    TEXT_BUTTON_SIZES.flatMap((size) => [
      { size, variant, disabled: false },
      { size, variant, disabled: true },
    ]),
  );

const TEXT_BUTTON_A11Y_FAILING_PERMUTATIONS: (TextButtonProps & {
  theme: string;
})[] = [
  ...TEXT_BUTTON_SIZES.flatMap((size) => [
    { size, variant: "accent" as const, disabled: false, theme: "light" },
    { size, variant: "success" as const, disabled: false, theme: "light" },
    { size, variant: "warning" as const, disabled: false, theme: "light" },
    { size, variant: "danger" as const, disabled: false, theme: "light" },
    { size, variant: "subtle" as const, disabled: false, theme: "light" },
    { size, variant: "pink" as const, disabled: false, theme: "light" },
    { size, variant: "subtle" as const, disabled: false, theme: "dark" },
    { size, variant: "danger" as const, disabled: false, theme: "dark" },
    { size, variant: "info" as const, disabled: false, theme: "dark" },
    { size, variant: "purple" as const, disabled: false, theme: "dark" },
    { size, variant: "pink" as const, disabled: false, theme: "dark" },
  ]),
];

afterEach(cleanup);

describe("text-button [unit]", () => {
  TEXT_BUTTON_VARIANTS.forEach((variant) => {
    test(`${variant} variant class`, () => {
      const result = render(
        <TextButton variant={variant}>{variant}</TextButton>,
      );

      expect(result.container.firstChild).toHaveClass(
        `vesper-text-button-${variant}`,
      );
    });
  });

  TEXT_BUTTON_SIZES.forEach((size) => {
    test(`${size} size class`, () => {
      const result = render(<TextButton size={size}>{size}</TextButton>);

      expect(result.container.firstChild).toHaveClass(
        `vesper-text-button-${size}`,
      );
    });
  });

  test("disabled", () => {
    const result = render(
      <TextButton disabled variant="accent">
        Disabled
      </TextButton>,
    );

    expect(result.container.firstChild).toBeDisabled();
    expect(result.container.firstChild).toHaveClass(
      "vesper-text-button-disabled",
    );
    expect(result.container.firstChild).not.toHaveClass(
      "vesper-text-button-accent",
    );
  });

  test("renders iconLeft", () => {
    const result = render(
      <TextButton size="md" iconLeft={<Tenstorrent data-testid="icon-left" />}>
        With Icon Left
      </TextButton>,
    );

    const view = within(result.container);
    expect(view.getByTestId("icon-left")).toBeDefined();
  });

  test("renders iconRight", () => {
    const result = render(
      <TextButton
        size="md"
        iconRight={<Tenstorrent data-testid="icon-right" />}
      >
        With Icon Right
      </TextButton>,
    );

    const view = within(result.container);
    expect(view.getByTestId("icon-right")).toBeDefined();
  });

  test("renders iconLeft and iconRight", () => {
    const result = render(
      <TextButton
        size="md"
        iconLeft={<Tenstorrent data-testid="icon-left" />}
        iconRight={<Tenstorrent data-testid="icon-right" />}
      >
        With Icon Left and Right
      </TextButton>,
    );
    const view = within(result.container);

    expect(view.getByTestId("icon-left")).toBeDefined();
    expect(view.getByTestId("icon-right")).toBeDefined();
  });

  test("polymorphism", () => {
    const result = render(
      <TextButton as="a" href="/link">
        As Link
      </TextButton>,
    );
    const view = within(result.container);
    const link = view.getByRole("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/link");
  });

  test("additional prop passthrough", () => {
    const result = render(
      <TextButton aria-label="custom label">With Aria Label</TextButton>,
    );

    expect(result.container.firstChild).toHaveAttribute(
      "aria-label",
      "custom label",
    );
  });

  test("custom className", () => {
    const result = render(
      <TextButton className="custom-class" size="md" variant="accent">
        Styled
      </TextButton>,
    );

    const btn = result.container.firstChild;
    expect(btn).toHaveClass("vesper-text-button");
    expect(btn).toHaveClass("vesper-text-button-accent");
    expect(btn).toHaveClass("vesper-text-button-md");
    expect(btn).toHaveClass("custom-class");
  });
});

describe("text-button [snapshot]", () => {
  TEXT_BUTTON_PERMUTATIONS.forEach((permutation) => {
    const { size, variant, disabled } = permutation;

    test(`${variant}, ${size}${disabled ? ", disabled" : ""}`, () => {
      const result = render(
        <TextButton {...permutation}>Button Text</TextButton>,
      );

      expect(result.container.firstChild).toMatchSnapshot();
    });
  });
});

describe("text-button [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    TEXT_BUTTON_PERMUTATIONS.forEach((permutation) => {
      const { size, variant, disabled } = permutation;
      const testName = `wcag2aaa (${variant}, ${size},${disabled ? " disabled," : ""} ${theme})`;

      const testFn = async () => {
        const result = render(
          <TextButton {...permutation}>Button Text</TextButton>,
        );

        expect(await axe.run(result.container)).toHaveNoViolations();
      };

      const failsA11y = TEXT_BUTTON_A11Y_FAILING_PERMUTATIONS.some(
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
