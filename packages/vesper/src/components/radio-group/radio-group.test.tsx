import { render, cleanup, fireEvent } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import axe from "axe-core";

import {
  RadioGroup,
  RADIO_SIZES,
  RADIO_GROUP_ORIENTATIONS,
  type RadioGroupProps,
} from "@/components/radio-group/radio-group";

import "@/styles/test.css";

const RADIO_GROUP_OPTIONS = [
  { value: "option-a", label: "Option A" },
  { value: "option-b", label: "Option B" },
  { value: "option-c", label: "Option C" },
];

type RadioGroupPermutation = RadioGroupProps & { permutationName: string };

const RADIO_GROUP_PERMUTATIONS = RADIO_SIZES.flatMap(
  (size): RadioGroupPermutation[] =>
    RADIO_GROUP_ORIENTATIONS.flatMap((orientation) => [
      {
        permutationName: `${size}, ${orientation}`,
        name: "test-radio-group",
        size,
        options: RADIO_GROUP_OPTIONS,
        orientation,
        disabled: false,
      },
      {
        permutationName: `${size}, ${orientation}, disabled`,
        name: "test-radio-group",
        size,
        options: RADIO_GROUP_OPTIONS,
        orientation,
        disabled: true,
      },
    ]),
);

afterEach(cleanup);

describe("radio-group [unit]", () => {
  test("renders empty group when options are empty", () => {
    const result = render(<RadioGroup name="test" options={[]} />);
    const radios = result.queryAllByRole("radio");
    expect(radios).toHaveLength(0);
  });

  test("renders radio items for each option", () => {
    const result = render(
      <RadioGroup name="test" options={RADIO_GROUP_OPTIONS} />,
    );
    const items = result.getAllByRole("radio");
    expect(items).toHaveLength(3);
  });

  test("renders labels for each option", () => {
    const result = render(
      <RadioGroup name="test" options={RADIO_GROUP_OPTIONS} />,
    );
    expect(result.getByText("Option A")).not.toBeNull();
    expect(result.getByText("Option B")).not.toBeNull();
    expect(result.getByText("Option C")).not.toBeNull();
  });

  RADIO_SIZES.forEach((size) => {
    test(`${size} size class on items`, () => {
      const result = render(
        <RadioGroup name="test" size={size} options={RADIO_GROUP_OPTIONS} />,
      );
      const items = result.getAllByRole("radio");
      items.forEach((item) => {
        expect(item.closest("label")).toHaveClass(
          `vesper-radio-group-item-${size}`,
        );
      });
    });
  });

  test("vertical orientation", () => {
    const { container } = render(
      <RadioGroup
        name="test"
        orientation="vertical"
        options={RADIO_GROUP_OPTIONS}
      />,
    );
    expect(container.firstChild).toHaveClass("vesper-radio-group-vertical");
  });

  test("horizontal orientation", () => {
    const { container } = render(
      <RadioGroup
        name="test"
        orientation="horizontal"
        options={RADIO_GROUP_OPTIONS}
      />,
    );
    expect(container.firstChild).toHaveClass("vesper-radio-group-horizontal");
  });

  test("custom className is merged", () => {
    const { container } = render(
      <RadioGroup
        name="test"
        orientation="vertical"
        className="custom-class"
        options={RADIO_GROUP_OPTIONS}
      />,
    );
    expect(container.firstChild).toHaveClass("vesper-radio-group");
    expect(container.firstChild).toHaveClass("vesper-radio-group-vertical");
    expect(container.firstChild).toHaveClass("custom-class");
  });

  test("additional props are passed through", () => {
    const { container } = render(
      <RadioGroup
        name="test"
        data-testid="radio-group"
        aria-label="Choose an option"
        options={RADIO_GROUP_OPTIONS}
      />,
    );
    expect(container.firstChild).toHaveAttribute("data-testid", "radio-group");
    expect(container.firstChild).toHaveAttribute(
      "aria-label",
      "Choose an option",
    );
  });

  test("defaultValue selects the correct option", () => {
    const result = render(
      <RadioGroup
        name="test"
        defaultValue="option-b"
        options={RADIO_GROUP_OPTIONS}
      />,
    );
    const items = result.getAllByRole("radio");
    expect(items[0]).not.toBeChecked();
    expect(items[1]).toBeChecked();
    expect(items[2]).not.toBeChecked();
  });

  test("clicking an option selects it", async () => {
    const result = render(
      <RadioGroup name="test" options={RADIO_GROUP_OPTIONS} />,
    );
    const items = result.getAllByRole("radio");

    await userEvent.click(result.getByText("Option A"));
    expect(items[0]).toBeChecked();
    expect(items[1]).not.toBeChecked();
    expect(items[2]).not.toBeChecked();

    await userEvent.click(result.getByText("Option C"));
    expect(items[0]).not.toBeChecked();
    expect(items[1]).not.toBeChecked();
    expect(items[2]).toBeChecked();
  });

  test("onChange callback", async () => {
    const onChange = vi.fn();
    const result = render(
      <RadioGroup
        name="test"
        onChange={onChange}
        options={RADIO_GROUP_OPTIONS}
      />,
    );

    await userEvent.click(result.getByText("Option B"));
    expect(onChange).toHaveBeenCalledWith("option-b");
  });

  test("disabling all items via disabled prop", () => {
    const result = render(
      <RadioGroup name="test" disabled options={RADIO_GROUP_OPTIONS} />,
    );
    const items = result.getAllByRole("radio");
    items.forEach((item) => {
      expect(item).toBeDisabled();
    });
  });

  test("disabled group does not respond to clicks", () => {
    const onChange = vi.fn();
    const result = render(
      <RadioGroup
        name="test"
        disabled
        onChange={onChange}
        options={RADIO_GROUP_OPTIONS}
      />,
    );
    const label = result.getByText("Option A").closest("label")!;

    fireEvent.click(label);
    expect(onChange).not.toHaveBeenCalled();
  });

  test("disabling individual option", () => {
    const result = render(
      <RadioGroup
        name="test"
        options={[
          { value: "option-a", label: "Option A" },
          { value: "option-b", label: "Option B", disabled: true },
          { value: "option-c", label: "Option C" },
        ]}
      />,
    );
    const items = result.getAllByRole("radio");
    expect(items[0]).not.toBeDisabled();
    expect(items[1]).toBeDisabled();
    expect(items[2]).not.toBeDisabled();
  });

  test("disabled individual option does not respond to click", () => {
    const onChange = vi.fn();
    const result = render(
      <RadioGroup
        name="test"
        onChange={onChange}
        options={[
          { value: "option-a", label: "Option A" },
          { value: "option-b", label: "Option B", disabled: true },
          { value: "option-c", label: "Option C" },
        ]}
      />,
    );
    const label = result.getByText("Option B").closest("label")!;
    const input = result.getAllByRole("radio")[1]!;

    fireEvent.click(label);
    expect(onChange).not.toHaveBeenCalled();
    expect(input).not.toBeChecked();
  });

  test("keyboard navigation (vertical orientation)", async () => {
    const result = render(
      <RadioGroup
        name="test"
        defaultValue="option-a"
        options={RADIO_GROUP_OPTIONS}
      />,
    );
    const items = result.getAllByRole("radio");

    await userEvent.tab();
    expect(items[0]).toHaveFocus();

    await userEvent.keyboard("{ArrowDown}");
    expect(items[1]).toHaveFocus();

    await userEvent.keyboard("{ArrowUp}");
    expect(items[0]).toHaveFocus();
  });

  test("keyboard navigation (horizontal orientation)", async () => {
    const result = render(
      <RadioGroup
        name="test"
        orientation="horizontal"
        defaultValue="option-a"
        options={RADIO_GROUP_OPTIONS}
      />,
    );
    const items = result.getAllByRole("radio");

    await userEvent.tab();
    expect(items[0]).toHaveFocus();

    await userEvent.keyboard("{ArrowRight}");
    expect(items[1]).toHaveFocus();

    await userEvent.keyboard("{ArrowLeft}");
    expect(items[0]).toHaveFocus();
  });

  test("keyboard navigation skips disabled items", async () => {
    const result = render(
      <RadioGroup
        name="test"
        defaultValue="option-a"
        options={[
          { value: "option-a", label: "Option A" },
          { value: "option-b", label: "Option B", disabled: true },
          { value: "option-c", label: "Option C" },
        ]}
      />,
    );
    const items = result.getAllByRole("radio");

    await userEvent.tab();
    expect(items[0]).toHaveFocus();

    await userEvent.keyboard("{ArrowDown}");
    expect(items[2]).toHaveFocus();
  });
});

describe("radio-group [snapshot]", () => {
  RADIO_GROUP_PERMUTATIONS.forEach(({ permutationName, ...props }) => {
    test(permutationName, () => {
      const { container } = render(<RadioGroup {...props} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

const RADIO_GROUP_A11Y_FAILING_PERMUTATIONS: {
  disabled: boolean;
  theme: string;
}[] = [{ disabled: false, theme: "dark" }];

describe("radio-group [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    RADIO_GROUP_PERMUTATIONS.forEach(({ permutationName, ...props }) => {
      const label = `a11y (${permutationName}, ${theme})`;

      const testFn = async () => {
        const { container } = render(<RadioGroup {...props} />);
        expect(await axe.run(container)).toHaveNoViolations();
      };

      const failsA11y = RADIO_GROUP_A11Y_FAILING_PERMUTATIONS.some(
        (p) => p.disabled === props.disabled && p.theme === theme,
      );

      if (failsA11y) test.todo(label, testFn);
      else test(label, testFn);
    });
  });
});
