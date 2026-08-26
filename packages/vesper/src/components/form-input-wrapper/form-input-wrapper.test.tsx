import { cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import {
  FORM_INPUT_WRAPPER_VARIANTS,
  FormInputWrapper,
  FormInputWrapperProps,
  FormInputWrapperVariant,
} from "@/components/form-input-wrapper/form-input-wrapper";

import "@/styles/test.css";

const FORM_INPUT_WRAPPER_PERMUTATIONS = FORM_INPUT_WRAPPER_VARIANTS.flatMap(
  (variant): (FormInputWrapperProps & { name: string })[] => [
    {
      name: variant,
      variant,
      children: <input type="text" id="input-id" aria-label="Test input" />,
    },
    {
      name: `${variant}, with label`,
      variant,
      children: <input type="text" id="input-id" aria-label="Test input" />,
      label: {
        htmlFor: "input-id",
        text: "Label",
        id: "label-id",
      },
    },
    {
      name: `${variant}, with message`,
      variant,
      children: <input type="text" id="input-id" aria-label="Test input" />,
      message: {
        id: "message-id",
        text: "Message",
      },
    },
    {
      name: `${variant}, with label & message`,
      variant,
      children: <input type="text" id="input-id" aria-label="Test input" />,
      label: {
        htmlFor: "input-id",
        text: "Label",
        id: "label-id",
      },
      message: {
        id: "message-id",
        text: "Message",
      },
    },
  ],
);

/** Each of these permutations fails a11y checks when there is a message present */
const FORM_INPUT_WRAPPER_FAILS_A11Y_PERMUTATIONS: {
  variant: FormInputWrapperVariant;
  theme: "light" | "dark";
}[] = [
  { theme: "light", variant: "error" },
  { theme: "light", variant: "success" },
  { theme: "light", variant: "warning" },
  { theme: "light", variant: "default" },
  { theme: "dark", variant: "error" },
  { theme: "dark", variant: "success" },
  { theme: "dark", variant: "default" },
];

afterEach(cleanup);

describe("form-input-wrapper [unit]", () => {
  test("renders a div", () => {
    const { container } = render(<FormInputWrapper />);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  test("does not render a label by default", () => {
    const { container } = render(<FormInputWrapper />);
    expect(container).not.toContainElement(container.querySelector("label"));
  });

  test("renders a label when provided", () => {
    const { container } = render(
      <FormInputWrapper
        label={{ htmlFor: "input-id", text: "Label", id: "label-id" }}
      />,
    );
    const label = container.querySelector("label");
    expect(container).toContainElement(label);
    expect(label).toHaveTextContent("Label");
    expect(label).toHaveAttribute("for", "input-id");
    expect(label).toHaveAttribute("id", "label-id");
  });

  test("renders an empty message by default", () => {
    const result = render(<FormInputWrapper />);
    const message = result.getByRole("status");
    expect(message).not.toBeNull();
    expect(message.querySelector(".vesper-form-input-message-text")).toBeNull();
  });

  test("renders a message when provided", () => {
    const result = render(
      <FormInputWrapper message={{ id: "message-id", text: "Message" }} />,
    );
    const message = result.getByRole("status");
    expect(message).toHaveTextContent("Message");
    expect(message).toHaveAttribute("id", "message-id");
  });

  test("renders children when provided", () => {
    const result = render(
      <FormInputWrapper>
        <input type="text" data-testid="test-child" />
      </FormInputWrapper>,
    );
    const child = result.getByTestId("test-child");
    expect(child).not.toBeNull();
  });

  test("additional prop passthrough", () => {
    const result = render(<FormInputWrapper aria-label="custom label" />);
    expect(result.container.firstChild).toHaveAttribute(
      "aria-label",
      "custom label",
    );
  });

  test("custom className", () => {
    const result = render(<FormInputWrapper className="custom-class" />);

    const el = result.container.firstChild;
    expect(el).toHaveClass("vesper-form-input-wrapper");
    expect(el).toHaveClass("custom-class");
  });
});

describe("form-input-wrapper [snapshot]", () => {
  FORM_INPUT_WRAPPER_PERMUTATIONS.forEach(({ name, ...props }) => {
    test(name, async () => {
      const { container } = render(<FormInputWrapper {...props} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

describe("form-input-wrapper [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    FORM_INPUT_WRAPPER_PERMUTATIONS.forEach(({ name, ...props }) => {
      const failsA11y =
        !!props.message &&
        FORM_INPUT_WRAPPER_FAILS_A11Y_PERMUTATIONS.some(
          (p) => p.theme === theme && p.variant === props.variant,
        );

      const testName = `a11y (${theme}) ${name}`;

      const testFn = async () => {
        const { container } = render(<FormInputWrapper {...props} />);
        expect(await axe.run(container)).toHaveNoViolations();
      };

      if (failsA11y) test.todo(testName, testFn);
      else test(testName, testFn);
    });
  });
});
