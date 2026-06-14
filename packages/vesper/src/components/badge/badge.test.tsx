import { render, within, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import axe from "axe-core";

import {
  Badge,
  type BadgeProps,
  BADGE_SIZES,
  BADGE_VARIANTS,
} from "@/components/badge/badge";
import { Tenstorrent } from "@/components/icons/icons";

import "@/styles/styles.css";

const BADGE_PERMUTATIONS = BADGE_VARIANTS.flatMap((variant) =>
  BADGE_SIZES.flatMap((size): BadgeProps[] => [
    { size, variant, subtle: true },
    { size, variant, subtle: false },
  ]),
);

afterEach(cleanup);

describe("badge [unit]", () => {
  BADGE_VARIANTS.forEach((variant) => {
    it(`applies the correct variant class when variant is set to "${variant}"`, () => {
      const result = render(<Badge variant={variant}>{variant}</Badge>);

      expect(result.container.firstChild).toHaveClass(
        `vesper-badge-${variant}`,
      );
    });
  });

  BADGE_SIZES.forEach((size) => {
    it(`applies the correct size class when size is set to "${size}"`, () => {
      const result = render(<Badge size={size}>{size}</Badge>);
      expect(result.container.firstChild).toHaveClass(`vesper-badge-${size}`);
    });
  });

  it("applies subtle variant class when subtle={true}", () => {
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

  it("renders icon when provided", () => {
    const result = render(
      <Badge variant="accent" icon={<Tenstorrent data-testid="icon" />}>
        With Icon
      </Badge>,
    );

    const view = within(result.container);
    expect(view.getByTestId("icon")).toBeDefined();
  });

  it('renders as a custom element via the "as" prop', () => {
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

  it("passes additional props through to the element", () => {
    const result = render(
      <Badge aria-label="custom label">With Aria Label</Badge>,
    );

    expect(result.container.firstChild).toHaveAttribute(
      "aria-label",
      "custom label",
    );
  });

  it("merges custom className with component classes", () => {
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

    it(`renders correctly when variant="${variant}", size="${size}", subtle={${subtle}}`, () => {
      const result = render(<Badge {...permutation}>Badge Text</Badge>);

      expect(result.container.firstChild).toMatchSnapshot();
    });
  });
});

describe("badge [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    describe(`${theme} mode`, () => {
      beforeEach(() => {
        document.documentElement.setAttribute("data-vesper-theme", theme);
      });

      afterEach(() => {
        document.documentElement.removeAttribute("data-vesper-theme");
      });

      BADGE_PERMUTATIONS.forEach((permutation) => {
        const { size, variant, subtle } = permutation;

        it(`renders without wcag2aaa violations when variant="${variant}", size="${size}", subtle={${subtle}}`, async () => {
          const result = render(<Badge {...permutation}>Badge Text</Badge>);

          expect(
            await axe.run(result.container, {
              runOnly: "wcag2aaa",
            }),
          ).toHaveNoViolations();
        });
      });
    });
  });
});
