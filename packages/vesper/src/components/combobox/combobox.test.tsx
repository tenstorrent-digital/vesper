import { cleanup, render, waitFor } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import {
  Combobox,
  COMBOBOX_SIZES,
  COMBOBOX_VARIANTS,
  type ComboboxProps,
} from "@/components/combobox/combobox";

import "@/styles/test.css";

const OPTIONS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
];

/** A mix of both supported option shapes: string options are their own label and value */
const MIXED_OPTIONS = ["Canada", { value: "jp", label: "Japan" }];

type ComboboxPermutation = ComboboxProps & { permutationName: string };

const COMBOBOX_PERMUTATIONS: ComboboxPermutation[] = COMBOBOX_SIZES.flatMap(
  (size) =>
    COMBOBOX_VARIANTS.flatMap((variant) => [
      {
        permutationName: `${size}, ${variant}`,
        size,
        variant,
        options: OPTIONS,
        defaultValue: "banana",
      },
      {
        permutationName: `${size}, ${variant}, disabled`,
        size,
        variant,
        options: OPTIONS,
        disabled: true,
      },
      {
        permutationName: `${size}, ${variant}, full options`,
        size,
        variant,
        options: OPTIONS,
        defaultValue: "banana",
        disabled: true,
        placeholder: "Placeholder text",
        name: "field-name",
      },
    ]),
);

// const COMBOBOX_A11Y_FAILING_PERMUTATIONS: (Pick<ComboboxProps, "variant"> & {
//   theme: string;
// })[] = [
//   { variant: "default", theme: "light" },
//   { variant: "warning", theme: "light" },
//   { variant: "success", theme: "light" },
//   { variant: "error", theme: "light" },
//   { variant: "default", theme: "dark" },
//   { variant: "success", theme: "dark" },
//   { variant: "error", theme: "dark" },
// ];

/** Renders a `Combobox` and returns the render result alongside its most commonly asserted elements */
function renderCombobox(props: Partial<ComboboxProps> = {}) {
  const result = render(<Combobox options={OPTIONS} {...props} />);

  return {
    ...result,
    input: result.container.querySelector(".vesper-combobox-input")!,
    trigger: result.container.querySelector(".vesper-combobox-trigger")!,
    /** Only rendered once a value is selected, so this is `null` for an empty combobox */
    clear: result.container.querySelector(".vesper-combobox-clear")!,
    message: result.container.querySelector(".vesper-form-input-message")!,
  };
}

/** Opens the dropdown by clicking the supplied element, and resolves once the popup is rendered */
async function openPopup(element: Element) {
  await userEvent.click(element);
  await waitFor(() => {
    expect(document.querySelector(".vesper-combobox-popup")).not.toBeNull();
  });
}

/** The option elements currently rendered in the dropdown */
function getItems() {
  return Array.from(document.querySelectorAll(".vesper-combobox-item"));
}

afterEach(cleanup);

describe("combobox [unit]", () => {
  test("renders an input", () => {
    const { input } = renderCombobox();

    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("role", "combobox");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  test("string options are their own label, object options render their label", async () => {
    const { trigger } = renderCombobox({ options: MIXED_OPTIONS });

    await openPopup(trigger);
    expect(getItems().map((item) => item.textContent)).toEqual([
      "Canada",
      "Japan",
    ]);
  });

  test("selecting an option reports its value", async () => {
    const onValueChange = vi.fn();
    const { trigger } = renderCombobox({
      options: MIXED_OPTIONS,
      onValueChange,
    });

    await openPopup(trigger);
    await userEvent.click(getItems()[1]!);
    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith("jp"));
  });

  test("the clear button and dropdown trigger have default accessible labels", () => {
    const { clear, trigger } = renderCombobox({ defaultValue: "apple" });

    expect(clear).toHaveAttribute("aria-label", "Clear selection");
    expect(trigger).toHaveAttribute("aria-label", "Show options");
  });

  test("clearButtonAriaLabel labels the button that clears the selection", async () => {
    const onValueChange = vi.fn();
    const result = renderCombobox({
      defaultValue: "apple",
      clearButtonAriaLabel: "Clear fruit",
      onValueChange,
    });

    expect(result.clear).toHaveAttribute("aria-label", "Clear fruit");
    expect(result.getByLabelText("Clear fruit")).toBe(result.clear);
    expect(result.queryByLabelText("Clear selection")).toBeNull();

    // The labelled element is the control that actually clears the selection
    await userEvent.click(result.clear);
    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith(null));
  });

  test("dropdownTriggerAriaLabel labels the button that opens the dropdown", async () => {
    const result = renderCombobox({ dropdownTriggerAriaLabel: "Show fruits" });

    expect(result.trigger).toHaveAttribute("aria-label", "Show fruits");
    expect(result.getByLabelText("Show fruits")).toBe(result.trigger);
    expect(result.queryByLabelText("Show options")).toBeNull();

    // The labelled element is the control that actually opens the dropdown
    await openPopup(result.trigger);
    expect(getItems()).toHaveLength(OPTIONS.length);
  });

  test("renders the empty state text when no options match", async () => {
    const { input } = renderCombobox({ emptyStateText: "Nothing here" });

    await userEvent.click(input);
    await userEvent.type(input, "durian");

    await waitFor(() => {
      expect(
        document.querySelector(".vesper-combobox-empty-state"),
      ).toHaveTextContent("Nothing here");
    });
  });
});

describe("combobox [snapshot]", () => {
  COMBOBOX_PERMUTATIONS.forEach((permutation) => {
    const { permutationName, ...props } = permutation;

    test(permutationName, () => {
      const { container } = render(<Combobox {...props} />);

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

describe("combobox [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    COMBOBOX_PERMUTATIONS.forEach((permutation) => {
      const { permutationName, ...props } = permutation;

      test(`wcag2aaa (${permutationName}, ${theme})`, async () => {
        const { container } = render(<Combobox {...props} />);
        expect(await axe.run(container.firstChild!)).toHaveNoViolations();
      });
    });
  });
});
