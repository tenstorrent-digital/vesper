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

const COMBOBOX_SNAPSHOT_PERMUTATIONS: ComboboxPermutation[] = [
  // One per variant, which determines the message icon and colour scheme
  ...COMBOBOX_VARIANTS.map((variant) => ({
    permutationName: `variant: ${variant}`,
    variant,
    options: OPTIONS,
    message: "Message text",
  })),
  // One per size, which determines the input's typography variant
  ...COMBOBOX_SIZES.map((size) => ({
    permutationName: `size: ${size}`,
    size,
    options: OPTIONS,
  })),
  // Meaningful feature combos
  { permutationName: "with label", label: "Label text", options: OPTIONS },
  {
    permutationName: "required",
    label: "Label text",
    required: true,
    options: OPTIONS,
  },
  // A selected value swaps the trigger out for the clear button
  { permutationName: "with value", options: OPTIONS, defaultValue: "banana" },
  { permutationName: "disabled", disabled: true, options: OPTIONS },
  {
    permutationName: "full options",
    variant: "error" as const,
    size: "lg" as const,
    label: "Label text",
    message: "Message text",
    placeholder: "Placeholder text",
    required: true,
    name: "field-name",
    options: OPTIONS,
    defaultValue: "apple",
  },
];

const COMBOBOX_PERMUTATIONS: ComboboxPermutation[] = COMBOBOX_VARIANTS.map(
  (variant) => ({
    permutationName: `variant: ${variant}`,
    variant,
    label: "Label text",
    message: "Message text",
    options: OPTIONS,
  }),
);

const COMBOBOX_A11Y_FAILING_PERMUTATIONS: (Pick<ComboboxProps, "variant"> & {
  theme: string;
})[] = [
  { variant: "default", theme: "light" },
  { variant: "warning", theme: "light" },
  { variant: "success", theme: "light" },
  { variant: "error", theme: "light" },
  { variant: "default", theme: "dark" },
  { variant: "success", theme: "dark" },
  { variant: "error", theme: "dark" },
];

/** Renders a `Combobox` and returns the render result alongside its most commonly asserted elements */
function renderCombobox(props: Partial<ComboboxProps> = {}) {
  const result = render(<Combobox options={OPTIONS} {...props} />);

  return {
    ...result,
    wrapper: result.container.querySelector(".vesper-combobox")!,
    input: result.container.querySelector(".vesper-combobox-input")!,
    trigger: result.container.querySelector(".vesper-combobox-trigger")!,
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

  test("the label is associated with the input", () => {
    const result = renderCombobox({ label: "Fruit" });

    expect(result.getByLabelText("Fruit")).toBe(result.input);
  });

  test("the input is described by the message, alongside a custom aria-describedby", () => {
    const { input, message } = renderCombobox({
      message: "Pick a fruit",
      "aria-describedby": "custom-description",
    });

    expect(message).toHaveTextContent("Pick a fruit");
    expect(message.id).not.toBe("");
    expect(input.getAttribute("aria-describedby")?.split(" ")).toEqual([
      "custom-description",
      message.id,
    ]);
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
  COMBOBOX_SNAPSHOT_PERMUTATIONS.forEach((permutation) => {
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
      const label = `wcag2aaa (${permutationName}, ${theme})`;

      const testFn = async () => {
        const { container } = render(<Combobox {...props} />);
        expect(await axe.run(container.firstChild!)).toHaveNoViolations();
      };

      const failsA11y = COMBOBOX_A11Y_FAILING_PERMUTATIONS.some(
        (p) => p.variant === props.variant && p.theme === theme,
      );

      if (failsA11y) test.todo(label, testFn);
      else test(label, testFn);
    });
  });
});
