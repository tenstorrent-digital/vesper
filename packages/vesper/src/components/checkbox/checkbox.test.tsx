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

const CHECKBOX_PERMUTATIONS = [true, false, "indeterminate" as const].flatMap(
  (checked) =>
    CHECKBOX_SIZES.flatMap((size): (CheckboxProps & { name: string })[] => [
      {
        name: `${size}, checked: ${checked}`,
        size,
        label: "Label text",
        disabled: false,
        required: false,
        checked,
      },
      {
        name: `${size}, required, disabled, checked: ${checked}`,
        size,
        label: "Label text",
        disabled: true,
        required: true,
        checked,
      },
      {
        name: `${size}, disabled, checked: ${checked}`,
        size,
        label: "Label text",
        disabled: true,
        required: false,
        checked,
      },
      {
        name: `${size}, required, checked: ${checked}`,
        size,
        label: "Label text",
        disabled: false,
        required: true,
        checked,
      },
    ]),
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

  test("additional props are passed through", () => {
    const result = render(
      <Checkbox
        label="Label"
        data-testid="my-checkbox"
        aria-describedby="help-text"
      />,
    );
    const checkbox = result.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("data-testid", "my-checkbox");
    expect(checkbox).toHaveAttribute("aria-describedby", "help-text");
  });

  test("defaultChecked sets initial checked state", () => {
    const result = render(<Checkbox label="Label" defaultChecked />);
    const checkbox = result.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("data-state", "checked");
  });

  test("unchecked by default", () => {
    const result = render(<Checkbox label="Label" />);
    const checkbox = result.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("data-state", "unchecked");
  });

  test("indeterminate state", () => {
    const result = render(
      <Checkbox label="Label" defaultChecked="indeterminate" />,
    );
    const checkbox = result.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("data-state", "indeterminate");
  });

  test("clicking toggles checked state", async () => {
    const result = render(<Checkbox label="Label" />);
    const checkbox = result.getByRole("checkbox");

    expect(checkbox).toHaveAttribute("data-state", "unchecked");

    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("data-state", "checked");

    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("data-state", "unchecked");
  });

  test("onCheckedChange callback", async () => {
    const onCheckedChange = vi.fn();
    const result = render(
      <Checkbox label="Label" onCheckedChange={onCheckedChange} />,
    );
    const checkbox = result.getByRole("checkbox");

    await userEvent.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    await userEvent.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  test("disabled class applied when disabled", () => {
    const { container } = render(<Checkbox label="Label" disabled />);
    expect(container.firstChild).toHaveClass("vesper-checkbox-disabled");
  });

  test("disabled class not applied when not disabled", () => {
    const { container } = render(<Checkbox label="Label" />);
    expect(container.firstChild).not.toHaveClass("vesper-checkbox-disabled");
  });

  test("disabled checkbox doesn't toggle on click", () => {
    const onCheckedChange = vi.fn();
    const result = render(
      <Checkbox label="Label" disabled onCheckedChange={onCheckedChange} />,
    );
    const checkbox = result.getByRole("checkbox");

    fireEvent.click(checkbox);
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(checkbox).toHaveAttribute("data-state", "unchecked");
  });

  test("keyboard Space toggles checkbox", async () => {
    const onCheckedChange = vi.fn();
    const result = render(
      <Checkbox label="Label" onCheckedChange={onCheckedChange} />,
    );
    const checkbox = result.getByRole("checkbox");

    await userEvent.tab();
    expect(checkbox).toHaveFocus();

    await userEvent.keyboard(" ");
    expect(checkbox).toHaveAttribute("data-state", "checked");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  test("keyboard Space doesn't toggle when disabled", async () => {
    const onCheckedChange = vi.fn();
    const result = render(
      <Checkbox label="Label" disabled onCheckedChange={onCheckedChange} />,
    );
    const checkbox = result.getByRole("checkbox");

    checkbox.focus();
    await userEvent.keyboard(" ");
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(checkbox).toHaveAttribute("data-state", "unchecked");
  });

  test("clicking label toggles checkbox", async () => {
    const result = render(<Checkbox label="Label" />);
    const label = result.getByText("Label");
    const checkbox = result.getByRole("checkbox");

    await userEvent.click(label);
    expect(checkbox).toHaveAttribute("data-state", "checked");
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
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    CHECKBOX_PERMUTATIONS.forEach(({ name, ...props }) => {
      test(`wcag2aaa (${name}, ${theme})`, async () => {
        const { container } = render(<Checkbox {...props} />);
        expect(
          await axe.run(container, { runOnly: "wcag2aaa" }),
        ).toHaveNoViolations();
      });
    });
  });
});
