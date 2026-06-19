import { render, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import axe from "axe-core";

import {
  TEXT_INPUT_SIZES,
  TEXT_INPUT_VARIANTS,
  TextInput,
} from "@/components/text-input/text-input";

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
});

// describe("text-input [snapshot]", () => {
//   test("renders correctly", async () => {
//     const { container } = render(<TextInput />);

//     expect(container.firstChild).toMatchSnapshot();
//   });
// });

// describe("text-input [a11y]", () => {
//   ["light", "dark"].forEach((theme) => {
//     beforeEach(() => {
//       document.documentElement.setAttribute("data-vesper-theme", theme);
//     });

//     afterEach(() => {
//       document.documentElement.removeAttribute("data-vesper-theme");
//     });

//     test(`wcag2aaa (${theme})`, async () => {
//       const { container } = render(<TextInput />);

//       expect(
//         await axe.run(container, { runOnly: "wcag2aaa" }),
//       ).toHaveNoViolations();
//     });
//   });
// });
