import { render, within, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import {
  Button,
  type ButtonProps,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
} from "@/components/button/button";
import { Tenstorrent } from "@/components/icons/icons";

import "@/styles/test.css";

const BUTTON_PERMUTATIONS: ButtonProps[] = BUTTON_VARIANTS.flatMap((variant) =>
  BUTTON_SIZES.flatMap((size) => [
    { size, variant, disabled: false },
    { size, variant, disabled: true },
  ]),
);

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
  ["light", "dark"].forEach((theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    test(`wcag2aaa (contrast, xs, ${theme})`, async () => {
      const result = render(
        <Button variant="contrast" size="xs">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (contrast, xs, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="contrast" size="xs" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (contrast, sm, ${theme})`, async () => {
      const result = render(
        <Button variant="contrast" size="sm">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (contrast, sm, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="contrast" size="sm" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (contrast, md, ${theme})`, async () => {
      const result = render(
        <Button variant="contrast" size="md">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (contrast, md, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="contrast" size="md" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (contrast, lg, ${theme})`, async () => {
      const result = render(
        <Button variant="contrast" size="lg">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (contrast, lg, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="contrast" size="lg" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (danger, xs, ${theme})`, async () => {
      const result = render(
        <Button variant="danger" size="xs">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (danger, xs, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="danger" size="xs" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (danger, sm, ${theme})`, async () => {
      const result = render(
        <Button variant="danger" size="sm">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (danger, sm, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="danger" size="sm" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (danger, md, ${theme})`, async () => {
      const result = render(
        <Button variant="danger" size="md">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (danger, md, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="danger" size="md" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (danger, lg, ${theme})`, async () => {
      const result = render(
        <Button variant="danger" size="lg">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (danger, lg, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="danger" size="lg" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (ghost, xs, ${theme})`, async () => {
      const result = render(
        <Button variant="ghost" size="xs">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (ghost, xs, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="ghost" size="xs" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (ghost, sm, ${theme})`, async () => {
      const result = render(
        <Button variant="ghost" size="sm">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (ghost, sm, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="ghost" size="sm" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (ghost, md, ${theme})`, async () => {
      const result = render(
        <Button variant="ghost" size="md">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (ghost, md, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="ghost" size="md" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (ghost, lg, ${theme})`, async () => {
      const result = render(
        <Button variant="ghost" size="lg">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (ghost, lg, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="ghost" size="lg" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (primary, xs, ${theme})`);

    test(`wcag2aaa (primary, xs, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="primary" size="xs" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (primary, sm, ${theme})`);

    test(`wcag2aaa (primary, sm, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="primary" size="sm" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (primary, md, ${theme})`);

    test(`wcag2aaa (primary, md, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="primary" size="md" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (primary, lg, ${theme})`);

    test(`wcag2aaa (primary, lg, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="primary" size="lg" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (subtle, xs, ${theme})`, async () => {
      const result = render(
        <Button variant="subtle" size="xs">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (subtle, xs, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="subtle" size="xs" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (subtle, sm, ${theme})`, async () => {
      const result = render(
        <Button variant="subtle" size="sm">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (subtle, sm, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="subtle" size="sm" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (subtle, md, ${theme})`, async () => {
      const result = render(
        <Button variant="subtle" size="md">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (subtle, md, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="subtle" size="md" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (subtle, lg, ${theme})`, async () => {
      const result = render(
        <Button variant="subtle" size="lg">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (subtle, lg, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="subtle" size="lg" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (tertiary, xs, ${theme})`, async () => {
      const result = render(
        <Button variant="tertiary" size="xs">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (tertiary, xs, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="tertiary" size="xs" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (tertiary, sm, ${theme})`, async () => {
      const result = render(
        <Button variant="tertiary" size="sm">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (tertiary, sm, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="tertiary" size="sm" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (tertiary, md, ${theme})`, async () => {
      const result = render(
        <Button variant="tertiary" size="md">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (tertiary, md, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="tertiary" size="md" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (tertiary, lg, ${theme})`, async () => {
      const result = render(
        <Button variant="tertiary" size="lg">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (tertiary, lg, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="tertiary" size="lg" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (warning, xs, ${theme})`, async () => {
      const result = render(
        <Button variant="warning" size="xs">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (warning, xs, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="warning" size="xs" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (warning, sm, ${theme})`, async () => {
      const result = render(
        <Button variant="warning" size="sm">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (warning, sm, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="warning" size="sm" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (warning, md, ${theme})`, async () => {
      const result = render(
        <Button variant="warning" size="md">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (warning, md, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="warning" size="md" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (warning, lg, ${theme})`, async () => {
      const result = render(
        <Button variant="warning" size="lg">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (warning, lg, disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="warning" size="lg" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });
  });
});
