import { cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import {
  Textarea,
  TEXTAREA_SIZES,
  TEXTAREA_VARIANTS,
  TextareaProps,
} from "@/components/textarea/textarea";

import "@/styles/test.css";

const TEXTAREA_SNAPSHOT_PERMUTATIONS: (TextareaProps & { name: string })[] = [
  // One per variant
  ...TEXTAREA_VARIANTS.map((variant) => ({
    name: `variant: ${variant}`,
    variant,
    size: "lg" as const,
    message: "Message text",
  })),
  // One per size
  ...TEXTAREA_SIZES.map((size) => ({
    name: `size: ${size}`,
    size,
  })),
  // Meaningful feature combos
  { name: "with icon", size: "lg" as const },
  { name: "with label", label: "Label text", size: "lg" as const },
  { name: "disabled", disabled: true, size: "lg" as const },
  {
    name: "full options",
    variant: "error",
    size: "lg" as const,
    label: "Label text",
    message: "Message text",
    disabled: true,
  },
];

const TEXTAREA_PERMUTATIONS = TEXTAREA_VARIANTS.flatMap((variant) =>
  TEXTAREA_SIZES.flatMap((size) => [
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

const TEXTAREA_A11Y_FAILING_PERMUTATIONS: (Pick<
  TextareaProps,
  "variant" | "disabled"
> & { theme: string })[] = [
  { variant: "default", disabled: false, theme: "light" },
  { variant: "default", disabled: true, theme: "light" },
  { variant: "warning", disabled: false, theme: "light" },
  { variant: "warning", disabled: true, theme: "light" },
  { variant: "success", disabled: false, theme: "light" },
  { variant: "success", disabled: true, theme: "light" },
  { variant: "error", disabled: false, theme: "light" },
  { variant: "error", disabled: true, theme: "light" },
  { variant: "default", disabled: false, theme: "dark" },
  { variant: "default", disabled: true, theme: "dark" },
  { variant: "success", disabled: false, theme: "dark" },
  { variant: "success", disabled: true, theme: "dark" },
  { variant: "error", disabled: false, theme: "dark" },
  { variant: "error", disabled: true, theme: "dark" },
];

afterEach(cleanup);

describe("textarea [unit]", () => {
  test("renders a textarea", () => {
    const result = render(<Textarea />);
    expect(result.getByRole("textbox").tagName).toBe("TEXTAREA");
  });

  TEXTAREA_VARIANTS.forEach((variant) => {
    test(`${variant} variant`, () => {
      const result = render(<Textarea variant={variant} />);

      expect(result.container.firstChild).toHaveClass(
        `vesper-textarea-${variant}`,
      );
    });
  });

  TEXTAREA_SIZES.forEach((size) => {
    test(`${size} size`, () => {
      const result = render(<Textarea size={size} />);

      expect(result.container.firstChild).toHaveClass(
        `vesper-textarea-${size}`,
      );
    });
  });

  test("disabled prop disables textarea", () => {
    const result = render(<Textarea disabled />);
    expect(result.getByRole("textbox")).toBeDisabled();
  });

  test("renders a label when supplied", () => {
    const result = render(<Textarea label="Username" />);

    const label = result.container.querySelector(".vesper-textarea-label");
    expect(label).not.toBeNull();
    expect(label!.tagName).toBe("LABEL");
    expect(label).toHaveTextContent("Username");
  });

  test("label htmlFor matches the id prop", () => {
    const result = render(<Textarea label="Bio" id="bio" />);

    const label = result.container.querySelector(".vesper-textarea-label");
    expect(label).toHaveAttribute("for", "bio");
  });

  test("clicking the label focuses the textarea", async () => {
    const result = render(<Textarea label="Bio" id="bio" />);

    const label = result.container.querySelector(".vesper-textarea-label")!;
    await userEvent.click(label);

    expect(result.getByRole("textbox")).toHaveFocus();
  });

  test("the id prop is forwarded to the textarea", () => {
    const result = render(<Textarea label="Bio" id="bio" />);

    expect(result.getByRole("textbox")).toHaveAttribute("id", "bio");
  });

  test("an id is generated when the id prop is omitted", () => {
    const result = render(<Textarea label="Bio" />);

    const textarea = result.getByRole("textbox");
    expect(textarea.id).not.toBe("");
    expect(
      result.container.querySelector(".vesper-textarea-label"),
    ).toHaveAttribute("for", textarea.id);
  });

  test("the generated id associates the label with the textarea", () => {
    const result = render(<Textarea label="Username" />);

    expect(result.getByLabelText("Username")).toBe(result.getByRole("textbox"));
  });

  test("additional prop passthrough", () => {
    const result = render(<Textarea aria-label="custom label" />);
    const textarea = result.getByRole("textbox");
    expect(textarea).toHaveAttribute("aria-label", "custom label");
  });

  test("custom className", () => {
    const result = render(
      <Textarea size="lg" variant="default" className="custom-class" />,
    );

    const el = result.container.firstChild;
    expect(el).toHaveClass("vesper-textarea");
    expect(el).toHaveClass("vesper-textarea-lg");
    expect(el).toHaveClass("vesper-textarea-default");
    expect(el).toHaveClass("custom-class");
  });
});

describe("textarea [snapshot]", () => {
  TEXTAREA_SNAPSHOT_PERMUTATIONS.forEach((permutation) => {
    const { name, ...props } = permutation;

    test(name, () => {
      const { container } = render(<Textarea {...props} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

describe("textarea [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    TEXTAREA_PERMUTATIONS.forEach((permutation) => {
      const { name, ...props } = permutation;
      const label = `wcag2aaa (${name}, ${theme})`;

      const testFn = async () => {
        const { container } = render(<Textarea {...props} />);
        expect(await axe.run(container.firstChild!)).toHaveNoViolations();
      };

      const failsA11y = TEXTAREA_A11Y_FAILING_PERMUTATIONS.some(
        (p) =>
          p.variant === props.variant &&
          p.disabled === props.disabled &&
          p.theme === theme,
      );

      if (failsA11y) test.todo(label, testFn);
      else test(label, testFn);
    });
  });
});
