import { cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import {
  TEXT_AREA_SIZES,
  TEXT_AREA_VARIANTS,
  TextArea,
  TextAreaProps,
} from "@/components/text-area/text-area";

import "@/styles/test.css";

const TEXTAREA_SNAPSHOT_PERMUTATIONS: (TextAreaProps & { name: string })[] = [
  // One per variant
  ...TEXT_AREA_VARIANTS.map((variant) => ({
    name: `variant: ${variant}`,
    variant,
    size: "lg" as const,
  })),
  // One per size
  ...TEXT_AREA_SIZES.map((size) => ({
    name: `size: ${size}`,
    size,
  })),
  // Meaningful feature combos
  { name: "with icon", size: "lg" as const },
  { name: "disabled", disabled: true, size: "lg" as const },
  {
    name: "full options",
    variant: "error",
    size: "lg" as const,
    disabled: true,
  },
];

const TEXT_AREA_PERMUTATIONS = TEXT_AREA_VARIANTS.flatMap((variant) =>
  TEXT_AREA_SIZES.flatMap((size) => [
    {
      name: `${variant}, ${size}`,
      variant,
      size,
      label: "Label text",
      message: "Message text",
      disabled: false,
    },
    {
      name: `${variant}, ${size}, disabled`,
      variant,
      size,
      label: "Label text",
      message: "Message text",
      disabled: true,
    },
  ]),
);

afterEach(cleanup);

describe("text-area [unit]", () => {
  test("renders a textarea", () => {
    const result = render(<TextArea />);
    expect(result.getByRole("textbox").tagName).toBe("TEXTAREA");
  });

  TEXT_AREA_VARIANTS.forEach((variant) => {
    test(`${variant} variant`, () => {
      const result = render(<TextArea variant={variant} />);

      expect(result.container.firstChild).toHaveClass(
        `vesper-text-area-${variant}`,
      );
    });
  });

  TEXT_AREA_SIZES.forEach((size) => {
    test(`${size} size`, () => {
      const result = render(<TextArea size={size} />);

      expect(result.container.firstChild).toHaveClass(
        `vesper-text-area-${size}`,
      );
    });
  });

  test("disabled prop disables textarea", () => {
    const result = render(<TextArea disabled />);
    expect(result.getByRole("textbox")).toBeDisabled();
  });

  test("applies the default height to the textarea", () => {
    const result = render(<TextArea />);

    const wrapper = result.container.firstElementChild as HTMLDivElement;
    expect(wrapper.style.height).toBe("6.5rem");
  });

  test("height prop overrides the default height", () => {
    const result = render(<TextArea height={200} />);

    const wrapper = result.container.firstElementChild as HTMLDivElement;
    expect(wrapper.style.height).toBe("12.5rem");
  });

  test("textarea is not resizeable by default", () => {
    const result = render(<TextArea />);

    expect(result.getByRole("textbox").style.resize).toBe("none");
  });

  test("textarea can be resized when resizeable is true", () => {
    const result = render(<TextArea resizeable />);
    expect(result.getByRole("textbox").style.resize).toBe("block");
  });

  test("additional prop passthrough", () => {
    const result = render(<TextArea aria-label="custom label" />);
    const textarea = result.getByRole("textbox");
    expect(textarea).toHaveAttribute("aria-label", "custom label");
  });

  test("custom className", () => {
    const result = render(
      <TextArea size="lg" variant="default" className="custom-class" />,
    );

    const el = result.container.firstChild;
    expect(el).toHaveClass("custom-class");
  });
});

describe("text-area [snapshot]", () => {
  TEXTAREA_SNAPSHOT_PERMUTATIONS.forEach((permutation) => {
    const { name, ...props } = permutation;

    test(name, () => {
      const { container } = render(<TextArea {...props} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

describe("text-area [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    TEXT_AREA_PERMUTATIONS.forEach((permutation) => {
      const { name, ...props } = permutation;
      test(`wcag2aaa (${name}, ${theme})`, async () => {
        const { container } = render(
          <TextArea aria-label="Label" {...props} />,
        );
        expect(await axe.run(container.firstChild!)).toHaveNoViolations();
      });
    });
  });
});
