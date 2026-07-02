import { render, cleanup, fireEvent } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import axe from "axe-core";

import {
  Choicebox,
  type ChoiceboxProps,
  type ChoiceboxItem,
} from "@/components/choicebox/choicebox";

import "@/styles/test.css";

const CHOICEBOX_OPTIONS: ChoiceboxItem[] = [
  { value: "option-a", label: "Option A" },
  { value: "option-b", label: "Option B" },
  { value: "option-c", label: "Option C" },
];

const CHOICEBOX_OPTIONS_WITH_DESCRIPTIONS: ChoiceboxItem[] = [
  {
    value: "option-a",
    label: "Option A",
    description: "Description for option A",
  },
  {
    value: "option-b",
    label: "Option B",
    description: "Description for option B",
  },
  {
    value: "option-c",
    label: "Option C",
    description: "Description for option C",
  },
];

type ChoiceboxPermutation = ChoiceboxProps & { permutationName: string };

const CHOICEBOX_PASSING_A11Y_PERMUTATIONS: ChoiceboxPermutation[] = [
  {
    permutationName: "single-select",
    name: "test-choicebox",
    options: CHOICEBOX_OPTIONS,
  },
  {
    permutationName: "single-select, disabled",
    name: "test-choicebox",
    options: CHOICEBOX_OPTIONS,
    disabled: true,
  },
  {
    permutationName: "single-select, with descriptions, disabled",
    name: "test-choicebox",
    options: CHOICEBOX_OPTIONS_WITH_DESCRIPTIONS,
    disabled: true,
  },
  {
    permutationName: "multi-select",
    name: "test-choicebox",
    multiselect: true,
    options: CHOICEBOX_OPTIONS,
  },
  {
    permutationName: "multi-select, disabled",
    name: "test-choicebox",
    multiselect: true,
    options: CHOICEBOX_OPTIONS,
    disabled: true,
  },
  {
    permutationName: "multi-select, with descriptions, disabled",
    name: "test-choicebox",
    multiselect: true,
    options: CHOICEBOX_OPTIONS_WITH_DESCRIPTIONS,
    disabled: true,
  },
];

const CHOICEBOX_FAILING_A11Y_PERMUTATIONS: ChoiceboxPermutation[] = [
  {
    permutationName: "single-select, with descriptions",
    name: "test-choicebox",
    options: CHOICEBOX_OPTIONS_WITH_DESCRIPTIONS,
  },
  {
    permutationName: "multi-select, with descriptions",
    name: "test-choicebox",
    multiselect: true,
    options: CHOICEBOX_OPTIONS_WITH_DESCRIPTIONS,
  },
];

afterEach(cleanup);

describe("choicebox [unit]", () => {
  describe.each([
    { variant: "single-select", multiselect: false as const },
    { variant: "multi-select", multiselect: true as const },
  ])("common ($variant)", ({ multiselect }) => {
    const inputRole = multiselect ? "checkbox" : "radio";

    test("renders a fieldset", () => {
      const { container } = render(
        <Choicebox
          name="test"
          multiselect={multiselect}
          options={CHOICEBOX_OPTIONS}
        />,
      );
      expect(container.firstElementChild?.tagName).toBe("FIELDSET");
    });

    test("renders an input for each option", () => {
      const result = render(
        <Choicebox
          name="test"
          multiselect={multiselect}
          options={CHOICEBOX_OPTIONS}
        />,
      );
      const items = result.getAllByRole(inputRole);
      expect(items).toHaveLength(3);
    });

    test("renders empty group when options are empty", () => {
      const result = render(
        <Choicebox name="test" multiselect={multiselect} options={[]} />,
      );
      expect(result.queryAllByRole(inputRole)).toHaveLength(0);
    });

    test("renders labels for each option", () => {
      const result = render(
        <Choicebox
          name="test"
          multiselect={multiselect}
          options={CHOICEBOX_OPTIONS}
        />,
      );
      expect(result.getByText("Option A")).not.toBeNull();
      expect(result.getByText("Option B")).not.toBeNull();
      expect(result.getByText("Option C")).not.toBeNull();
    });

    test("renders descriptions when provided", () => {
      const result = render(
        <Choicebox
          name="test"
          multiselect={multiselect}
          options={CHOICEBOX_OPTIONS_WITH_DESCRIPTIONS}
        />,
      );
      expect(result.getByText("Description for option A")).not.toBeNull();
      expect(result.getByText("Description for option B")).not.toBeNull();
      expect(result.getByText("Description for option C")).not.toBeNull();
    });

    test("compact class applied when no description", () => {
      const { container } = render(
        <Choicebox
          name="test"
          multiselect={multiselect}
          options={CHOICEBOX_OPTIONS}
        />,
      );
      const labels = container.querySelectorAll("label");
      labels.forEach((label) => {
        expect(label).toHaveClass("vesper-choicebox-item-compact");
      });
    });

    test("compact class not applied when description is present", () => {
      const { container } = render(
        <Choicebox
          name="test"
          multiselect={multiselect}
          options={CHOICEBOX_OPTIONS_WITH_DESCRIPTIONS}
        />,
      );
      const labels = container.querySelectorAll("label");
      labels.forEach((label) => {
        expect(label).not.toHaveClass("vesper-choicebox-item-compact");
      });
    });

    test("custom className is merged", () => {
      const { container } = render(
        <Choicebox
          name="test"
          multiselect={multiselect}
          className="custom-class"
          options={CHOICEBOX_OPTIONS}
        />,
      );
      expect(container.firstChild).toHaveClass("vesper-choicebox");
      expect(container.firstChild).toHaveClass("custom-class");
    });

    test("additional props are passed through", () => {
      const { container } = render(
        <Choicebox
          name="test"
          multiselect={multiselect}
          data-testid="choicebox"
          aria-label="Choose an option"
          options={CHOICEBOX_OPTIONS}
        />,
      );
      expect(container.firstChild).toHaveAttribute("data-testid", "choicebox");
      expect(container.firstChild).toHaveAttribute(
        "aria-label",
        "Choose an option",
      );
    });

    test("renders with custom id on option", () => {
      const result = render(
        <Choicebox
          name="test"
          multiselect={multiselect}
          options={[{ value: "option-a", label: "Option A", id: "custom-id" }]}
        />,
      );
      const input = result.getByRole(inputRole);
      expect(input).toHaveAttribute("id", "custom-id");
    });

    test("disabling all items via disabled prop", () => {
      const result = render(
        <Choicebox
          name="test"
          multiselect={multiselect}
          disabled
          options={CHOICEBOX_OPTIONS}
        />,
      );
      const items = result.getAllByRole(inputRole);
      items.forEach((item) => {
        expect(item).toBeDisabled();
      });
    });

    test("disabled group does not respond to clicks", () => {
      const onChange = vi.fn();
      const result = render(
        <Choicebox
          name="test"
          multiselect={multiselect}
          disabled
          onChange={onChange}
          options={CHOICEBOX_OPTIONS}
        />,
      );
      const label = result.getByText("Option A").closest("label")!;

      fireEvent.click(label);
      expect(onChange).not.toHaveBeenCalled();
    });

    test("disabling individual option", () => {
      const result = render(
        <Choicebox
          name="test"
          multiselect={multiselect}
          options={[
            { value: "option-a", label: "Option A" },
            { value: "option-b", label: "Option B", disabled: true },
            { value: "option-c", label: "Option C" },
          ]}
        />,
      );
      const items = result.getAllByRole(inputRole);
      expect(items[0]).not.toBeDisabled();
      expect(items[1]).toBeDisabled();
      expect(items[2]).not.toBeDisabled();
    });

    test("disabled individual option does not respond to click", () => {
      const onChange = vi.fn();
      const result = render(
        <Choicebox
          name="test"
          multiselect={multiselect}
          onChange={onChange}
          options={[
            { value: "option-a", label: "Option A" },
            { value: "option-b", label: "Option B", disabled: true },
            { value: "option-c", label: "Option C" },
          ]}
        />,
      );
      const label = result.getByText("Option B").closest("label")!;
      const input = result.getAllByRole(inputRole)[1]!;

      fireEvent.click(label);
      expect(onChange).not.toHaveBeenCalled();
      expect(input).not.toBeChecked();
    });

    test("keyboard navigation moves focus forward", async () => {
      const result = render(
        <Choicebox
          name="test"
          multiselect={multiselect}
          {...(!multiselect ? { defaultValue: "option-a" } : {})}
          options={CHOICEBOX_OPTIONS}
        />,
      );
      const items = result.getAllByRole(inputRole);

      items[0]!.focus();
      expect(items[0]).toHaveFocus();

      await userEvent.keyboard("{ArrowDown}");
      expect(items[1]).toHaveFocus();

      await userEvent.keyboard("{ArrowRight}");
      expect(items[2]).toHaveFocus();
    });

    test("keyboard navigation moves focus backward", async () => {
      const result = render(
        <Choicebox
          name="test"
          multiselect={multiselect}
          {...(!multiselect ? { defaultValue: "option-c" } : {})}
          options={CHOICEBOX_OPTIONS}
        />,
      );
      const items = result.getAllByRole(inputRole);

      items[2]!.focus();
      expect(items[2]).toHaveFocus();

      await userEvent.keyboard("{ArrowUp}");
      expect(items[1]).toHaveFocus();

      await userEvent.keyboard("{ArrowLeft}");
      expect(items[0]).toHaveFocus();
    });

    test("keyboard navigation wraps around at boundaries", async () => {
      const result = render(
        <Choicebox
          name="test"
          multiselect={multiselect}
          {...(!multiselect ? { defaultValue: "option-c" } : {})}
          options={CHOICEBOX_OPTIONS}
        />,
      );
      const items = result.getAllByRole(inputRole);

      items[2]!.focus();
      await userEvent.keyboard("{ArrowDown}");
      expect(items[0]).toHaveFocus();

      await userEvent.keyboard("{ArrowUp}");
      expect(items[2]).toHaveFocus();
    });

    test("keyboard navigation skips disabled items", async () => {
      const result = render(
        <Choicebox
          name="test"
          multiselect={multiselect}
          {...(!multiselect ? { defaultValue: "option-a" } : {})}
          options={[
            { value: "option-a", label: "Option A" },
            { value: "option-b", label: "Option B", disabled: true },
            { value: "option-c", label: "Option C" },
          ]}
        />,
      );
      const items = result.getAllByRole(inputRole);

      items[0]!.focus();
      expect(items[0]).toHaveFocus();

      await userEvent.keyboard("{ArrowDown}");
      expect(items[2]).toHaveFocus();
    });
  });

  describe("single-select", () => {
    test("all radio inputs share the same name", () => {
      const result = render(
        <Choicebox name="test-group" options={CHOICEBOX_OPTIONS} />,
      );
      const items = result.getAllByRole("radio");
      items.forEach((item) => {
        expect(item).toHaveAttribute("name", "test-group");
      });
    });

    test("defaultValue selects the correct option", () => {
      const result = render(
        <Choicebox
          name="test"
          defaultValue="option-b"
          options={CHOICEBOX_OPTIONS}
        />,
      );
      const items = result.getAllByRole("radio");
      expect(items[0]).not.toBeChecked();
      expect(items[1]).toBeChecked();
      expect(items[2]).not.toBeChecked();
    });

    test("controlled value selects the correct option", () => {
      const result = render(
        <Choicebox name="test" value="option-c" options={CHOICEBOX_OPTIONS} />,
      );
      const items = result.getAllByRole("radio");
      expect(items[0]).not.toBeChecked();
      expect(items[1]).not.toBeChecked();
      expect(items[2]).toBeChecked();
    });

    test("clicking an option selects it", async () => {
      const result = render(
        <Choicebox name="test" options={CHOICEBOX_OPTIONS} />,
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

    test("only one option can be selected at a time", async () => {
      const result = render(
        <Choicebox name="test" options={CHOICEBOX_OPTIONS} />,
      );
      const items = result.getAllByRole("radio");

      await userEvent.click(result.getByText("Option A"));
      await userEvent.click(result.getByText("Option B"));

      expect(items[0]).not.toBeChecked();
      expect(items[1]).toBeChecked();
      expect(items[2]).not.toBeChecked();
    });

    test("onChange callback fires with selected value", async () => {
      const onChange = vi.fn();
      const result = render(
        <Choicebox
          name="test"
          onChange={onChange}
          options={CHOICEBOX_OPTIONS}
        />,
      );

      await userEvent.click(result.getByText("Option B"));
      expect(onChange).toHaveBeenCalledWith("option-b");
    });

    test("required attribute is set on inputs", () => {
      const result = render(
        <Choicebox name="test" required options={CHOICEBOX_OPTIONS} />,
      );
      const items = result.getAllByRole("radio");
      items.forEach((item) => {
        expect(item).toBeRequired();
      });
    });

    test("renders radio indicator)", () => {
      const { container } = render(
        <Choicebox name="test" options={CHOICEBOX_OPTIONS} />,
      );
      const indicators = container.querySelectorAll(
        ".vesper-choicebox-input-single-indicator",
      );
      expect(indicators).toHaveLength(3);
      expect(
        container.querySelectorAll(".vesper-choicebox-input-multi-indicator"),
      ).toHaveLength(0);
    });
  });

  describe("multi-select", () => {
    test("all checkbox inputs share the same name", () => {
      const result = render(
        <Choicebox name="test-group" multiselect options={CHOICEBOX_OPTIONS} />,
      );
      const items = result.getAllByRole("checkbox");
      items.forEach((item) => {
        expect(item).toHaveAttribute("name", "test-group[]");
      });
    });

    test("defaultValues selects the correct options", () => {
      const result = render(
        <Choicebox
          name="test"
          multiselect
          defaultValues={["option-a", "option-c"]}
          options={CHOICEBOX_OPTIONS}
        />,
      );
      const items = result.getAllByRole("checkbox");
      expect(items[0]).toBeChecked();
      expect(items[1]).not.toBeChecked();
      expect(items[2]).toBeChecked();
    });

    test("controlled values selects the correct options", () => {
      const result = render(
        <Choicebox
          name="test"
          multiselect
          values={["option-b"]}
          options={CHOICEBOX_OPTIONS}
        />,
      );
      const items = result.getAllByRole("checkbox");
      expect(items[0]).not.toBeChecked();
      expect(items[1]).toBeChecked();
      expect(items[2]).not.toBeChecked();
    });

    test("clicking an option toggles it", async () => {
      const result = render(
        <Choicebox name="test" multiselect options={CHOICEBOX_OPTIONS} />,
      );
      const items = result.getAllByRole("checkbox");

      await userEvent.click(result.getByText("Option A"));
      expect(items[0]).toBeChecked();

      await userEvent.click(result.getByText("Option A"));
      expect(items[0]).not.toBeChecked();
    });

    test("multiple options can be selected", async () => {
      const result = render(
        <Choicebox name="test" multiselect options={CHOICEBOX_OPTIONS} />,
      );
      const items = result.getAllByRole("checkbox");

      await userEvent.click(result.getByText("Option A"));
      await userEvent.click(result.getByText("Option C"));

      expect(items[0]).toBeChecked();
      expect(items[1]).not.toBeChecked();
      expect(items[2]).toBeChecked();
    });

    test("onChange callback fires with selected values", async () => {
      const onChange = vi.fn();
      const result = render(
        <Choicebox
          name="test"
          multiselect
          onChange={onChange}
          options={CHOICEBOX_OPTIONS}
        />,
      );

      await userEvent.click(result.getByText("Option A"));
      expect(onChange).toHaveBeenCalledWith(["option-a"]);

      await userEvent.click(result.getByText("Option C"));
      expect(onChange).toHaveBeenCalledWith(["option-a", "option-c"]);
    });

    test("onChange fires when unchecking", async () => {
      const onChange = vi.fn();
      const result = render(
        <Choicebox
          name="test"
          multiselect
          defaultValues={["option-a", "option-b"]}
          onChange={onChange}
          options={CHOICEBOX_OPTIONS}
        />,
      );

      await userEvent.click(result.getByText("Option A"));
      expect(onChange).toHaveBeenCalledWith(["option-b"]);
    });

    test("renders checkmark indicator", () => {
      const { container } = render(
        <Choicebox name="test" multiselect options={CHOICEBOX_OPTIONS} />,
      );
      const indicators = container.querySelectorAll(
        ".vesper-choicebox-input-multi-indicator",
      );
      expect(indicators).toHaveLength(3);
      expect(
        container.querySelectorAll(".vesper-choicebox-input-single-indicator"),
      ).toHaveLength(0);
    });

    test("keyboard navigation does not toggle selection", async () => {
      const result = render(
        <Choicebox name="test" multiselect options={CHOICEBOX_OPTIONS} />,
      );
      const items = result.getAllByRole("checkbox");

      items[0]!.focus();
      await userEvent.keyboard("{ArrowDown}");

      expect(items[0]).not.toBeChecked();
      expect(items[1]).not.toBeChecked();
    });

    test("space key toggles selection on focused item", async () => {
      const result = render(
        <Choicebox name="test" multiselect options={CHOICEBOX_OPTIONS} />,
      );
      const items = result.getAllByRole("checkbox");

      items[0]!.focus();
      await userEvent.keyboard(" ");
      expect(items[0]).toBeChecked();

      await userEvent.keyboard(" ");
      expect(items[0]).not.toBeChecked();
    });
  });
});

describe("choicebox [snapshot]", () => {
  [
    ...CHOICEBOX_PASSING_A11Y_PERMUTATIONS,
    ...CHOICEBOX_FAILING_A11Y_PERMUTATIONS,
  ].forEach(({ permutationName, ...props }) => {
    test(permutationName, () => {
      const { container } = render(<Choicebox {...props} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

describe("choicebox [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    CHOICEBOX_PASSING_A11Y_PERMUTATIONS.forEach(
      ({ permutationName, ...props }) => {
        test(`wcag2aaa (${permutationName}, ${theme})`, async () => {
          const { container } = render(<Choicebox {...props} />);
          expect(
            await axe.run(container, { runOnly: "wcag2aaa" }),
          ).toHaveNoViolations();
        });
      },
    );

    CHOICEBOX_FAILING_A11Y_PERMUTATIONS.forEach(
      ({ permutationName, ...props }) => {
        test.todo(`wcag2aaa (${permutationName}, ${theme})`, async () => {
          const { container } = render(<Choicebox {...props} />);
          expect(
            await axe.run(container, { runOnly: "wcag2aaa" }),
          ).toHaveNoViolations();
        });
      },
    );
  });
});
