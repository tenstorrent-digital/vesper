import { render, within, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import {
  Button,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
} from "@/components/button/button";
import { Tenstorrent } from "@/components/icons/icons";

import "@/styles/test.css";

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
  // 1 case for each variant
  test("variant: contrast", () => {
    const result = render(
      <Button variant="contrast" size="md">
        Button Text
      </Button>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: danger", () => {
    const result = render(
      <Button variant="danger" size="md">
        Button Text
      </Button>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: ghost", () => {
    const result = render(
      <Button variant="ghost" size="md">
        Button Text
      </Button>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: primary", () => {
    const result = render(
      <Button variant="primary" size="md">
        Button Text
      </Button>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: subtle", () => {
    const result = render(
      <Button variant="subtle" size="md">
        Button Text
      </Button>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: tertiary", () => {
    const result = render(
      <Button variant="tertiary" size="md">
        Button Text
      </Button>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: warning", () => {
    const result = render(
      <Button variant="warning" size="md">
        Button Text
      </Button>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  // 1 case for each size
  test("size: xs", () => {
    const result = render(
      <Button variant="contrast" size="xs">
        Button Text
      </Button>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("size: sm", () => {
    const result = render(
      <Button variant="contrast" size="sm">
        Button Text
      </Button>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("size: md", () => {
    const result = render(
      <Button variant="contrast" size="md">
        Button Text
      </Button>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("size: lg", () => {
    const result = render(
      <Button variant="contrast" size="lg">
        Button Text
      </Button>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  // 1 case for disabled
  test("disabled", () => {
    const result = render(
      <Button variant="primary" size="md" disabled>
        Button Text
      </Button>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
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

    // 1 case for each variant
    test(`wcag2aaa (variant: contrast, ${theme})`, async () => {
      const result = render(
        <Button variant="contrast" size="md">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (variant: danger, ${theme})`, async () => {
      const result = render(
        <Button variant="danger" size="md">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (variant: ghost, ${theme})`, async () => {
      const result = render(
        <Button variant="ghost" size="md">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (variant: primary, ${theme})`);

    test(`wcag2aaa (variant: subtle, ${theme})`, async () => {
      const result = render(
        <Button variant="subtle" size="md">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (variant: tertiary, ${theme})`, async () => {
      const result = render(
        <Button variant="tertiary" size="md">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (variant: warning, ${theme})`, async () => {
      const result = render(
        <Button variant="warning" size="md">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    // 1 case for each size
    test(`wcag2aaa (size: xs, ${theme})`, async () => {
      const result = render(
        <Button variant="contrast" size="xs">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (size: sm, ${theme})`, async () => {
      const result = render(
        <Button variant="contrast" size="sm">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (size: md, ${theme})`, async () => {
      const result = render(
        <Button variant="contrast" size="md">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (size: lg, ${theme})`, async () => {
      const result = render(
        <Button variant="contrast" size="lg">
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    // 1 case for disabled
    test(`wcag2aaa (disabled, ${theme})`, async () => {
      const result = render(
        <Button variant="primary" size="md" disabled>
          Button Text
        </Button>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
