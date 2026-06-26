import { render, cleanup, fireEvent } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import axe from "axe-core";

import {
  RadioGroup,
  RADIO_SIZES,
  type RadioGroupProps,
} from "@/components/radio-group/radio-group";

import "@/styles/test.css";

const RADIO_GROUP_OPTIONS = [
  { value: "option-a", label: "Option A" },
  { value: "option-b", label: "Option B" },
  { value: "option-c", label: "Option C" },
];

const RADIO_GROUP_PERMUTATIONS = RADIO_SIZES.flatMap(
  (size): (RadioGroupProps & { name: string })[] => [
    {
      name: `${size}, vertical`,
      size,
      options: RADIO_GROUP_OPTIONS,
      orientation: "vertical",
      disabled: false,
    },
    {
      name: `${size}, vertical, disabled`,
      size,
      options: RADIO_GROUP_OPTIONS,
      orientation: "vertical",
      disabled: true,
    },
    {
      name: `${size}, horizontal`,
      size,
      options: RADIO_GROUP_OPTIONS,
      orientation: "horizontal",
      disabled: false,
    },
    {
      name: `${size}, horizontal, disabled`,
      size,
      options: RADIO_GROUP_OPTIONS,
      orientation: "horizontal",
      disabled: true,
    },
  ],
);

afterEach(cleanup);

describe("radio-group [unit]", () => {
  test("renders empty group when options are empty", () => {
    const result = render(<RadioGroup options={[]} />);
    const radios = result.queryAllByRole("radio");
    expect(radios).toHaveLength(0);
  });

  test("renders radio items for each option", () => {
    const result = render(<RadioGroup options={RADIO_GROUP_OPTIONS} />);
    const items = result.getAllByRole("radio");
    expect(items).toHaveLength(3);
  });

  test("renders labels for each option", () => {
    const result = render(<RadioGroup options={RADIO_GROUP_OPTIONS} />);
    expect(result.getByText("Option A")).not.toBeNull();
    expect(result.getByText("Option B")).not.toBeNull();
    expect(result.getByText("Option C")).not.toBeNull();
  });

  RADIO_SIZES.forEach((size) => {
    test(`${size} size class on items`, () => {
      const result = render(
        <RadioGroup size={size} options={RADIO_GROUP_OPTIONS} />,
      );
      const items = result.getAllByRole("radio");
      items.forEach((item) => {
        expect(item).toHaveClass(`vesper-radio-group-item-${size}`);
      });
    });
  });

  test("vertical orientation", () => {
    const { container } = render(
      <RadioGroup orientation="vertical" options={RADIO_GROUP_OPTIONS} />,
    );
    expect(container.firstChild).toHaveClass("vesper-radio-group-vertical");
  });

  test("horizontal orientation", () => {
    const { container } = render(
      <RadioGroup orientation="horizontal" options={RADIO_GROUP_OPTIONS} />,
    );
    expect(container.firstChild).toHaveClass("vesper-radio-group-horizontal");
  });

  test("custom className is merged", () => {
    const { container } = render(
      <RadioGroup
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
      <RadioGroup defaultValue="option-b" options={RADIO_GROUP_OPTIONS} />,
    );
    const items = result.getAllByRole("radio");
    expect(items[0]).toHaveAttribute("data-state", "unchecked");
    expect(items[1]).toHaveAttribute("data-state", "checked");
    expect(items[2]).toHaveAttribute("data-state", "unchecked");
  });

  test("clicking an option selects it", async () => {
    const result = render(<RadioGroup options={RADIO_GROUP_OPTIONS} />);
    const items = result.getAllByRole("radio");

    await userEvent.click(items[0]!);
    expect(items[0]).toHaveAttribute("data-state", "checked");
    expect(items[1]).toHaveAttribute("data-state", "unchecked");
    expect(items[2]).toHaveAttribute("data-state", "unchecked");

    await userEvent.click(items[2]!);
    expect(items[0]).toHaveAttribute("data-state", "unchecked");
    expect(items[1]).toHaveAttribute("data-state", "unchecked");
    expect(items[2]).toHaveAttribute("data-state", "checked");
  });

  test("onValueChange callback", async () => {
    const onValueChange = vi.fn();
    const result = render(
      <RadioGroup
        onValueChange={onValueChange}
        options={RADIO_GROUP_OPTIONS}
      />,
    );
    const items = result.getAllByRole("radio");

    await userEvent.click(items[1]!);
    expect(onValueChange).toHaveBeenCalledWith("option-b");
  });

  test("disabling all items via disabled prop", () => {
    const result = render(
      <RadioGroup disabled options={RADIO_GROUP_OPTIONS} />,
    );
    const items = result.getAllByRole("radio");
    items.forEach((item) => {
      expect(item).toBeDisabled();
    });
  });

  test("disabled group does not respond to clicks", () => {
    const onValueChange = vi.fn();
    const result = render(
      <RadioGroup
        disabled
        onValueChange={onValueChange}
        options={RADIO_GROUP_OPTIONS}
      />,
    );
    const items = result.getAllByRole("radio");

    fireEvent.click(items[0]!);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  test("disabling individual option", () => {
    const result = render(
      <RadioGroup
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
    const onValueChange = vi.fn();
    const result = render(
      <RadioGroup
        onValueChange={onValueChange}
        options={[
          { value: "option-a", label: "Option A" },
          { value: "option-b", label: "Option B", disabled: true },
          { value: "option-c", label: "Option C" },
        ]}
      />,
    );
    const items = result.getAllByRole("radio");

    fireEvent.click(items[1]!);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(items[1]).toHaveAttribute("data-state", "unchecked");
  });

  test("keyboard navigation (vertical orientation)", async () => {
    const result = render(
      <RadioGroup defaultValue="option-a" options={RADIO_GROUP_OPTIONS} />,
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
  RADIO_GROUP_PERMUTATIONS.forEach(({ name, ...props }) => {
    test(name, () => {
      const { container } = render(<RadioGroup {...props} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

describe("radio-group [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    RADIO_GROUP_PERMUTATIONS.forEach(({ name, ...props }) => {
      test(`wcag2aaa (${name}, ${theme})`, async () => {
        const { container } = render(<RadioGroup {...props} />);
        expect(
          await axe.run(container, { runOnly: "wcag2aaa" }),
        ).toHaveNoViolations();
      });
    });
  });
});
