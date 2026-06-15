import { render, within, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import axe from "axe-core";

import {
  Admonition,
  ADMONITION_SIZES,
  ADMONITION_VARIANTS,
  type AdmonitionProps,
} from "@/components/admonition/admonition";

import "@/styles/test.css";

const ADMONITION_PERMUTATIONS = ADMONITION_VARIANTS.flatMap((variant) =>
  ADMONITION_SIZES.flatMap((size): AdmonitionProps[] => [
    { size, variant, subtle: true },
    { size, variant, subtle: false },
  ]),
);

afterEach(cleanup);

describe("admonition [unit]", () => {
  ADMONITION_VARIANTS.forEach((variant) => {
    it(`applies the correct variant class when variant is set to "${variant}"`, () => {
      const result = render(
        <Admonition variant={variant}>{variant}</Admonition>,
      );

      expect(result.container.firstChild).toHaveClass(
        `vesper-admonition-${variant}`,
      );
    });
  });

  ADMONITION_SIZES.forEach((size) => {
    it(`applies the correct size class when size is set to "${size}"`, () => {
      const result = render(<Admonition size={size}>{size}</Admonition>);
      expect(result.container.firstChild).toHaveClass(
        `vesper-admonition-${size}`,
      );
    });
  });

  it("applies subtle variant class when subtle={true}", () => {
    const result = render(<Admonition subtle>Subtle</Admonition>);

    expect(result.container.firstChild).toHaveClass("vesper-admonition-subtle");
  });

  it("renders cta when provided", () => {
    const result = render(
      <Admonition cta={{ children: "explore" }}>With CTA</Admonition>,
    );

    const cta = within(result.container).getByRole("button");
    expect(cta).toBeDefined();
  });

  it('renders as a custom element via the "as" prop', () => {
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

  it("passes additional props through to the element", () => {
    const result = render(
      <Admonition aria-label="custom label">With Aria Label</Admonition>,
    );

    expect(result.container.firstChild).toHaveAttribute(
      "aria-label",
      "custom label",
    );
  });

  it("merges custom className with component classes", () => {
    const result = render(
      <Admonition className="custom-class">Styled</Admonition>,
    );

    const el = result.container.firstChild;
    expect(el).toHaveClass("vesper-admonition");
    expect(el).toHaveClass("custom-class");
  });

  it("renders children text content in the DOM", () => {
    const result = render(<Admonition>Hello world</Admonition>);

    expect(result.container).toHaveTextContent("Hello world");
  });

  it("renders cta as a custom element via the ctaAs prop", () => {
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
  ADMONITION_PERMUTATIONS.forEach((permutation) => {
    const { size, variant, subtle } = permutation;

    it(`renders correctly when variant="${variant}", size="${size}", subtle={${subtle}}`, () => {
      const result = render(<Admonition {...permutation}>content</Admonition>);

      expect(result.container.firstChild).toMatchSnapshot();
    });
  });
});

describe("admonition [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    describe(`${theme} mode`, () => {
      beforeEach(() => {
        document.documentElement.setAttribute("data-vesper-theme", theme);
      });

      afterEach(() => {
        document.documentElement.removeAttribute("data-vesper-theme");
      });

      ADMONITION_PERMUTATIONS.forEach((permutation) => {
        const { size, variant, subtle } = permutation;

        it(`renders without wcag2aaa violations when variant="${variant}", size="${size}", subtle={${subtle}}`, async () => {
          const result = render(
            <Admonition {...permutation}>content</Admonition>,
          );

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
