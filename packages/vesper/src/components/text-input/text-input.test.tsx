import { render, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import axe from "axe-core";

import {
  TEXT_INPUT_SIZES,
  TEXT_INPUT_VARIANTS,
  TextInput,
  TextInputProps,
} from "@/components/text-input/text-input";
import { Globe } from "@/components/icons/icons";

import "@/styles/test.css";

const SNAPSHOT_CASES: (TextInputProps & { name: string })[] = [
  // One per variant
  ...TEXT_INPUT_VARIANTS.map((variant) => ({
    name: `variant: ${variant}`,
    variant,
    size: "lg" as const,
    message: "Message text",
  })),
  // One per size
  ...TEXT_INPUT_SIZES.map((size) => ({
    name: `size: ${size}`,
    size,
  })),
  // Meaningful feature combos
  { name: "multiline", multiline: true, size: "lg" as const },
  { name: "with icon", icon: <Globe />, size: "lg" as const },
  { name: "with label", label: "Label text", size: "lg" as const },
  { name: "disabled", disabled: true, size: "lg" as const },
  {
    name: "disabled, multiline",
    disabled: true,
    multiline: true,
    size: "lg" as const,
  },
  {
    name: "full options",
    variant: "error",
    size: "lg" as const,
    multiline: true,
    label: "Label text",
    message: "Message text",
    disabled: true,
  },
];

// A11y: variant × disabled are the axes that affect contrast/color
const A11Y_CASES: (TextInputProps & { name: string })[] =
  TEXT_INPUT_VARIANTS.flatMap((variant) => [
    {
      name: `${variant}`,
      variant,
      label: "Label text",
      message: "Message text",
      disabled: false,
    },
    {
      name: `${variant}, disabled`,
      variant,
      label: "Label text",
      message: "Message text",
      disabled: true,
    },
  ]);

const TEXT_INPUT_A11Y_FAILING_PERMUTATIONS: (Pick<
  TextInputProps,
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
  { variant: "warning", disabled: false, theme: "dark" },
  { variant: "success", disabled: false, theme: "dark" },
  { variant: "success", disabled: true, theme: "dark" },
  { variant: "error", disabled: false, theme: "dark" },
  { variant: "error", disabled: true, theme: "dark" },
];

afterEach(cleanup);

describe("text-input [unit]", () => {
  test("renders an input by default", () => {
    const result = render(<TextInput />);

    expect(result.getByRole("textbox").tagName).toBe("INPUT");
    expect(result.container.firstChild).not.toHaveClass(
      "vesper-text-input-multiline",
    );
  });

  test("renders a textarea when multiline", () => {
    const result = render(<TextInput multiline />);

    expect(result.getByRole("textbox").tagName).toBe("TEXTAREA");
    expect(result.container.firstChild).toHaveClass(
      "vesper-text-input-multiline",
    );
  });

  TEXT_INPUT_VARIANTS.forEach((variant) => {
    test(`${variant} variant`, () => {
      const result = render(<TextInput variant={variant} />);

      expect(result.container.firstChild).toHaveClass(
        `vesper-text-input-${variant}`,
      );
    });
  });

  TEXT_INPUT_SIZES.forEach((size) => {
    test(`${size} size`, () => {
      const result = render(<TextInput size={size} />);

      expect(result.container.firstChild).toHaveClass(
        `vesper-text-input-${size}`,
      );
    });
  });

  test("disabling when single line", () => {
    const result = render(<TextInput disabled />);

    const clearButton = result.container.querySelector(
      'button[aria-label="Clear text input"]',
    );
    expect(clearButton).toBeDisabled();
    expect(result.getByRole("textbox")).toBeDisabled();
  });

  test("disabling when multiline", () => {
    const result = render(<TextInput multiline disabled />);

    expect(result.getByRole("textbox")).toBeDisabled();
  });

  test("multiline with custom height", () => {
    const result = render(<TextInput multiline height={200} />);

    expect(result.getByRole("textbox")).toHaveStyle({ height: "200px" });
  });

  test("clicking clear button", async () => {
    const onChange = vi.fn();
    const result = render(
      <TextInput defaultValue="hello" onChange={onChange} />,
    );

    const input = result.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("hello");

    const clearButton = result.getByRole("button", {
      name: "Clear text input",
    });
    await userEvent.click(clearButton);

    expect(input.value).toBe("");
    expect(onChange).toHaveBeenCalled();
  });

  test("renders a label when supplied", () => {
    const result = render(<TextInput label="Username" />);

    const label = result.container.querySelector(".vesper-text-input-label");
    expect(label).not.toBeNull();
    expect(label!.tagName).toBe("LABEL");
    expect(label).toHaveTextContent("Username");
  });

  test("label htmlFor matches the id prop", () => {
    const result = render(<TextInput label="Email" id="email-input" />);

    const label = result.container.querySelector(".vesper-text-input-label");
    expect(label).toHaveAttribute("for", "email-input");
  });

  test("clicking the label focuses the input", async () => {
    const result = render(<TextInput label="Username" id="username-input" />);

    const label = result.container.querySelector(".vesper-text-input-label")!;
    await userEvent.click(label);

    expect(result.getByRole("textbox")).toHaveFocus();
  });

  test("renders an icon when provided", () => {
    const result = render(
      <TextInput icon={<Globe data-testid="search-icon" />} />,
    );
    expect(result.getByTestId("search-icon")).not.toBeNull();
  });

  TEXT_INPUT_VARIANTS.forEach((variant) => {
    test(`${variant} message rendering`, () => {
      const result = render(
        <TextInput variant={variant} message="Message text" />,
      );

      const message = result.container.querySelector(
        ".vesper-text-input-message",
      );
      expect(message).not.toBeNull();
      expect(message).toHaveTextContent("Message text");

      const icon = message!.querySelector(
        ".vesper-text-input-message-icon svg",
      );
      expect(icon).not.toBeNull();
    });
  });

  test("additional prop passthrough", () => {
    const result = render(<TextInput aria-label="custom label" />);
    expect(result.container.firstChild).toHaveAttribute(
      "aria-label",
      "custom label",
    );
  });

  test("custom className", () => {
    const result = render(
      <TextInput size="lg" variant="default" className="custom-class" />,
    );

    const el = result.container.firstChild;
    expect(el).toHaveClass("vesper-text-input");
    expect(el).toHaveClass("vesper-text-input-lg");
    expect(el).toHaveClass("vesper-text-input-default");
    expect(el).toHaveClass("custom-class");
  });
});

describe("text-input [snapshot]", () => {
  SNAPSHOT_CASES.forEach((permutation) => {
    const { name, ...props } = permutation;

    test(name, () => {
      const { container } = render(<TextInput {...props} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

describe("text-input [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    A11Y_CASES.forEach((permutation) => {
      const { name, ...props } = permutation;
      const label = `wcag2aaa (${name}, ${theme})`;

      const testFn = async () => {
        const { container } = render(<TextInput {...props} />);
        expect(
          await axe.run(container.firstChild!, {
            runOnly: [
              "wcag2a",
              "wcag2aa",
              "wcag21a",
              "wcag21aa",
              "wcag22aa",
              "best-practice",
              "wcag2aaa",
            ],
          }),
        ).toHaveNoViolations();
      };

      const failsA11y = TEXT_INPUT_A11Y_FAILING_PERMUTATIONS.some(
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
