import { createRef } from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import axe from "axe-core";

import {
  Checkbox,
  CHECKBOX_SIZES,
  type CheckboxProps,
} from "@/components/checkbox/checkbox";

import "@/styles/test.css";

const CHECKBOX_PERMUTATIONS = [true, false].flatMap((checked) =>
  [true, false].flatMap((indeterminate) =>
    CHECKBOX_SIZES.flatMap((size): (CheckboxProps & { name: string })[] => [
      {
        name: `${size}, checked: ${checked}, indeterminate: ${indeterminate}`,
        size,
        label: "Label text",
        disabled: false,
        required: false,
        defaultChecked: checked,
        indeterminate,
      },
      {
        name: `${size}, required, disabled, checked: ${checked}, indeterminate: ${indeterminate}`,
        size,
        label: "Label text",
        disabled: true,
        required: true,
        defaultChecked: checked,
        indeterminate,
      },
      {
        name: `${size}, disabled, checked: ${checked}, indeterminate: ${indeterminate}`,
        size,
        label: "Label text",
        disabled: true,
        required: false,
        defaultChecked: checked,
        indeterminate,
      },
      {
        name: `${size}, required, checked: ${checked}, indeterminate: ${indeterminate}`,
        size,
        label: "Label text",
        disabled: false,
        required: true,
        defaultChecked: checked,
        indeterminate,
      },
    ]),
  ),
);

afterEach(cleanup);

describe("checkbox [unit]", () => {
  test("renders a checkbox", () => {
    const result = render(<Checkbox label="Accept terms" />);
    expect(result.getByRole("checkbox")).not.toBeNull();
  });

  test("renders label text", () => {
    const result = render(<Checkbox label="Accept terms" />);
    expect(result.getByText("Accept terms")).not.toBeNull();
  });

  test("required appends asterisk to label", () => {
    const result = render(<Checkbox label="Accept terms" required />);
    expect(result.getByText("Accept terms *")).not.toBeNull();
  });

  CHECKBOX_SIZES.forEach((size) => {
    test(`${size} size class`, () => {
      const { container } = render(<Checkbox label="Label" size={size} />);
      expect(container.firstChild).toHaveClass(`vesper-checkbox-${size}`);
    });
  });

  test("defaults to md size", () => {
    const { container } = render(<Checkbox label="Label" />);
    expect(container.firstChild).toHaveClass("vesper-checkbox-md");
  });

  test("custom className is merged", () => {
    const { container } = render(
      <Checkbox label="Label" className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass("vesper-checkbox");
    expect(container.firstChild).toHaveClass("vesper-checkbox-md");
    expect(container.firstChild).toHaveClass("custom-class");
  });

  test("additional props are passed through to label", () => {
    const { container } = render(
      <Checkbox
        label="Label"
        data-testid="my-checkbox"
        aria-describedby="help-text"
      />,
    );
    expect(container.firstChild).toHaveAttribute("data-testid", "my-checkbox");
    const input = container.querySelector('input[type="checkbox"]')!;
    expect(input).toHaveAttribute("aria-describedby", "help-text");
  });

  test("defaultChecked sets initial checked state", () => {
    const result = render(<Checkbox label="Label" defaultChecked />);
    const checkbox = result.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  test("unchecked by default", () => {
    const result = render(<Checkbox label="Label" />);
    const checkbox = result.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  test("indeterminate state", () => {
    const result = render(<Checkbox label="Label" indeterminate />);
    const checkbox = result.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
  });

  test("name prop is passed to input", () => {
    const result = render(<Checkbox label="Label" name="agree" />);
    const checkbox = result.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("name", "agree");
  });

  test("clicking toggles checked state", async () => {
    const { container } = render(<Checkbox label="Label" />);
    const label = container.firstChild as HTMLLabelElement;
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
      <Checkbox label="Label" onChange={onChange} />,
    );
    const label = container.firstChild as HTMLLabelElement;

    await userEvent.click(label);
    expect(onChange).toHaveBeenCalled();

    await userEvent.click(label);
    expect(onChange).toHaveBeenCalled();
  });

  test("disabled class applied when disabled", () => {
    const { container } = render(<Checkbox label="Label" disabled />);
    expect(container.firstChild).toHaveClass("vesper-checkbox-disabled");
  });

  test("disabled class not applied when not disabled", () => {
    const { container } = render(<Checkbox label="Label" />);
    expect(container.firstChild).not.toHaveClass("vesper-checkbox-disabled");
  });

  test("disabled checkbox does not toggle on click", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Checkbox label="Label" disabled onChange={onChange} />,
    );
    const label = container.firstChild as HTMLLabelElement;
    const checkbox = container.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;

    fireEvent.click(label);
    expect(onChange).not.toHaveBeenCalled();
    expect(checkbox).not.toBeChecked();
  });

  test("disabled checkbox has disabled attribute", () => {
    const result = render(<Checkbox label="Label" disabled />);
    const checkbox = result.getByRole("checkbox");
    expect(checkbox).toBeDisabled();
  });

  test("required checkbox has required attribute", () => {
    const result = render(<Checkbox label="Label" required />);
    const checkbox = result.getByRole("checkbox");
    expect(checkbox).toBeRequired();
  });

  test("keyboard Space toggles checkbox", async () => {
    const onChange = vi.fn();
    const result = render(<Checkbox label="Label" onChange={onChange} />);
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
      <Checkbox label="Label" disabled onChange={onChange} />,
    );
    const checkbox = result.getByRole("checkbox");

    checkbox.focus();
    await userEvent.keyboard(" ");
    expect(onChange).not.toHaveBeenCalled();
    expect(checkbox).not.toBeChecked();
  });

  test("clicking label text toggles checkbox", async () => {
    const result = render(<Checkbox label="Label" />);
    const labelText = result.getByText("Label");
    const checkbox = result.getByRole("checkbox");

    await userEvent.click(labelText);
    expect(checkbox).toBeChecked();
  });

  test("inputRef exposes the input element", () => {
    const inputRef = createRef<HTMLInputElement>();
    const result = render(<Checkbox label="Label" inputRef={inputRef} />);
    const checkbox = result.getByRole("checkbox");
    expect(inputRef.current).toBe(checkbox);
  });
});

describe("checkbox [snapshot]", () => {
  CHECKBOX_PERMUTATIONS.forEach(({ name, ...props }) => {
    test(name, () => {
      const { container } = render(<Checkbox {...props} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

const CHECKBOX_A11Y_FAILING_PERMUTATIONS: {
  disabled: boolean;
  theme: string;
}[] = [{ disabled: false, theme: "dark" }];

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

    CHECKBOX_PERMUTATIONS.forEach(({ name, ...props }) => {
      const label = `a11y (${name}, ${theme})`;

      const testFn = async () => {
        const { container } = render(<Checkbox {...props} />);
        expect(await axe.run(container)).toHaveNoViolations();
      };

      const failsA11y = CHECKBOX_A11Y_FAILING_PERMUTATIONS.some(
        (p) => p.disabled === props.disabled && p.theme === theme,
      );

      if (failsA11y) test.todo(label, testFn);
      else test(label, testFn);
    });
  });
});
