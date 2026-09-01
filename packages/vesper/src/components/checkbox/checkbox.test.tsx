import { createRef } from "react";
import { cleanup, fireEvent, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

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

  test("renders the checkbox text with an asterisk when required", () => {
    const result = render(<Checkbox text="Checkbox text" required />);
    expect(result.getByText("Checkbox text *")).not.toBeNull();
  });

  test("the accessible text does not contain an asterisk when the checkbox is required", () => {
    const result = render(<Checkbox text="Checkbox text" required />);
    expect(result.getByText("Checkbox text *")).not.toBeNull();
    expect(result.getByLabelText(/^Checkbox text$/)).not.toBeNull();
  });

  test("renders the checkbox text without an asterisk when not required", () => {
    const { container } = render(<Checkbox text="Checkbox text" />);
    expect(container.querySelector(".vesper-checkbox-label")).toHaveTextContent(
      /^Checkbox text$/,
    );
  });

  test("the id prop is forwarded to the input", () => {
    const result = render(<Checkbox text="Checkbox text" id="terms" />);
    expect(result.getByRole("checkbox")).toHaveAttribute("id", "terms");
  });

  test("checkbox text is used as the input's accessible name", () => {
    const result = render(<Checkbox text="Checkbox text" />);
    expect(
      result.getByRole("checkbox", { name: "Checkbox text" }),
    ).not.toBeNull();
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

  test("ref exposes the input element", () => {
    const ref = createRef<HTMLInputElement>();
    const result = render(<Checkbox text="Checkbox text" ref={ref} />);
    const checkbox = result.getByRole("checkbox");
    expect(ref.current).toBe(checkbox);
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
      test(`a11y (${name}, ${theme})`, async () => {
        const { container } = render(<Checkbox {...props} />);
        expect(await axe.run(container)).toHaveNoViolations();
      });
    });
  });
});
