import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { Server } from "@/components/icons/icons";
import {
  Select,
  SELECT_SIZES,
  type SelectProps,
} from "@/components/select/select";

import "@/styles/test.css";

const OPTIONS = [
  { value: "lions", label: "Lions" },
  { value: "tigers", label: "Tigers" },
  { value: "bears", label: "Bears" },
  { value: "oh_my", label: "Oh my" },
];

type SelectPermutation = SelectProps & { permutationName: string };

const SELECT_PERMUTATIONS: SelectPermutation[] = SELECT_SIZES.flatMap(
  (size): SelectPermutation[] => [
    {
      permutationName: `${size}`,
      size,
      options: OPTIONS,
    },
    {
      permutationName: `${size}, disabled`,
      size,
      options: OPTIONS,
      disabled: true,
    },
    {
      permutationName: `${size}, with icon`,
      size,
      options: OPTIONS,
      icon: <Server />,
    },
    {
      permutationName: `${size}, with value`,
      size,
      options: OPTIONS,
      defaultValue: "tigers",
    },
    {
      permutationName: `${size}, with icon, disabled`,
      size,
      options: OPTIONS,
      icon: <Server />,
      disabled: true,
    },
  ],
);

afterEach(cleanup);

describe("select [unit]", () => {
  test("renders a trigger button", () => {
    const result = render(<Select options={OPTIONS} />);
    const trigger = result.getByRole("combobox");
    expect(trigger).not.toBeNull();
  });

  test("renders placeholder text", () => {
    const result = render(<Select options={OPTIONS} />);
    const trigger = result.getByRole("combobox");
    expect(trigger.textContent).toContain("Select an option");
  });

  test("renders custom placeholder", () => {
    const result = render(
      <Select options={OPTIONS} placeholder="Choose one" />,
    );
    const trigger = result.getByRole("combobox");
    expect(trigger.textContent).toContain("Choose one");
  });

  test("defaults to md size", () => {
    const { container } = render(<Select options={OPTIONS} />);
    const trigger = container.querySelector(".vesper-select");
    expect(trigger).toHaveClass("vesper-select-md");
  });

  SELECT_SIZES.forEach((size) => {
    test(`${size} size class`, () => {
      const { container } = render(<Select options={OPTIONS} size={size} />);
      const trigger = container.querySelector(".vesper-select");
      expect(trigger).toHaveClass(`vesper-select-${size}`);
    });
  });

  test("custom className is merged", () => {
    const { container } = render(
      <Select options={OPTIONS} className="custom-class" />,
    );
    const trigger = container.querySelector(".vesper-select");
    expect(trigger).toHaveClass("vesper-select");
    expect(trigger).toHaveClass("vesper-select-md");
    expect(trigger).toHaveClass("custom-class");
  });

  test("renders icon when provided", () => {
    const { container } = render(
      <Select options={OPTIONS} icon={<Server />} />,
    );
    const icon = container.querySelector(".vesper-select-icon");
    expect(icon).not.toBeNull();
  });

  test("does not render icon when not provided", () => {
    const { container } = render(<Select options={OPTIONS} />);
    const icon = container.querySelector(".vesper-select-icon");
    expect(icon).toBeNull();
  });

  test("renders state indicator", () => {
    const { container } = render(<Select options={OPTIONS} />);
    const indicator = container.querySelector(".vesper-select-state-indicator");
    expect(indicator).not.toBeNull();
  });

  test("disabled trigger has disabled attribute", () => {
    const result = render(<Select options={OPTIONS} disabled />);
    const trigger = result.getByRole("combobox");
    expect(trigger).toBeDisabled();
  });

  test("disabled trigger does not open on click", () => {
    const result = render(<Select options={OPTIONS} disabled />);
    const trigger = result.getByRole("combobox");

    fireEvent.pointerDown(trigger);
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("data-state", "closed");
  });

  test("Placeholder defaults to 'Select an option'", () => {
    const result = render(<Select options={OPTIONS} />);
    const trigger = result.getByRole("combobox");
    expect(trigger.textContent).toEqual("Select an option");
  });

  test("aria-label defaults to placeholder", () => {
    const result = render(
      <Select options={OPTIONS} placeholder="Pick something" />,
    );
    const trigger = result.getByRole("combobox");
    expect(trigger).toHaveAttribute("aria-label", "Pick something");
  });

  test("custom aria-label", () => {
    const result = render(
      <Select
        options={OPTIONS}
        placeholder="Pick one"
        aria-label="Custom label"
      />,
    );
    const trigger = result.getByRole("combobox");
    expect(trigger).toHaveAttribute("aria-label", "Custom label");
  });

  test("additional props are passed through to trigger", () => {
    const result = render(
      <Select options={OPTIONS} data-testid="my-select" id="select-id" />,
    );
    const trigger = result.getByRole("combobox");
    expect(trigger).toHaveAttribute("data-testid", "my-select");
    expect(trigger).toHaveAttribute("id", "select-id");
  });

  test("defaultValue selects the correct option", () => {
    const result = render(<Select options={OPTIONS} defaultValue="tigers" />);
    const trigger = result.getByRole("combobox");
    expect(trigger.textContent).toContain("Tigers");
  });

  test("controlled value selects the correct option", () => {
    const result = render(<Select options={OPTIONS} value="bears" />);
    const trigger = result.getByRole("combobox");
    expect(trigger.textContent).toContain("Bears");
  });

  test("clicking trigger opens dropdown", async () => {
    const result = render(<Select options={OPTIONS} />);
    const trigger = result.getByRole("combobox");

    await userEvent.click(trigger);
    await waitFor(() => {
      expect(trigger).toHaveAttribute("data-state", "open");
    });

    const content = document.querySelector(".vesper-select-content");
    expect(content).not.toBeNull();
  });

  test("options render in dropdown", async () => {
    const result = render(<Select options={OPTIONS} />);
    const trigger = result.getByRole("combobox");

    await userEvent.click(trigger);
    await waitFor(() => {
      expect(document.querySelector(".vesper-select-content")).not.toBeNull();
    });

    const items = document.querySelectorAll(".vesper-select-item");
    expect(items).toHaveLength(4);

    expect(items[0]!.textContent).toContain("Lions");
    expect(items[1]!.textContent).toContain("Tigers");
    expect(items[2]!.textContent).toContain("Bears");
    expect(items[3]!.textContent).toContain("Oh my");
  });

  test("selecting an option updates value", async () => {
    const result = render(<Select options={OPTIONS} />);
    const trigger = result.getByRole("combobox");

    await userEvent.click(trigger);
    await waitFor(() => {
      expect(document.querySelector(".vesper-select-content")).not.toBeNull();
    });

    const items = document.querySelectorAll(".vesper-select-item");
    await userEvent.click(items[1]!);

    await waitFor(() => {
      expect(trigger.textContent).toContain("Tigers");
    });
  });

  test("selecting an option closes dropdown", async () => {
    const result = render(<Select options={OPTIONS} />);
    const trigger = result.getByRole("combobox");

    await userEvent.click(trigger);
    await waitFor(() => {
      expect(document.querySelector(".vesper-select-content")).not.toBeNull();
    });

    const items = document.querySelectorAll(".vesper-select-item");
    await userEvent.click(items[0]!);

    await waitFor(() => {
      expect(trigger).toHaveAttribute("data-state", "closed");
    });
  });

  test("onValueChange callback fires on selection", async () => {
    const onValueChange = vi.fn();
    const result = render(
      <Select options={OPTIONS} onValueChange={onValueChange} />,
    );
    const trigger = result.getByRole("combobox");

    await userEvent.click(trigger);
    await waitFor(() => {
      expect(document.querySelector(".vesper-select-content")).not.toBeNull();
    });

    const items = document.querySelectorAll(".vesper-select-item");
    await userEvent.click(items[2]!);

    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith("bears");
    });
  });

  test("selected option shows checkmark", async () => {
    const result = render(<Select options={OPTIONS} defaultValue="tigers" />);
    const trigger = result.getByRole("combobox");

    await userEvent.click(trigger);
    await waitFor(() => {
      expect(document.querySelector(".vesper-select-content")).not.toBeNull();
    });

    const items = document.querySelectorAll(".vesper-select-item");
    const selectedItem = items[1]!;
    expect(selectedItem).toHaveAttribute("data-state", "checked");
  });

  test("unselected options do not show checkmark", async () => {
    const result = render(<Select options={OPTIONS} defaultValue="tigers" />);
    const trigger = result.getByRole("combobox");

    await userEvent.click(trigger);
    await waitFor(() => {
      expect(document.querySelector(".vesper-select-content")).not.toBeNull();
    });

    const items = document.querySelectorAll(".vesper-select-item");
    expect(items[0]).toHaveAttribute("data-state", "unchecked");
    expect(items[2]).toHaveAttribute("data-state", "unchecked");
    expect(items[3]).toHaveAttribute("data-state", "unchecked");
  });

  test("keyboard open with Enter", async () => {
    const result = render(<Select options={OPTIONS} />);
    const trigger = result.getByRole("combobox");

    trigger.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => {
      expect(trigger).toHaveAttribute("data-state", "open");
    });
  });

  test("keyboard open with Space", async () => {
    const result = render(<Select options={OPTIONS} />);
    const trigger = result.getByRole("combobox");

    trigger.focus();
    await userEvent.keyboard(" ");
    await waitFor(() => {
      expect(trigger).toHaveAttribute("data-state", "open");
    });
  });

  test("keyboard close with Escape", async () => {
    const result = render(<Select options={OPTIONS} />);
    const trigger = result.getByRole("combobox");

    await userEvent.click(trigger);
    await waitFor(() => {
      expect(trigger).toHaveAttribute("data-state", "open");
    });

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(trigger).toHaveAttribute("data-state", "closed");
    });
  });

  test("keyboard navigation with ArrowDown", async () => {
    const onValueChange = vi.fn();
    const result = render(
      <Select options={OPTIONS} onValueChange={onValueChange} />,
    );
    const trigger = result.getByRole("combobox");

    trigger.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => {
      expect(document.querySelector(".vesper-select-content")).not.toBeNull();
    });

    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");

    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith("tigers");
    });
  });

  test("empty options renders no items", async () => {
    const result = render(<Select options={[]} />);
    const trigger = result.getByRole("combobox");

    await userEvent.click(trigger);
    await waitFor(() => {
      expect(document.querySelector(".vesper-select-content")).not.toBeNull();
    });

    const items = document.querySelectorAll(".vesper-select-item");
    expect(items).toHaveLength(0);
  });

  test("renders with required prop inside of forms", () => {
    const { container } = render(
      <form>
        <Select options={OPTIONS} required />
      </form>,
    );

    // Radix Select renders a hidden select when rendered inside a form
    const hiddenSelect = container.querySelector("select");
    expect(hiddenSelect).toHaveAttribute("required");
  });

  test("renders with name prop inside of forms", () => {
    const { container } = render(
      <form>
        <Select options={OPTIONS} name="animal" />
      </form>,
    );

    // Radix Select renders a hidden select when rendered inside a form
    const hiddenSelect = container.querySelector("select");
    expect(hiddenSelect).toHaveAttribute("name", "animal");
  });

  test("trigger has correct data-state when closed", () => {
    const result = render(<Select options={OPTIONS} />);
    const trigger = result.getByRole("combobox");
    expect(trigger).toHaveAttribute("data-state", "closed");
  });

  test("portals menu content into document.body", async () => {
    const result = render(<Select options={OPTIONS} />);
    const trigger = result.getByRole("combobox");

    await userEvent.click(trigger);
    await waitFor(() => {
      expect(document.querySelector(".vesper-select-content")).not.toBeNull();
    });

    const content = document.querySelector(".vesper-select-content")!;
    expect(content.closest("dialog")).toBeNull();
    expect(document.body.contains(content)).toBe(true);
  });

  test("portals into the closest dialog ancestor", async () => {
    const result = render(
      <dialog open data-testid="dialog">
        <div>
          <div>
            <Select options={OPTIONS} />
          </div>
        </div>
      </dialog>,
    );
    const trigger = result.getByRole("combobox");

    await userEvent.click(trigger);
    await waitFor(() => {
      expect(document.querySelector(".vesper-select-content")).not.toBeNull();
    });

    const dialog = result.getByTestId("dialog");
    const content = document.querySelector(".vesper-select-content")!;
    expect(dialog.contains(content)).toBe(true);
  });

  test("portals into the container prop", async () => {
    const container = document.createElement("div");
    document.body.append(container);

    const result = render(<Select options={OPTIONS} container={container} />);
    const trigger = result.getByRole("combobox");

    await userEvent.click(trigger);
    await waitFor(() => {
      expect(container.querySelector(".vesper-select-content")).not.toBeNull();
    });

    container.remove();
  });

  test("container prop takes precedence over the closest dialog ancestor", async () => {
    const container = document.createElement("div");
    document.body.append(container);

    const result = render(
      <dialog open data-testid="dialog">
        <Select options={OPTIONS} container={container} />
      </dialog>,
    );
    const trigger = result.getByRole("combobox");

    await userEvent.click(trigger);
    await waitFor(() => {
      expect(container.querySelector(".vesper-select-content")).not.toBeNull();
    });

    const dialog = result.getByTestId("dialog");
    expect(dialog.querySelector(".vesper-select-content")).toBeNull();

    container.remove();
  });
});

describe("select [snapshot]", () => {
  SELECT_PERMUTATIONS.forEach(({ permutationName, ...props }) => {
    test(permutationName, () => {
      const { container } = render(<Select {...props} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

describe("select [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    SELECT_PERMUTATIONS.forEach(({ permutationName, ...props }) => {
      test(`wcag2aaa (${permutationName}, ${theme})`, async () => {
        const { container } = render(<Select {...props} />);
        expect(await axe.run(container)).toHaveNoViolations();
      });
    });
  });
});
