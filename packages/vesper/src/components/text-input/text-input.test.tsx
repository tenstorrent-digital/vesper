import { render, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import axe from "axe-core";

import {
  TEXT_INPUT_SIZES,
  TEXT_INPUT_VARIANTS,
  TextInput,
} from "@/components/text-input/text-input";
import { Globe } from "@/components/icons/icons";

import "@/styles/test.css";

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
  test("variant: default", () => {
    const { container } = render(
      <TextInput variant="default" size="lg" message="Message text" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("variant: warning", () => {
    const { container } = render(
      <TextInput variant="warning" size="lg" message="Message text" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("variant: success", () => {
    const { container } = render(
      <TextInput variant="success" size="lg" message="Message text" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("variant: error", () => {
    const { container } = render(
      <TextInput variant="error" size="lg" message="Message text" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("size: sm", () => {
    const { container } = render(<TextInput size="sm" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("size: md", () => {
    const { container } = render(<TextInput size="md" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("size: lg", () => {
    const { container } = render(<TextInput size="lg" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("multiline", () => {
    const { container } = render(<TextInput multiline size="lg" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("with icon", () => {
    const { container } = render(<TextInput icon={<Globe />} size="lg" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("with label", () => {
    const { container } = render(<TextInput label="Label text" size="lg" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("disabled", () => {
    const { container } = render(<TextInput disabled size="lg" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("disabled, multiline", () => {
    const { container } = render(<TextInput disabled multiline size="lg" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("full options", () => {
    const { container } = render(
      <TextInput
        variant="error"
        size="lg"
        multiline
        label="Label text"
        message="Message text"
        disabled
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
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

    test.todo(`wcag2aaa (default, ${theme})`);

    test.todo(`wcag2aaa (default, disabled, ${theme})`);

    test(`wcag2aaa (warning, ${theme})`, async () => {
      const { container } = render(
        <TextInput
          variant="warning"
          label="Label text"
          message="Message text"
        />,
      );
      expect(
        await axe.run(container.firstChild!, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (warning, disabled, ${theme})`, async () => {
      const { container } = render(
        <TextInput
          variant="warning"
          label="Label text"
          message="Message text"
          disabled
        />,
      );
      expect(
        await axe.run(container.firstChild!, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (success, ${theme})`);

    test.todo(`wcag2aaa (success, disabled, ${theme})`);

    test(`wcag2aaa (error, ${theme})`, async () => {
      const { container } = render(
        <TextInput variant="error" label="Label text" message="Message text" />,
      );
      expect(
        await axe.run(container.firstChild!, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (error, disabled, ${theme})`, async () => {
      const { container } = render(
        <TextInput
          variant="error"
          label="Label text"
          message="Message text"
          disabled
        />,
      );
      expect(
        await axe.run(container.firstChild!, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
