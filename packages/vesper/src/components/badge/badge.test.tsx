import { render, within, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Badge, BADGE_SIZES, BADGE_VARIANTS } from "@/components/badge/badge";
import { Tenstorrent } from "@/components/icons/icons";

import "@/styles/test.css";

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
  test("size: sm", () => {
    const result = render(
      <Badge variant="warning" size="sm">
        Badge Text
      </Badge>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("size: md", () => {
    const result = render(
      <Badge variant="warning" size="md">
        Badge Text
      </Badge>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("size: lg", () => {
    const result = render(
      <Badge variant="warning" size="lg">
        Badge Text
      </Badge>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: accent", () => {
    const result = render(
      <Badge variant="accent" size="md">
        Badge Text
      </Badge>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: success", () => {
    const result = render(
      <Badge variant="success" size="md">
        Badge Text
      </Badge>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: warning", () => {
    const result = render(
      <Badge variant="warning" size="md">
        Badge Text
      </Badge>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: danger", () => {
    const result = render(
      <Badge variant="danger" size="md">
        Badge Text
      </Badge>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: info", () => {
    const result = render(
      <Badge variant="info" size="md">
        Badge Text
      </Badge>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: purple", () => {
    const result = render(
      <Badge variant="purple" size="md">
        Badge Text
      </Badge>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: pink", () => {
    const result = render(
      <Badge variant="pink" size="md">
        Badge Text
      </Badge>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: mint", () => {
    const result = render(
      <Badge variant="mint" size="md">
        Badge Text
      </Badge>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: contrast", () => {
    const result = render(
      <Badge variant="contrast" size="md">
        Badge Text
      </Badge>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: accent, subtle", () => {
    const result = render(
      <Badge variant="accent" size="md" subtle>
        Badge Text
      </Badge>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: success, subtle", () => {
    const result = render(
      <Badge variant="success" size="md" subtle>
        Badge Text
      </Badge>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: warning, subtle", () => {
    const result = render(
      <Badge variant="warning" size="md" subtle>
        Badge Text
      </Badge>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: danger, subtle", () => {
    const result = render(
      <Badge variant="danger" size="md" subtle>
        Badge Text
      </Badge>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: info, subtle", () => {
    const result = render(
      <Badge variant="info" size="md" subtle>
        Badge Text
      </Badge>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: purple, subtle", () => {
    const result = render(
      <Badge variant="purple" size="md" subtle>
        Badge Text
      </Badge>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: pink, subtle", () => {
    const result = render(
      <Badge variant="pink" size="md" subtle>
        Badge Text
      </Badge>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: mint, subtle", () => {
    const result = render(
      <Badge variant="mint" size="md" subtle>
        Badge Text
      </Badge>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: contrast, subtle", () => {
    const result = render(
      <Badge variant="contrast" size="md" subtle>
        Badge Text
      </Badge>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });
});

describe("badge [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    test(`wcag2aaa (size: sm, ${theme})`, async () => {
      const result = render(
        <Badge variant="warning" size="sm">
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (size: md, ${theme})`, async () => {
      const result = render(
        <Badge variant="warning" size="md">
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (size: lg, ${theme})`, async () => {
      const result = render(
        <Badge variant="warning" size="lg">
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (variant: accent, ${theme})`);

    test(`wcag2aaa (variant: success, ${theme})`, async () => {
      const result = render(
        <Badge variant="success" size="md">
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (variant: warning, ${theme})`, async () => {
      const result = render(
        <Badge variant="warning" size="md">
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (variant: danger, ${theme})`, async () => {
      const result = render(
        <Badge variant="danger" size="md">
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (variant: info, ${theme})`);

    test(`wcag2aaa (variant: purple, ${theme})`, async () => {
      const result = render(
        <Badge variant="purple" size="md">
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (variant: pink, ${theme})`);

    test(`wcag2aaa (variant: mint, ${theme})`, async () => {
      const result = render(
        <Badge variant="mint" size="md">
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (variant: contrast, ${theme})`, async () => {
      const result = render(
        <Badge variant="contrast" size="md">
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (variant: accent, subtle, ${theme})`, async () => {
      const result = render(
        <Badge variant="accent" size="md" subtle>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (variant: success, subtle, ${theme})`);

    test(`wcag2aaa (variant: warning, subtle, ${theme})`, async () => {
      const result = render(
        <Badge variant="warning" size="md" subtle>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (variant: danger, subtle, ${theme})`, async () => {
      const result = render(
        <Badge variant="danger" size="md" subtle>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (variant: info, subtle, ${theme})`);

    test(`wcag2aaa (variant: purple, subtle, ${theme})`, async () => {
      const result = render(
        <Badge variant="purple" size="md" subtle>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (variant: pink, subtle, ${theme})`);

    test.todo(`wcag2aaa (variant: mint, subtle, ${theme})`);

    test(`wcag2aaa (variant: contrast, subtle, ${theme})`, async () => {
      const result = render(
        <Badge variant="contrast" size="md" subtle>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
