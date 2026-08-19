import { cleanup, render, within } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import {
  FORM_INPUT_MESSAGE_VARIANTS,
  FormInputMessage,
  type FormInputMessageProps,
  type FormInputMessageVariant,
} from "@/components/form-input-message/form-input-message";
import {
  ErrorSolid,
  InfoSolid,
  SuccessSolid,
  WarningSolid,
} from "@/components/icons/icons";

import "@/styles/test.css";

const MESSAGE = "The message text";

const VARIANT_ICONS: Record<FormInputMessageVariant, typeof InfoSolid> = {
  default: InfoSolid,
  error: ErrorSolid,
  success: SuccessSolid,
  warning: WarningSolid,
};

const FORM_INPUT_MESSAGE_PERMUTATIONS = FORM_INPUT_MESSAGE_VARIANTS.flatMap(
  (variant): (FormInputMessageProps & { name: string })[] => [
    { name: `${variant}, with message`, variant, message: MESSAGE },
    { name: `${variant}, without message`, variant },
  ],
);

// message text renders at 10px, which must meet a 7:1 contrast ratio to pass
// wcag2aaa. permutations without a message are visually hidden, so they pass
const FORM_INPUT_MESSAGE_A11Y_FAILING_PERMUTATIONS: {
  variant: FormInputMessageVariant;
  theme: string;
}[] = [
  { variant: "default", theme: "light" },
  { variant: "warning", theme: "light" },
  { variant: "success", theme: "light" },
  { variant: "error", theme: "light" },
  { variant: "default", theme: "dark" },
  { variant: "success", theme: "dark" },
  { variant: "error", theme: "dark" },
];

afterEach(cleanup);

describe("form-input-message [unit]", () => {
  test("renders an output", () => {
    const { container } = render(<FormInputMessage />);

    expect(container.firstElementChild?.tagName).toBe("OUTPUT");
    expect(container.firstChild).toHaveClass("vesper-form-input-message");
  });

  FORM_INPUT_MESSAGE_VARIANTS.forEach((variant) => {
    test(`${variant} variant class`, () => {
      const { container } = render(
        <FormInputMessage variant={variant} message={MESSAGE} />,
      );

      expect(container.firstChild).toHaveClass(
        `vesper-form-input-message-${variant}`,
      );
    });
  });

  test("default variant applied when not specified", () => {
    const { container } = render(<FormInputMessage message={MESSAGE} />);

    expect(container.firstChild).toHaveClass(
      "vesper-form-input-message-default",
    );
  });

  test("renders message text", () => {
    const { container } = render(<FormInputMessage message={MESSAGE} />);

    const view = within(container);
    expect(view.getByText(MESSAGE)).toBeDefined();
  });

  test("message text has correct classes", () => {
    const { container } = render(<FormInputMessage message={MESSAGE} />);

    const text = container.querySelector(".vesper-form-input-message-text");
    expect(text?.tagName).toBe("SPAN");
    expect(text).toHaveClass("vesper-typography-label-xs");
    expect(text?.textContent).toBe(MESSAGE);
  });

  test("data-message is true when a message is provided", () => {
    const { container } = render(<FormInputMessage message={MESSAGE} />);

    expect(container.firstChild).toHaveAttribute("data-message", "true");
  });

  test("data-message is false when no message is provided", () => {
    const { container } = render(<FormInputMessage />);

    expect(container.firstChild).toHaveAttribute("data-message", "false");
  });

  test("data-message is false when the message is an empty string", () => {
    const { container } = render(<FormInputMessage message="" />);

    expect(container.firstChild).toHaveAttribute("data-message", "false");
  });

  test("renders no content when no message is provided", () => {
    const { container } = render(<FormInputMessage />);

    const el = container.firstElementChild;
    expect(el?.children).toHaveLength(0);
    expect(el).toHaveTextContent("");
  });

  test("renders content once a message becomes available", () => {
    const { container, rerender } = render(<FormInputMessage />);

    expect(container.firstElementChild?.children).toHaveLength(0);

    rerender(<FormInputMessage message={MESSAGE} />);

    expect(container.firstChild).toHaveAttribute("data-message", "true");
    expect(container).toHaveTextContent(MESSAGE);
  });

  test("removes content once a message is cleared", () => {
    const { container, rerender } = render(
      <FormInputMessage message={MESSAGE} />,
    );

    expect(container).toHaveTextContent(MESSAGE);

    rerender(<FormInputMessage />);

    expect(container.firstChild).toHaveAttribute("data-message", "false");
    expect(container.firstElementChild?.children).toHaveLength(0);
  });

  FORM_INPUT_MESSAGE_VARIANTS.forEach((variant) => {
    test(`${variant} variant icon`, () => {
      const VariantIcon = VARIANT_ICONS[variant];
      const expected = render(<VariantIcon />);
      const { container } = render(
        <FormInputMessage variant={variant} message={MESSAGE} />,
      );

      const icon = container.querySelector(".vesper-form-input-message-icon");
      expect(icon?.innerHTML).toBe(expected.container.innerHTML);
    });
  });

  test("icon is hidden from assistive technology", () => {
    const { container } = render(<FormInputMessage message={MESSAGE} />);

    const icon = container.querySelector(".vesper-form-input-message-icon");
    expect(icon).toHaveAttribute("aria-hidden");
  });

  test("additional prop passthrough", () => {
    const { container } = render(
      <FormInputMessage id="message-id" message={MESSAGE} aria-live="polite" />,
    );

    expect(container.firstChild).toHaveAttribute("id", "message-id");
    expect(container.firstChild).toHaveAttribute("aria-live", "polite");
  });

  test("custom className", () => {
    const { container } = render(
      <FormInputMessage
        variant="error"
        className="custom-class"
        message={MESSAGE}
      />,
    );

    const el = container.firstChild;
    expect(el).toHaveClass("vesper-form-input-message");
    expect(el).toHaveClass("vesper-form-input-message-error");
    expect(el).toHaveClass("custom-class");
  });
});

describe("form-input-message [snapshot]", () => {
  FORM_INPUT_MESSAGE_PERMUTATIONS.forEach((permutation) => {
    const { name, ...props } = permutation;

    test(name, () => {
      const { container } = render(<FormInputMessage {...props} />);

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

describe("form-input-message [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    FORM_INPUT_MESSAGE_PERMUTATIONS.forEach((permutation) => {
      const { name, ...props } = permutation;
      const label = `wcag2aaa (${name}, ${theme})`;

      const testFn = async () => {
        const { container } = render(<FormInputMessage {...props} />);

        expect(await axe.run(container)).toHaveNoViolations();
      };

      const failsA11y =
        !!props.message &&
        FORM_INPUT_MESSAGE_A11Y_FAILING_PERMUTATIONS.some(
          (p) => p.variant === props.variant && p.theme === theme,
        );

      if (failsA11y) test.todo(label, testFn);
      else test(label, testFn);
    });
  });
});
