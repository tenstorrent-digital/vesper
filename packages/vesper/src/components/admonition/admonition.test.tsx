import { render, within, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import {
  Admonition,
  ADMONITION_SIZES,
  ADMONITION_VARIANTS,
} from "@/components/admonition/admonition";

import "@/styles/test.css";

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
  // 1 case for each size
  test("size: sm", () => {
    const result = render(
      <Admonition variant="warning" size="sm">content</Admonition>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("size: md", () => {
    const result = render(
      <Admonition variant="warning" size="md">content</Admonition>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  // 1 case for each variant
  test("variant: info", () => {
    const result = render(
      <Admonition variant="info" size="md">content</Admonition>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: success", () => {
    const result = render(
      <Admonition variant="success" size="md">content</Admonition>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: warning", () => {
    const result = render(
      <Admonition variant="warning" size="md">content</Admonition>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: danger", () => {
    const result = render(
      <Admonition variant="danger" size="md">content</Admonition>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: secondary", () => {
    const result = render(
      <Admonition variant="secondary" size="md">content</Admonition>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  // 1 case for each variant + subtle
  test("variant: info, subtle", () => {
    const result = render(
      <Admonition variant="info" size="md" subtle>content</Admonition>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: success, subtle", () => {
    const result = render(
      <Admonition variant="success" size="md" subtle>content</Admonition>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: warning, subtle", () => {
    const result = render(
      <Admonition variant="warning" size="md" subtle>content</Admonition>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: danger, subtle", () => {
    const result = render(
      <Admonition variant="danger" size="md" subtle>content</Admonition>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: secondary, subtle", () => {
    const result = render(
      <Admonition variant="secondary" size="md" subtle>content</Admonition>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });
});

describe("admonition [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    // 1 case for each size
    test(`wcag2aaa (size: sm, ${theme})`, async () => {
      const result = render(
        <Admonition variant="warning" size="sm">content</Admonition>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (size: md, ${theme})`, async () => {
      const result = render(
        <Admonition variant="warning" size="md">content</Admonition>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    // 1 case for each variant
    test.todo(`wcag2aaa (variant: info, ${theme})`);

    test.todo(`wcag2aaa (variant: success, ${theme})`);

    test(`wcag2aaa (variant: warning, ${theme})`, async () => {
      const result = render(
        <Admonition variant="warning" size="md">content</Admonition>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (variant: danger, ${theme})`, async () => {
      const result = render(
        <Admonition variant="danger" size="md">content</Admonition>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (variant: secondary, ${theme})`, async () => {
      const result = render(
        <Admonition variant="secondary" size="md">content</Admonition>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    // 1 case for each variant + subtle
    test.todo(`wcag2aaa (variant: info, subtle, ${theme})`);

    test(`wcag2aaa (variant: success, subtle, ${theme})`, async () => {
      const result = render(
        <Admonition variant="success" size="md" subtle>content</Admonition>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (variant: warning, subtle, ${theme})`, async () => {
      const result = render(
        <Admonition variant="warning" size="md" subtle>content</Admonition>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (variant: danger, subtle, ${theme})`);

    test(`wcag2aaa (variant: secondary, subtle, ${theme})`, async () => {
      const result = render(
        <Admonition variant="secondary" size="md" subtle>content</Admonition>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
