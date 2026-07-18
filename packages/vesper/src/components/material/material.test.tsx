import { cleanup, render, within } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import {
  INTERACTIVE_MATERIAL_STATES,
  Material,
  MATERIAL_VARIANTS,
  type MaterialProps,
} from "@/components/material/material";

import "@/styles/test.css";

type MaterialPermutation = MaterialProps & { label: string };

const NON_INTERACTIVE_VARIANTS = MATERIAL_VARIANTS.filter(
  (v) => v !== "interactive",
);

const MATERIAL_PERMUTATIONS: MaterialPermutation[] = [
  ...NON_INTERACTIVE_VARIANTS.map(
    (variant): MaterialPermutation => ({
      variant,
      label: variant,
    }),
  ),
  { variant: "interactive", label: "interactive" },
  ...INTERACTIVE_MATERIAL_STATES.map(
    (state): MaterialPermutation => ({
      variant: "interactive",
      state,
      label: `interactive, ${state}`,
    }),
  ),
];

afterEach(cleanup);

describe("material [unit]", () => {
  test("renders a div by default", () => {
    const { container } = render(<Material />);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  MATERIAL_VARIANTS.forEach((variant) => {
    test(`${variant} variant class`, () => {
      const result = render(<Material variant={variant} />);

      expect(result.container.firstChild).toHaveClass(
        `vesper-material-${variant}`,
      );
    });
  });

  test("defaults to outlined variant", () => {
    const result = render(<Material />);

    expect(result.container.firstChild).toHaveClass("vesper-material-outlined");
  });

  INTERACTIVE_MATERIAL_STATES.forEach((state) => {
    test(`interactive ${state} state class`, () => {
      const result = render(<Material variant="interactive" state={state} />);

      expect(result.container.firstChild).toHaveClass(
        `vesper-material-${state}`,
      );
    });
  });

  test("disabled state adds aria-disabled", () => {
    const result = render(<Material variant="interactive" state="disabled" />);

    expect(result.container.firstChild).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  test("non-disabled states do not add aria-disabled", () => {
    const result = render(<Material variant="interactive" state="active" />);

    expect(result.container.firstChild).not.toHaveAttribute("aria-disabled");
  });

  test("no state class for non-interactive variants", () => {
    const result = render(<Material variant="raised" />);
    const el = result.container.firstChild;

    INTERACTIVE_MATERIAL_STATES.forEach((state) => {
      expect(el).not.toHaveClass(`vesper-material-${state}`);
    });
  });

  test("polymorphism", () => {
    const result = render(
      <Material as="a" href="/link">
        As Link
      </Material>,
    );
    const view = within(result.container);
    const link = view.getByRole("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/link");
  });

  test("additional prop passthrough", () => {
    const result = render(<Material aria-label="custom label" />);

    expect(result.container.firstChild).toHaveAttribute(
      "aria-label",
      "custom label",
    );
  });

  test("custom className", () => {
    const result = render(
      <Material variant="raised" className="custom-class" />,
    );

    const el = result.container.firstChild;
    expect(el).toHaveClass("vesper-material");
    expect(el).toHaveClass("vesper-material-raised");
    expect(el).toHaveClass("custom-class");
  });
});

describe("material [snapshot]", () => {
  MATERIAL_PERMUTATIONS.forEach(({ label, ...props }) => {
    test(label, () => {
      const result = render(<Material {...props} />);

      expect(result.container.firstChild).toMatchSnapshot();
    });
  });
});

describe("material [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    MATERIAL_PERMUTATIONS.forEach(({ label, ...props }) => {
      test(`wcag2aaa (${label}, ${theme})`, async () => {
        const result = render(
          <Material {...props} style={{ width: 100, height: 100 }} />,
        );

        expect(await axe.run(result.container)).toHaveNoViolations();
      });
    });
  });
});
