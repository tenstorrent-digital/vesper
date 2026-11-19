import { cleanup, render, within } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import {
  FORM_INPUT_MESSAGE_VARIANTS,
  FORM_INPUT_MESSAGE_SIZES,
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
import {
  emulateHighContrast,
  runAxeWcag2aaa,
} from "@/test-utils/high-contrast";
import "@/styles/test.css";

const MESSAGE = "The message text";

const VARIANT_ICONS: Record<FormInputMessageVariant, typeof InfoSolid> = {
  default: InfoSolid,
  error: ErrorSolid,
  success: SuccessSolid,
  warning: WarningSolid,
};

const FORM_INPUT_MESSAGE_PERMUTATIONS = FORM_INPUT_MESSAGE_VARIANTS.flatMap(
  (variant): (FormInputMessageProps & { name: string })[] =>
    FORM_INPUT_MESSAGE_SIZES.flatMap((size) => [
      {
        name: `${size} ${variant}, with message`,
        variant,
        children: MESSAGE,
        size,
      },
      { name: `${size} ${variant}, without message`, variant, size },
    ]),
);

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
        <FormInputMessage variant={variant}>{MESSAGE}</FormInputMessage>,
      );

      expect(container.firstChild).toHaveClass(
        `vesper-form-input-message-${variant}`,
      );
    });
  });

  FORM_INPUT_MESSAGE_SIZES.forEach((size) => {
    test(`${size} variant class`, () => {
      const { container } = render(
        <FormInputMessage size={size}>{MESSAGE}</FormInputMessage>,
      );

      expect(container.firstChild).toHaveClass(
        `vesper-form-input-message-${size}`,
      );
    });
  });

  test("default variant applied when not specified", () => {
    const { container } = render(
      <FormInputMessage>{MESSAGE}</FormInputMessage>,
    );

    expect(container.firstChild).toHaveClass(
      "vesper-form-input-message-default",
    );
  });

  test("renders message text", () => {
    const { container } = render(
      <FormInputMessage>{MESSAGE}</FormInputMessage>,
    );

    const view = within(container);
    expect(view.getByText(MESSAGE)).toBeDefined();
  });

  test("small variant message text has correct classes", () => {
    const { container } = render(
      <FormInputMessage size="sm">{MESSAGE}</FormInputMessage>,
    );

    const text = container.querySelector(".vesper-form-input-message-text");
    expect(text?.tagName).toBe("SPAN");
    expect(text).toHaveClass("vesper-typography-label-xxs");
    expect(text?.textContent).toBe(MESSAGE);
  });

  test("large variant message text has correct classes", () => {
    const { container } = render(
      <FormInputMessage size="lg">{MESSAGE}</FormInputMessage>,
    );

    const text = container.querySelector(".vesper-form-input-message-text");
    expect(text?.tagName).toBe("SPAN");
    expect(text).toHaveClass("vesper-typography-label-xs");
    expect(text?.textContent).toBe(MESSAGE);
  });

  test("renders react node children", () => {
    const { container } = render(
      <FormInputMessage>
        Read our <a href="/privacy">privacy policy</a>
      </FormInputMessage>,
    );

    const text = container.querySelector(".vesper-form-input-message-text");
    expect(text).toHaveTextContent("Read our privacy policy");
    expect(text?.querySelector("a")).toHaveAttribute("href", "/privacy");
    expect(container.firstChild).toHaveAttribute("data-message", "true");
  });

  test("renders numeric zero children", () => {
    const { container } = render(<FormInputMessage>{0}</FormInputMessage>);

    expect(container.firstChild).toHaveAttribute("data-message", "true");
    expect(
      container.querySelector(".vesper-form-input-message-text"),
    ).toHaveTextContent(/^0$/);
  });

  test("data-message is true when children are provided", () => {
    const { container } = render(
      <FormInputMessage>{MESSAGE}</FormInputMessage>,
    );

    expect(container.firstChild).toHaveAttribute("data-message", "true");
  });

  test("data-message is false when children are nullable, a boolean, or an empty string", () => {
    const undefinedMessage = render(<FormInputMessage />);
    const nullMessage = render(<FormInputMessage>{null}</FormInputMessage>);
    const falseMessage = render(<FormInputMessage>{false}</FormInputMessage>);
    const trueMessage = render(<FormInputMessage>{true}</FormInputMessage>);
    const emptyStringMessage = render(
      <FormInputMessage>{""}</FormInputMessage>,
    );

    expect(undefinedMessage.container.firstChild).toHaveAttribute(
      "data-message",
      "false",
    );
    expect(nullMessage.container.firstChild).toHaveAttribute(
      "data-message",
      "false",
    );
    expect(falseMessage.container.firstChild).toHaveAttribute(
      "data-message",
      "false",
    );
    expect(trueMessage.container.firstChild).toHaveAttribute(
      "data-message",
      "false",
    );
    expect(emptyStringMessage.container.firstChild).toHaveAttribute(
      "data-message",
      "false",
    );
  });

  test("renders no content when no children are provided", () => {
    const { container } = render(<FormInputMessage />);

    const el = container.firstElementChild;
    expect(el?.children).toHaveLength(0);
    expect(el).toHaveTextContent("");
  });

  test("renders content once children become available", () => {
    const { container, rerender } = render(<FormInputMessage />);

    expect(container.firstElementChild?.children).toHaveLength(0);

    rerender(<FormInputMessage>{MESSAGE}</FormInputMessage>);

    expect(container.firstChild).toHaveAttribute("data-message", "true");
    expect(container).toHaveTextContent(MESSAGE);
  });

  test("removes content once children are cleared", () => {
    const { container, rerender } = render(
      <FormInputMessage>{MESSAGE}</FormInputMessage>,
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
        <FormInputMessage variant={variant}>{MESSAGE}</FormInputMessage>,
      );

      const icon = container.querySelector(".vesper-form-input-message-icon");
      expect(icon?.innerHTML).toBe(expected.container.innerHTML);
    });
  });

  test("icon is hidden from assistive technology", () => {
    const { container } = render(
      <FormInputMessage>{MESSAGE}</FormInputMessage>,
    );

    const icon = container.querySelector(".vesper-form-input-message-icon");
    expect(icon).toHaveAttribute("aria-hidden");
  });

  test("additional prop passthrough", () => {
    const { container } = render(
      <FormInputMessage id="message-id" aria-live="polite">
        {MESSAGE}
      </FormInputMessage>,
    );

    expect(container.firstChild).toHaveAttribute("id", "message-id");
    expect(container.firstChild).toHaveAttribute("aria-live", "polite");
  });

  test("custom className", () => {
    const { container } = render(
      <FormInputMessage variant="error" className="custom-class">
        {MESSAGE}
      </FormInputMessage>,
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
      document.body.style.setProperty(
        "background",
        "var(--vesper-color-stone-0)",
      );
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    FORM_INPUT_MESSAGE_PERMUTATIONS.forEach((permutation) => {
      const { name, ...props } = permutation;

      test(`wcag2aa (${name}, ${theme})`, async () => {
        const { container } = render(<FormInputMessage {...props} />);

        expect(await axe.run(container)).toHaveNoViolations();
      });
    });
  });
});

describe("form-input-message [a11y, high contrast]", () => {
  emulateHighContrast();

  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty(
        "background",
        "var(--vesper-color-stone-0)",
      );
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    FORM_INPUT_MESSAGE_PERMUTATIONS.forEach((permutation) => {
      const { name, ...props } = permutation;

      test(`wcag2aaa (${name}, ${theme})`, async () => {
        const { container } = render(<FormInputMessage {...props} />);

        expect(await runAxeWcag2aaa(container)).toHaveNoViolations();
      });
    });
  });
});
