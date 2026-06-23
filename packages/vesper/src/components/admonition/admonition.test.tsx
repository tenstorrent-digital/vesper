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
  test("info, sm, subtle", () => {
    const result = render(
      <Admonition variant="info" size="sm" subtle={true}>
        content
      </Admonition>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("info, sm", () => {
    const result = render(
      <Admonition variant="info" size="sm" subtle={false}>
        content
      </Admonition>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("info, md, subtle", () => {
    const result = render(
      <Admonition variant="info" size="md" subtle={true}>
        content
      </Admonition>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("info, md", () => {
    const result = render(
      <Admonition variant="info" size="md" subtle={false}>
        content
      </Admonition>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("success, sm, subtle", () => {
    const result = render(
      <Admonition variant="success" size="sm" subtle={true}>
        content
      </Admonition>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("success, sm", () => {
    const result = render(
      <Admonition variant="success" size="sm" subtle={false}>
        content
      </Admonition>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("success, md, subtle", () => {
    const result = render(
      <Admonition variant="success" size="md" subtle={true}>
        content
      </Admonition>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("success, md", () => {
    const result = render(
      <Admonition variant="success" size="md" subtle={false}>
        content
      </Admonition>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("warning, sm, subtle", () => {
    const result = render(
      <Admonition variant="warning" size="sm" subtle={true}>
        content
      </Admonition>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("warning, sm", () => {
    const result = render(
      <Admonition variant="warning" size="sm" subtle={false}>
        content
      </Admonition>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("warning, md, subtle", () => {
    const result = render(
      <Admonition variant="warning" size="md" subtle={true}>
        content
      </Admonition>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("warning, md", () => {
    const result = render(
      <Admonition variant="warning" size="md" subtle={false}>
        content
      </Admonition>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("danger, sm, subtle", () => {
    const result = render(
      <Admonition variant="danger" size="sm" subtle={true}>
        content
      </Admonition>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("danger, sm", () => {
    const result = render(
      <Admonition variant="danger" size="sm" subtle={false}>
        content
      </Admonition>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("danger, md, subtle", () => {
    const result = render(
      <Admonition variant="danger" size="md" subtle={true}>
        content
      </Admonition>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("danger, md", () => {
    const result = render(
      <Admonition variant="danger" size="md" subtle={false}>
        content
      </Admonition>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("secondary, sm, subtle", () => {
    const result = render(
      <Admonition variant="secondary" size="sm" subtle={true}>
        content
      </Admonition>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("secondary, sm", () => {
    const result = render(
      <Admonition variant="secondary" size="sm" subtle={false}>
        content
      </Admonition>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("secondary, md, subtle", () => {
    const result = render(
      <Admonition variant="secondary" size="md" subtle={true}>
        content
      </Admonition>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("secondary, md", () => {
    const result = render(
      <Admonition variant="secondary" size="md" subtle={false}>
        content
      </Admonition>,
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

    test.todo(`wcag2aaa (info, sm, subtle, ${theme})`);

    test.todo(`wcag2aaa (info, sm, ${theme})`);

    test.todo(`wcag2aaa (info, md, subtle, ${theme})`);

    test.todo(`wcag2aaa (info, md, ${theme})`);

    test(`wcag2aaa (success, sm, subtle, ${theme})`, async () => {
      const result = render(
        <Admonition variant="success" size="sm" subtle={true}>
          content
        </Admonition>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (success, sm, ${theme})`);

    test(`wcag2aaa (success, md, subtle, ${theme})`, async () => {
      const result = render(
        <Admonition variant="success" size="md" subtle={true}>
          content
        </Admonition>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (success, md, ${theme})`);

    test(`wcag2aaa (warning, sm, subtle, ${theme})`, async () => {
      const result = render(
        <Admonition variant="warning" size="sm" subtle={true}>
          content
        </Admonition>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (warning, sm, ${theme})`, async () => {
      const result = render(
        <Admonition variant="warning" size="sm" subtle={false}>
          content
        </Admonition>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (warning, md, subtle, ${theme})`, async () => {
      const result = render(
        <Admonition variant="warning" size="md" subtle={true}>
          content
        </Admonition>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (warning, md, ${theme})`, async () => {
      const result = render(
        <Admonition variant="warning" size="md" subtle={false}>
          content
        </Admonition>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (danger, sm, subtle, ${theme})`);

    test(`wcag2aaa (danger, sm, ${theme})`, async () => {
      const result = render(
        <Admonition variant="danger" size="sm" subtle={false}>
          content
        </Admonition>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (danger, md, subtle, ${theme})`);

    test(`wcag2aaa (danger, md, ${theme})`, async () => {
      const result = render(
        <Admonition variant="danger" size="md" subtle={false}>
          content
        </Admonition>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (secondary, sm, subtle, ${theme})`, async () => {
      const result = render(
        <Admonition variant="secondary" size="sm" subtle={true}>
          content
        </Admonition>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (secondary, sm, ${theme})`, async () => {
      const result = render(
        <Admonition variant="secondary" size="sm" subtle={false}>
          content
        </Admonition>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (secondary, md, subtle, ${theme})`, async () => {
      const result = render(
        <Admonition variant="secondary" size="md" subtle={true}>
          content
        </Admonition>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (secondary, md, ${theme})`, async () => {
      const result = render(
        <Admonition variant="secondary" size="md" subtle={false}>
          content
        </Admonition>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });
  });
});
