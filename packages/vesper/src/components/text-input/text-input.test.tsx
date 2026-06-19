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

const TEXT_INPUT_PERMUTATIONS = TEXT_INPUT_VARIANTS.flatMap((variant) =>
  TEXT_INPUT_SIZES.flatMap((size): (TextInputProps & { name: string })[] => [
    {
      name: `${variant}, ${size}, multiline`,
      variant,
      size,
      multiline: true,
      message: "Message text",
    },
    {
      name: `${variant}, ${size}`,
      variant,
      size,
      multiline: false,
      message: "Message text",
    },
    {
      name: `${variant}, ${size}, icon`,
      variant,
      size,
      multiline: false,
      icon: <Globe />,
      message: "Message text",
    },
    {
      name: `${variant}, ${size}, multiline, disabled`,
      variant,
      size,
      multiline: true,
      message: "Message text",
      disabled: true,
    },
    {
      name: `${variant}, ${size}, disabled`,
      variant,
      size,
      multiline: false,
      message: "Message text",
      disabled: true,
    },
    {
      name: `${variant}, ${size}, icon, disabled`,
      variant,
      size,
      multiline: false,
      icon: <Globe />,
      message: "Message text",
      disabled: true,
    },
  ]),
);

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
  TEXT_INPUT_PERMUTATIONS.forEach((permutation) => {
    const { name, ...props } = permutation;

    test(name, () => {
      const { container } = render(<TextInput {...props} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

describe("text-input [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    TEXT_INPUT_PERMUTATIONS.forEach((permutation) => {
      const { name, ...props } = permutation;

      test(`wcag2aaa (${name}, ${theme})`, async () => {
        const { container } = render(<TextInput {...props} />);
        expect(
          await axe.run(container.firstChild!, { runOnly: "wcag2aaa" }),
        ).toHaveNoViolations();
      });
    });
  });
});
