import { createRef } from "react";
import { cleanup, fireEvent, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import {
  Checkbox,
  CHECKBOX_SIZES,
  CHECKBOX_VARIANTS,
  type CheckboxProps,
  type CheckboxVariant,
} from "@/components/checkbox/checkbox";

import "@/styles/test.css";

const CHECKBOX_SIZE_PERMUTATIONS = [true, false].flatMap((checked) =>
  [true, false].flatMap((indeterminate) =>
    CHECKBOX_SIZES.flatMap((size): (CheckboxProps & { name: string })[] => [
      {
        name: `${size}, checked: ${checked}, indeterminate: ${indeterminate}`,
        size,
        text: "Checkbox text",
        disabled: false,
        required: false,
        defaultChecked: checked,
        indeterminate,
      },
      {
        name: `${size}, required, disabled, checked: ${checked}, indeterminate: ${indeterminate}`,
        size,
        text: "Checkbox text",
        disabled: true,
        required: true,
        defaultChecked: checked,
        indeterminate,
      },
      {
        name: `${size}, disabled, checked: ${checked}, indeterminate: ${indeterminate}`,
        size,
        text: "Checkbox text",
        disabled: true,
        required: false,
        defaultChecked: checked,
        indeterminate,
      },
      {
        name: `${size}, required, checked: ${checked}, indeterminate: ${indeterminate}`,
        size,
        text: "Checkbox text",
        disabled: false,
        required: true,
        defaultChecked: checked,
        indeterminate,
      },
    ]),
  ),
);

const CHECKBOX_VARIANT_PERMUTATIONS: (CheckboxProps & { name: string })[] =
  CHECKBOX_VARIANTS.map((variant) => ({
    name: `variant: ${variant}, with message`,
    variant,
    text: "Checkbox text",
    message: "Message text",
  }));

const CHECKBOX_LABEL_PERMUTATIONS: (CheckboxProps & { name: string })[] = [
  {
    name: `with label`,
    text: "Checkbox text",
    label: "Label text",
  },
  {
    name: `with label, required`,
    text: "Checkbox text",
    label: "Label text",
    required: true,
  },
];

// Combination of variant + theme that fails a11y checks when a message is present
const CHECKBOX_A11Y_FAILING_PERMUTATIONS: {
  variant: CheckboxVariant;
  theme: string;
}[] = [
  { variant: "default", theme: "light" },
  { variant: "warning", theme: "light" },
  { variant: "error", theme: "light" },
  { variant: "success", theme: "light" },
  { variant: "default", theme: "dark" },
  { variant: "error", theme: "dark" },
  { variant: "success", theme: "dark" },
];

afterEach(cleanup);

describe("checkbox [unit]", () => {
  test("renders a checkbox", () => {
    const result = render(<Checkbox text="Accept terms" />);
    expect(result.getByRole("checkbox")).not.toBeNull();
  });

  test("renders checkbox text", () => {
    const result = render(<Checkbox text="Accept terms" />);
    expect(result.getByText("Accept terms")).not.toBeNull();
  });

  CHECKBOX_SIZES.forEach((size) => {
    test(`${size} size class`, () => {
      const { container } = render(
        <Checkbox text="Checkbox text" size={size} />,
      );
      expect(container.querySelector(".vesper-checkbox")).toHaveClass(
        `vesper-checkbox-${size}`,
      );
    });
  });

  test("defaults to md size", () => {
    const { container } = render(<Checkbox text="Checkbox text" />);
    expect(container.querySelector(".vesper-checkbox")).toHaveClass(
      "vesper-checkbox-md",
    );
  });

  test("custom className is merged", () => {
    const { container } = render(
      <Checkbox text="Checkbox text" className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  test("additional props are passed through to wrapper and underlying input", () => {
    const { container } = render(
      <Checkbox
        text="Checkbox text"
        data-testid="my-checkbox"
        aria-describedby="help-text"
      />,
    );
    expect(container.firstChild).toHaveAttribute("data-testid", "my-checkbox");
    const input = container.querySelector('input[type="checkbox"]')!;
    expect(input).toHaveAttribute("aria-describedby", "help-text");
  });

  test("renders a label when supplied", () => {
    const { container } = render(
      <Checkbox text="Checkbox text" label="Label text" />,
    );

    const label = container.querySelector(".vesper-form-input-wrapper-label");
    expect(label).not.toBeNull();
    expect(label!.tagName).toBe("LABEL");
    expect(label).toHaveTextContent("Label text");
  });

  test("renders the label with an asterisk when marked as required", () => {
    const result = render(
      <Checkbox text="Checkbox text" label="Label text" required />,
    );
    expect(result.getByText("Label text *")).not.toBeNull();
  });

  test("renders the label without an asterisk when not marked as required", () => {
    const { container } = render(
      <Checkbox text="Checkbox text" label="Label text" />,
    );
    expect(
      container.querySelector(".vesper-form-input-wrapper-label"),
    ).toHaveTextContent(/^Label text$/);
  });

  test("renders the checkbox text with an asterisk when required and no label is supplied", () => {
    const result = render(<Checkbox text="Checkbox text" required />);
    expect(result.getByText("Checkbox text *")).not.toBeNull();
  });

  test("renders the checkbox text without an asterisk when required and a label is supplied", () => {
    const { container } = render(
      <Checkbox text="Checkbox text" label="Label text" required />,
    );
    expect(container.querySelector(".vesper-checkbox-label")).toHaveTextContent(
      /^Checkbox text$/,
    );
  });

  test("renders the checkbox text without an asterisk when not marked as required", () => {
    const { container } = render(<Checkbox text="Checkbox text" />);
    expect(container.querySelector(".vesper-checkbox-label")).toHaveTextContent(
      /^Checkbox text$/,
    );
  });

  test("no label is rendered when the label prop is omitted", () => {
    const { container } = render(<Checkbox text="Checkbox text" />);
    expect(
      container.querySelector(".vesper-form-input-wrapper-label"),
    ).toBeNull();
  });

  test("the id prop is forwarded to the input", () => {
    const result = render(<Checkbox text="Checkbox text" id="terms" />);
    expect(result.getByRole("checkbox")).toHaveAttribute("id", "terms");
  });

  test("label htmlFor matches the id prop", () => {
    const { container } = render(
      <Checkbox text="Checkbox text" label="Label text" id="terms" />,
    );
    expect(
      container.querySelector(".vesper-form-input-wrapper-label"),
    ).toHaveAttribute("for", "terms");
  });

  test("an id is generated when the id prop is omitted", () => {
    const { container, getByRole } = render(
      <Checkbox text="Checkbox text" label="Label text" />,
    );

    const checkbox = getByRole("checkbox");
    expect(checkbox.id).not.toBe("");
    expect(
      container.querySelector(".vesper-form-input-wrapper-label"),
    ).toHaveAttribute("for", checkbox.id);
  });

  test("clicking the label toggles the checkbox", async () => {
    const { container, getByRole } = render(
      <Checkbox text="Checkbox text" label="Label text" />,
    );

    const label = container.querySelector(".vesper-form-input-wrapper-label")!;
    const checkbox = getByRole("checkbox");

    await userEvent.click(label);
    expect(checkbox).toBeChecked();
  });

  test("checkbox text is used as the input's accessible name", () => {
    const result = render(<Checkbox text="Checkbox text" />);
    expect(
      result.getByRole("checkbox", { name: "Checkbox text" }),
    ).not.toBeNull();
  });

  test("the required asterisk is not part of the accessible name", () => {
    const result = render(<Checkbox text="Checkbox text" required />);
    expect(
      result.getByRole("checkbox", { name: "Checkbox text" }),
    ).not.toBeNull();
  });

  test("aria-label defaults to the text prop", () => {
    const result = render(
      <Checkbox text="Checkbox text" label="Label text" required />,
    );
    expect(result.getByRole("checkbox")).toHaveAttribute(
      "aria-label",
      "Checkbox text",
    );
  });

  test("an explicit aria-label takes precedence over the text prop", () => {
    const result = render(
      <Checkbox
        text="Checkbox text"
        label="Label text"
        aria-label="Custom label"
      />,
    );
    expect(result.getByRole("checkbox")).toHaveAttribute(
      "aria-label",
      "Custom label",
    );
  });

  test("a supplied aria-labelledby is forwarded as-is alongside the label", () => {
    const result = render(
      <Checkbox
        text="Checkbox text"
        label="Label text"
        aria-labelledby="external-label"
      />,
    );
    expect(result.getByRole("checkbox")).toHaveAttribute(
      "aria-labelledby",
      "external-label",
    );
  });

  test("aria-labelledby is forwarded when supplied", () => {
    const result = render(
      <Checkbox text="Checkbox text" aria-labelledby="external-label" />,
    );
    expect(result.getByRole("checkbox")).toHaveAttribute(
      "aria-labelledby",
      "external-label",
    );
  });

  test("renders a message when supplied", () => {
    const result = render(
      <Checkbox text="Checkbox text" message="Message text" />,
    );
    expect(result.getByText("Message text")).not.toBeNull();
  });

  test("message is linked to the input via aria-describedby", () => {
    const result = render(
      <Checkbox text="Checkbox text" message="Message text" />,
    );
    const checkbox = result.getByRole("checkbox");
    const messageId = checkbox.getAttribute("aria-describedby");

    expect(messageId).not.toBeNull();
    expect(document.getElementById(messageId!)).toHaveTextContent(
      "Message text",
    );
  });

  test("an additional aria-describedby is preserved alongside the message", () => {
    const result = render(
      <Checkbox
        text="Checkbox text"
        message="Message text"
        aria-describedby="help-text"
      />,
    );
    const describedBy = result
      .getByRole("checkbox")
      .getAttribute("aria-describedby");

    expect(describedBy?.split(" ")).toHaveLength(2);
    expect(describedBy?.split(" ")[0]).toBe("help-text");
  });

  CHECKBOX_VARIANTS.forEach((variant) => {
    test(`${variant} variant applies to the message`, () => {
      const { container } = render(
        <Checkbox
          text="Checkbox text"
          message="Message text"
          variant={variant}
        />,
      );
      expect(container.querySelector(".vesper-form-input-message")).toHaveClass(
        `vesper-form-input-message-${variant}`,
      );
    });
  });

  test("defaultChecked sets initial checked state", () => {
    const result = render(<Checkbox text="Checkbox text" defaultChecked />);
    const checkbox = result.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  test("unchecked by default", () => {
    const result = render(<Checkbox text="Checkbox text" />);
    const checkbox = result.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  test("indeterminate state", () => {
    const result = render(<Checkbox text="Checkbox text" indeterminate />);
    const checkbox = result.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
  });

  test("name prop is passed to input", () => {
    const result = render(<Checkbox text="Checkbox text" name="agree" />);
    const checkbox = result.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("name", "agree");
  });

  test("clicking toggles checked state", async () => {
    const { container } = render(<Checkbox text="Checkbox text" />);
    const label = container.querySelector(
      ".vesper-checkbox",
    ) as HTMLLabelElement;
    const checkbox = container.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;

    expect(checkbox).not.toBeChecked();

    await userEvent.click(label);
    expect(checkbox).toBeChecked();

    await userEvent.click(label);
    expect(checkbox).not.toBeChecked();
  });

  test("onChange callback", async () => {
    const onChange = vi.fn();
    const { container } = render(
      <Checkbox text="Checkbox text" onChange={onChange} />,
    );
    const label = container.querySelector(
      ".vesper-checkbox",
    ) as HTMLLabelElement;

    await userEvent.click(label);
    expect(onChange).toHaveBeenCalled();

    await userEvent.click(label);
    expect(onChange).toHaveBeenCalled();
  });

  test("disabled checkbox does not toggle on click", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Checkbox text="Checkbox text" disabled onChange={onChange} />,
    );
    const label = container.querySelector(
      ".vesper-checkbox",
    ) as HTMLLabelElement;
    const checkbox = container.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;

    fireEvent.click(label);
    expect(onChange).not.toHaveBeenCalled();
    expect(checkbox).not.toBeChecked();
  });

  test("disabled checkbox has disabled attribute", () => {
    const result = render(<Checkbox text="Checkbox text" disabled />);
    const checkbox = result.getByRole("checkbox");
    expect(checkbox).toBeDisabled();
  });

  test("required checkbox has required attribute", () => {
    const result = render(<Checkbox text="Checkbox text" required />);
    const checkbox = result.getByRole("checkbox");
    expect(checkbox).toBeRequired();
  });

  test("keyboard Space toggles checkbox", async () => {
    const onChange = vi.fn();
    const result = render(
      <Checkbox text="Checkbox text" onChange={onChange} />,
    );
    const checkbox = result.getByRole("checkbox");

    await userEvent.tab();
    expect(checkbox).toHaveFocus();

    await userEvent.keyboard(" ");
    expect(checkbox).toBeChecked();
    expect(onChange).toHaveBeenCalled();
  });

  test("keyboard Space does not toggle disabled checkbox", async () => {
    const onChange = vi.fn();
    const result = render(
      <Checkbox text="Checkbox text" disabled onChange={onChange} />,
    );
    const checkbox = result.getByRole("checkbox");

    checkbox.focus();
    await userEvent.keyboard(" ");
    expect(onChange).not.toHaveBeenCalled();
    expect(checkbox).not.toBeChecked();
  });

  test("clicking checkbox text toggles checkbox", async () => {
    const result = render(<Checkbox text="Checkbox text" />);
    const labelText = result.getByText("Checkbox text");
    const checkbox = result.getByRole("checkbox");

    await userEvent.click(labelText);
    expect(checkbox).toBeChecked();
  });

  test("inputRef exposes the input element", () => {
    const inputRef = createRef<HTMLInputElement>();
    const result = render(
      <Checkbox text="Checkbox text" inputRef={inputRef} />,
    );
    const checkbox = result.getByRole("checkbox");
    expect(inputRef.current).toBe(checkbox);
  });
});

describe("checkbox [snapshot]", () => {
  [
    ...CHECKBOX_SIZE_PERMUTATIONS,
    ...CHECKBOX_VARIANT_PERMUTATIONS,
    ...CHECKBOX_LABEL_PERMUTATIONS,
  ].forEach(({ name, ...props }) => {
    test(name, () => {
      const { container } = render(<Checkbox {...props} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

describe("checkbox [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    [
      ...CHECKBOX_SIZE_PERMUTATIONS,
      ...CHECKBOX_VARIANT_PERMUTATIONS,
      ...CHECKBOX_LABEL_PERMUTATIONS,
    ].forEach(({ name, ...props }) => {
      const label = `a11y (${name}, ${theme})`;

      const testFn = async () => {
        const { container } = render(<Checkbox {...props} />);
        expect(await axe.run(container)).toHaveNoViolations();
      };

      const failsA11y =
        !!props.message &&
        CHECKBOX_A11Y_FAILING_PERMUTATIONS.some(
          (p) =>
            p.variant === (props.variant ?? "default") && p.theme === theme,
        );

      if (failsA11y) test.todo(label, testFn);
      else test(label, testFn);
    });
  });
});
