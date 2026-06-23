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
  ["light", "dark"].forEach((theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    test(`wcag2aaa (accent, sm, subtle, ${theme})`, async () => {
      const result = render(
        <Badge variant="accent" size="sm" subtle={true}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (accent, sm, ${theme})`);

    test(`wcag2aaa (accent, md, subtle, ${theme})`, async () => {
      const result = render(
        <Badge variant="accent" size="md" subtle={true}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (accent, md, ${theme})`);

    test(`wcag2aaa (accent, lg, subtle, ${theme})`, async () => {
      const result = render(
        <Badge variant="accent" size="lg" subtle={true}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (accent, lg, ${theme})`);

    test.todo(`wcag2aaa (success, sm, subtle, ${theme})`);

    test(`wcag2aaa (success, sm, ${theme})`, async () => {
      const result = render(
        <Badge variant="success" size="sm" subtle={false}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (success, md, subtle, ${theme})`);

    test(`wcag2aaa (success, md, ${theme})`, async () => {
      const result = render(
        <Badge variant="success" size="md" subtle={false}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (success, lg, subtle, ${theme})`);

    test(`wcag2aaa (success, lg, ${theme})`, async () => {
      const result = render(
        <Badge variant="success" size="lg" subtle={false}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (warning, sm, subtle, ${theme})`, async () => {
      const result = render(
        <Badge variant="warning" size="sm" subtle={true}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (warning, sm, ${theme})`, async () => {
      const result = render(
        <Badge variant="warning" size="sm" subtle={false}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (warning, md, subtle, ${theme})`, async () => {
      const result = render(
        <Badge variant="warning" size="md" subtle={true}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (warning, md, ${theme})`, async () => {
      const result = render(
        <Badge variant="warning" size="md" subtle={false}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (warning, lg, subtle, ${theme})`, async () => {
      const result = render(
        <Badge variant="warning" size="lg" subtle={true}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (warning, lg, ${theme})`, async () => {
      const result = render(
        <Badge variant="warning" size="lg" subtle={false}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (danger, sm, subtle, ${theme})`, async () => {
      const result = render(
        <Badge variant="danger" size="sm" subtle={true}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (danger, sm, ${theme})`, async () => {
      const result = render(
        <Badge variant="danger" size="sm" subtle={false}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (danger, md, subtle, ${theme})`, async () => {
      const result = render(
        <Badge variant="danger" size="md" subtle={true}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (danger, md, ${theme})`, async () => {
      const result = render(
        <Badge variant="danger" size="md" subtle={false}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (danger, lg, subtle, ${theme})`, async () => {
      const result = render(
        <Badge variant="danger" size="lg" subtle={true}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (danger, lg, ${theme})`, async () => {
      const result = render(
        <Badge variant="danger" size="lg" subtle={false}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (info, sm, subtle, ${theme})`);

    test.todo(`wcag2aaa (info, sm, ${theme})`);

    test.todo(`wcag2aaa (info, md, subtle, ${theme})`);

    test.todo(`wcag2aaa (info, md, ${theme})`);

    test.todo(`wcag2aaa (info, lg, subtle, ${theme})`);

    test.todo(`wcag2aaa (info, lg, ${theme})`);

    test(`wcag2aaa (purple, sm, subtle, ${theme})`, async () => {
      const result = render(
        <Badge variant="purple" size="sm" subtle={true}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (purple, sm, ${theme})`, async () => {
      const result = render(
        <Badge variant="purple" size="sm" subtle={false}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (purple, md, subtle, ${theme})`, async () => {
      const result = render(
        <Badge variant="purple" size="md" subtle={true}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (purple, md, ${theme})`, async () => {
      const result = render(
        <Badge variant="purple" size="md" subtle={false}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (purple, lg, subtle, ${theme})`, async () => {
      const result = render(
        <Badge variant="purple" size="lg" subtle={true}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (purple, lg, ${theme})`, async () => {
      const result = render(
        <Badge variant="purple" size="lg" subtle={false}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (pink, sm, subtle, ${theme})`);

    test.todo(`wcag2aaa (pink, sm, ${theme})`);

    test.todo(`wcag2aaa (pink, md, subtle, ${theme})`);

    test.todo(`wcag2aaa (pink, md, ${theme})`);

    test.todo(`wcag2aaa (pink, lg, subtle, ${theme})`);

    test.todo(`wcag2aaa (pink, lg, ${theme})`);

    test.todo(`wcag2aaa (mint, sm, subtle, ${theme})`);

    test(`wcag2aaa (mint, sm, ${theme})`, async () => {
      const result = render(
        <Badge variant="mint" size="sm" subtle={false}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (mint, md, subtle, ${theme})`);

    test(`wcag2aaa (mint, md, ${theme})`, async () => {
      const result = render(
        <Badge variant="mint" size="md" subtle={false}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (mint, lg, subtle, ${theme})`);

    test(`wcag2aaa (mint, lg, ${theme})`, async () => {
      const result = render(
        <Badge variant="mint" size="lg" subtle={false}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (contrast, sm, subtle, ${theme})`, async () => {
      const result = render(
        <Badge variant="contrast" size="sm" subtle={true}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (contrast, sm, ${theme})`, async () => {
      const result = render(
        <Badge variant="contrast" size="sm" subtle={false}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (contrast, md, subtle, ${theme})`, async () => {
      const result = render(
        <Badge variant="contrast" size="md" subtle={true}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (contrast, md, ${theme})`, async () => {
      const result = render(
        <Badge variant="contrast" size="md" subtle={false}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (contrast, lg, subtle, ${theme})`, async () => {
      const result = render(
        <Badge variant="contrast" size="lg" subtle={true}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (contrast, lg, ${theme})`, async () => {
      const result = render(
        <Badge variant="contrast" size="lg" subtle={false}>
          Badge Text
        </Badge>,
      );

      expect(
        await axe.run(result.container, {
          runOnly: "wcag2aaa",
        }),
      ).toHaveNoViolations();
    });
  });
});
