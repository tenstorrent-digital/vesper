import type { ComponentProps, ComponentType, ReactNode } from "react";
import { cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import {
  FORM_INPUT_MESSAGE_VARIANTS,
  FormInputMessage,
  type FormInputMessageVariant,
} from "@/components/form-input-message/form-input-message";
import {
  ErrorSolid,
  InfoSolid,
  SuccessSolid,
  WarningSolid,
} from "@/components/icons/icons";

import "@/styles/test.css";

afterEach(cleanup);

/** The icon each variant is expected to render */
const VARIANT_ICONS = {
  default: InfoSolid,
  error: ErrorSolid,
  success: SuccessSolid,
  warning: WarningSolid,
} satisfies Record<
  FormInputMessageVariant,
  ComponentType<ComponentProps<"svg">>
>;

const FORM_INPUT_MESSAGE_PERMUTATIONS = FORM_INPUT_MESSAGE_VARIANTS.flatMap(
  (variant) => [
    { name: `${variant}, with message`, variant, hasMessage: true },
    { name: `${variant}, without message`, variant, hasMessage: false },
  ],
);

/**
 * Permutations that currently fail the `color-contrast-enhanced` (wcag2aaa) rule
 */
const FORM_INPUT_MESSAGE_A11Y_FAILING_PERMUTATIONS: {
  variant: FormInputMessageVariant;
  hasMessage: boolean;
  theme: string;
}[] = [
  { variant: "default", hasMessage: true, theme: "light" },
  { variant: "warning", hasMessage: true, theme: "light" },
  { variant: "success", hasMessage: true, theme: "light" },
  { variant: "error", hasMessage: true, theme: "light" },
  { variant: "default", hasMessage: true, theme: "dark" },
  { variant: "success", hasMessage: true, theme: "dark" },
  { variant: "error", hasMessage: true, theme: "dark" },
];

const getOutput = (container: HTMLElement) => container.firstElementChild;

const getIcon = (container: HTMLElement) =>
  container.querySelector(".vesper-form-input-message-icon");

const getText = (container: HTMLElement) =>
  container.querySelector(".vesper-form-input-message-text");

describe("form-input-message [unit]", () => {
  test("renders an output", () => {
    const { container } = render(<FormInputMessage />);
    expect(container.firstElementChild?.tagName).toBe("OUTPUT");
  });

  test("exposes the implicit status role", () => {
    const { getByRole } = render(
      <FormInputMessage>The message text</FormInputMessage>,
    );
    expect(getByRole("status")).toHaveTextContent("The message text");
  });

  test("base class is always applied", () => {
    const { container } = render(<FormInputMessage />);
    expect(getOutput(container)).toHaveClass("vesper-form-input-message");
  });

  test("custom className is merged", () => {
    const { container } = render(<FormInputMessage className="custom-class" />);
    expect(getOutput(container)).toHaveClass("vesper-form-input-message");
    expect(getOutput(container)).toHaveClass(
      "vesper-form-input-message-default",
    );
    expect(getOutput(container)).toHaveClass("custom-class");
  });

  test("renders children as the message text", () => {
    const { container } = render(
      <FormInputMessage>The message text</FormInputMessage>,
    );
    expect(getText(container)).toHaveTextContent("The message text");
  });

  describe("variant", () => {
    test("defaults to the default variant", () => {
      const { container } = render(<FormInputMessage />);
      expect(getOutput(container)).toHaveClass(
        "vesper-form-input-message-default",
      );
    });

    FORM_INPUT_MESSAGE_VARIANTS.forEach((variant) => {
      test(`${variant} variant class`, () => {
        const { container } = render(<FormInputMessage variant={variant} />);
        expect(getOutput(container)).toHaveClass(
          `vesper-form-input-message-${variant}`,
        );
      });
    });

    test("only the active variant class is applied", () => {
      const { container } = render(<FormInputMessage variant="error" />);

      FORM_INPUT_MESSAGE_VARIANTS.filter((v) => v !== "error").forEach(
        (variant) => {
          expect(getOutput(container)).not.toHaveClass(
            `vesper-form-input-message-${variant}`,
          );
        },
      );
    });
  });

  describe("icon", () => {
    FORM_INPUT_MESSAGE_VARIANTS.forEach((variant) => {
      test(`${variant} variant renders its matching icon`, () => {
        const Icon = VARIANT_ICONS[variant];
        const { container } = render(
          <FormInputMessage variant={variant}>
            The message text
          </FormInputMessage>,
        );
        const { container: expected } = render(<Icon />);

        expect(getIcon(container)?.innerHTML).toBe(expected.innerHTML);
      });
    });

    test("renders exactly one icon at a time", () => {
      const { container } = render(
        <FormInputMessage variant="warning">The message text</FormInputMessage>,
      );
      expect(container.querySelectorAll("svg")).toHaveLength(1);
    });

    test("icon is hidden from assistive technology", () => {
      const { container } = render(<FormInputMessage />);
      expect(getIcon(container)).toHaveAttribute("aria-hidden");
    });

    test("icon renders even when there is no message", () => {
      const { container } = render(<FormInputMessage />);
      expect(container.querySelectorAll("svg")).toHaveLength(1);
    });
  });

  describe("data-message", () => {
    const MESSAGE_CASES: {
      name: string;
      children: ReactNode;
      expected: boolean;
    }[] = [
      { name: "no children", children: undefined, expected: false },
      { name: "null children", children: null, expected: false },
      { name: "false children", children: false, expected: false },
      { name: "empty string", children: "", expected: false },
      { name: "string", children: "The message text", expected: true },
      { name: "whitespace string", children: " ", expected: true },
      { name: "number", children: 42, expected: true },
      { name: "zero", children: 0, expected: true },
      { name: "bigint", children: 42n, expected: true },
      {
        name: "element with text",
        children: <span>Text</span>,
        expected: true,
      },
      { name: "empty element", children: <span />, expected: false },
      {
        name: "element with empty children",
        children: <span>{null}</span>,
        expected: false,
      },
      {
        name: "nested elements with text",
        children: (
          <span>
            <strong>Nested</strong>
          </span>
        ),
        expected: true,
      },
      {
        name: "fragment with mixed children",
        children: <>Hello {"World"}</>,
        expected: true,
      },
      {
        name: "array of strings",
        children: ["Hello ", "World"],
        expected: true,
      },
      {
        name: "multiple JSX children",
        children: ["Hello ", <strong key="name">World</strong>],
        expected: true,
      },
    ];

    MESSAGE_CASES.forEach(({ name, children, expected }) => {
      test(`${name} -> data-message="${expected}"`, () => {
        const { container } = render(
          <FormInputMessage>{children}</FormInputMessage>,
        );
        expect(getOutput(container)).toHaveAttribute(
          "data-message",
          String(expected),
        );
      });
    });
  });

  describe("prop forwarding", () => {
    test("forwards id to the output element", () => {
      const { container } = render(<FormInputMessage id="message-id" />);
      expect(getOutput(container)).toHaveAttribute("id", "message-id");
    });

    test("forwards htmlFor to the output element", () => {
      const { container } = render(<FormInputMessage htmlFor="input-id" />);
      expect(getOutput(container)).toHaveAttribute("for", "input-id");
    });

    test("forwards aria attributes to the output element", () => {
      const { container } = render(
        <FormInputMessage aria-live="assertive" aria-label="Validation" />,
      );
      expect(getOutput(container)).toHaveAttribute("aria-live", "assertive");
      expect(getOutput(container)).toHaveAttribute("aria-label", "Validation");
    });

    test("forwards data attributes to the output element", () => {
      const { container } = render(<FormInputMessage data-testid="message" />);
      expect(getOutput(container)).toHaveAttribute("data-testid", "message");
    });
  });
});

describe("form-input-message [snapshot]", () => {
  FORM_INPUT_MESSAGE_PERMUTATIONS.forEach(({ name, variant, hasMessage }) => {
    test(name, () => {
      const { container } = render(
        <FormInputMessage variant={variant}>
          {hasMessage ? "The message text" : undefined}
        </FormInputMessage>,
      );
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

    FORM_INPUT_MESSAGE_PERMUTATIONS.forEach(({ name, variant, hasMessage }) => {
      const label = `${name} (${theme})`;

      const testFn = async () => {
        const { container } = render(
          <FormInputMessage variant={variant}>
            {hasMessage ? "The message text" : undefined}
          </FormInputMessage>,
        );

        expect(await axe.run(container)).toHaveNoViolations();
      };

      const failsA11y = FORM_INPUT_MESSAGE_A11Y_FAILING_PERMUTATIONS.some(
        (p) =>
          p.variant === variant &&
          p.hasMessage === hasMessage &&
          p.theme === theme,
      );

      if (failsA11y) test.todo(label, testFn);
      else test(label, testFn);
    });
  });
});
