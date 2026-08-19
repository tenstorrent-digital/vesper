import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { Close, Globe } from "@/components/icons/icons";
import {
  TEXT_INPUT_SIZES,
  TEXT_INPUT_VARIANTS,
  TextInput,
  TextInputProps,
} from "@/components/text-input/text-input";

import "@/styles/test.css";

const PREFIX_OPTIONS = ["+1", "+44", "+51"];

const PREFIX_LABELLED_OPTIONS = [
  { value: "us", label: "+1" },
  { value: "uk", label: "+44" },
  { value: "pe", label: "+51" },
];

/** The chip size rendered by the prefix for each text input size */
const PREFIX_CHIP_SIZES = { sm: "sm", md: "md", lg: "md" } as const;

/** Opens the prefix dropdown and resolves with its rendered options */
async function openPrefix(trigger: HTMLElement) {
  await userEvent.click(trigger);
  await waitFor(() => {
    expect(document.querySelector(".vesper-select-content")).not.toBeNull();
  });

  return Array.from(
    document.querySelectorAll<HTMLElement>(".vesper-select-item"),
  );
}

const SNAPSHOT_CASES: (TextInputProps & { name: string })[] = [
  // One per variant
  ...TEXT_INPUT_VARIANTS.map((variant) => ({
    name: `variant: ${variant}`,
    variant,
    size: "lg" as const,
    message: "Message text",
  })),
  // One per size
  ...TEXT_INPUT_SIZES.map((size) => ({
    name: `size: ${size}`,
    size,
  })),
  // Meaningful feature combos
  { name: "with icon", iconLeft: <Globe />, size: "lg" as const },
  { name: "with label", label: "Label text", size: "lg" as const },
  {
    name: "with prefix",
    prefix: {
      options: PREFIX_OPTIONS,
      ariaLabel: "Area code",
      name: "area-code",
      defaultValue: "+1",
      width: 100,
    },
    size: "lg" as const,
  },
  {
    name: "with prefix, disabled",
    prefix: {
      options: PREFIX_OPTIONS,
      ariaLabel: "Area code",
      name: "area-code",
      defaultValue: "+1",
    },
    disabled: true,
    size: "lg" as const,
  },
  { name: "disabled", disabled: true, size: "lg" as const },
  {
    name: "full options",
    variant: "error",
    size: "lg" as const,
    label: "Label text",
    message: "Message text",
    disabled: true,
  },
];

// A11y: variant × disabled are the axes that affect contrast/color
const A11Y_CASES: (TextInputProps & { name: string })[] =
  TEXT_INPUT_VARIANTS.flatMap((variant) => [
    {
      name: `${variant}`,
      variant,
      label: "Label text",
      message: "Message text",
      disabled: false,
    },
    {
      name: `${variant}, disabled`,
      variant,
      label: "Label text",
      message: "Message text",
      disabled: true,
    },
  ]);

const TEXT_INPUT_A11Y_FAILING_PERMUTATIONS: (Pick<
  TextInputProps,
  "variant" | "disabled"
> & { theme: string })[] = [
  { variant: "default", disabled: false, theme: "light" },
  { variant: "default", disabled: true, theme: "light" },
  { variant: "warning", disabled: false, theme: "light" },
  { variant: "warning", disabled: true, theme: "light" },
  { variant: "success", disabled: false, theme: "light" },
  { variant: "success", disabled: true, theme: "light" },
  { variant: "error", disabled: false, theme: "light" },
  { variant: "error", disabled: true, theme: "light" },
  { variant: "default", disabled: false, theme: "dark" },
  { variant: "default", disabled: true, theme: "dark" },
  { variant: "success", disabled: false, theme: "dark" },
  { variant: "success", disabled: true, theme: "dark" },
  { variant: "error", disabled: false, theme: "dark" },
  { variant: "error", disabled: true, theme: "dark" },
];

afterEach(cleanup);

describe("text-input [unit]", () => {
  test("renders an input", () => {
    const result = render(<TextInput />);
    expect(result.getByRole("textbox").tagName).toBe("INPUT");
  });

  TEXT_INPUT_VARIANTS.forEach((variant) => {
    test(`${variant} variant`, () => {
      const result = render(<TextInput variant={variant} />);

      expect(result.container.firstChild).toHaveClass(
        `vesper-text-input-${variant}`,
      );
    });
  });

  TEXT_INPUT_SIZES.forEach((size) => {
    test(`${size} size`, () => {
      const result = render(<TextInput size={size} />);

      expect(result.container.firstChild).toHaveClass(
        `vesper-text-input-${size}`,
      );
    });
  });

  test("disabling when single line", () => {
    const result = render(<TextInput disabled />);
    expect(result.getByRole("textbox")).toBeDisabled();
  });

  test("renders a label when supplied", () => {
    const result = render(<TextInput label="Username" />);

    const label = result.container.querySelector(".vesper-text-input-label");
    expect(label).not.toBeNull();
    expect(label!.tagName).toBe("LABEL");
    expect(label).toHaveTextContent("Username");
  });

  test("label htmlFor matches the id prop", () => {
    const result = render(<TextInput label="Email" id="email-input" />);

    const label = result.container.querySelector(".vesper-text-input-label");
    expect(label).toHaveAttribute("for", "email-input");
  });

  test("clicking the label focuses the input", async () => {
    const result = render(<TextInput label="Username" id="username-input" />);

    const label = result.container.querySelector(".vesper-text-input-label")!;
    await userEvent.click(label);

    expect(result.getByRole("textbox")).toHaveFocus();
  });

  test("the id prop is forwarded to the input", () => {
    const result = render(<TextInput id="email-input" />);

    expect(result.getByRole("textbox")).toHaveAttribute("id", "email-input");
  });

  test("an id is generated when the id prop is omitted", () => {
    const result = render(<TextInput label="Username" />);

    const input = result.getByRole("textbox");
    expect(input.id).not.toBe("");
    expect(
      result.container.querySelector(".vesper-text-input-label"),
    ).toHaveAttribute("for", input.id);
  });

  test("the generated id associates the label with the input", () => {
    const result = render(<TextInput label="Username" />);

    expect(result.getByLabelText("Username")).toBe(result.getByRole("textbox"));
  });

  test("renders an icon to the left when provided", () => {
    const clickHandler = vi.fn();
    const result = render(
      <TextInput
        iconLeft={<Globe data-testid="search-icon" />}
        iconLeftOnClick={clickHandler}
        iconLeftAriaLabel="Search"
      />,
    );

    // assert the icon exists
    expect(result.getByTestId("search-icon")).not.toBeNull();

    // assert the icon got rendered inside a button
    const iconButton = result.getByRole("button", { name: /search/i });
    expect(iconButton).not.toBeNull();
    expect(iconButton).toHaveAttribute("aria-label", "Search");

    // assert the icon button click handler works
    iconButton.click();
    expect(clickHandler).toHaveBeenCalledOnce();
  });

  test("renders an icon to the right when provided", () => {
    const clickHandler = vi.fn();
    const result = render(
      <TextInput
        iconRight={<Globe data-testid="search-icon" />}
        iconRightOnClick={clickHandler}
        iconRightAriaLabel="Search"
      />,
    );

    // assert the icon exists
    expect(result.getByTestId("search-icon")).not.toBeNull();

    // assert the icon got rendered inside a button
    const iconButton = result.getByRole("button", { name: /search/i });
    expect(iconButton).not.toBeNull();
    expect(iconButton).toHaveAttribute("aria-label", "Search");

    // assert the icon button click handler works
    iconButton.click();
    expect(clickHandler).toHaveBeenCalledOnce();
  });

  test("icon buttons get disabled input is disabled", () => {
    const leftIconClickHandler = vi.fn();
    const rightIconClickHandler = vi.fn();

    const result = render(
      <TextInput
        iconRight={<Globe />}
        iconLeft={<Close />}
        iconRightOnClick={rightIconClickHandler}
        iconLeftOnClick={leftIconClickHandler}
        disabled
      />,
    );

    const [leftIconButton, rightIconButton] = result.getAllByRole("button");
    expect(leftIconButton).toBeDisabled();
    expect(rightIconButton).toBeDisabled();
  });

  test("additional prop passthrough", () => {
    const result = render(<TextInput aria-label="custom label" />);
    const input = result.container.querySelector("input")!;
    expect(input).toHaveAttribute("aria-label", "custom label");
  });

  test("custom className", () => {
    const result = render(
      <TextInput size="lg" variant="default" className="custom-class" />,
    );

    const el = result.container.firstChild;
    expect(el).toHaveClass("vesper-text-input");
    expect(el).toHaveClass("vesper-text-input-lg");
    expect(el).toHaveClass("vesper-text-input-default");
    expect(el).toHaveClass("custom-class");
  });

  describe("prefix", () => {
    test("no prefix is rendered by default", () => {
      const result = render(<TextInput />);

      expect(result.queryByRole("combobox")).toBeNull();
      expect(
        result.container.querySelector(".vesper-text-input-prefix"),
      ).toBeNull();
    });

    test("renders a prefix select trigger when provided", () => {
      const result = render(
        <TextInput
          prefix={{ options: PREFIX_OPTIONS, ariaLabel: "Area code" }}
        />,
      );

      const trigger = result.getByRole("combobox");
      expect(trigger).toHaveClass("vesper-text-input-prefix");
      // the trigger renders as a Chip
      expect(trigger).toHaveClass("vesper-chip");
      expect(
        trigger.closest(".vesper-text-input-field-wrapper"),
      ).not.toBeNull();
    });

    test("renders the prefix between the left icon and the input", () => {
      const result = render(
        <TextInput
          iconLeft={<Globe />}
          prefix={{ options: PREFIX_OPTIONS, ariaLabel: "Area code" }}
        />,
      );

      const wrapper = result.container.querySelector(
        ".vesper-text-input-field-wrapper",
      )!;
      const children = Array.from(wrapper.children);
      const indexOf = (selector: string) =>
        children.indexOf(wrapper.querySelector(selector)!);

      expect(indexOf(".vesper-text-input-icon")).toBeLessThan(
        indexOf(".vesper-text-input-prefix"),
      );
      expect(indexOf(".vesper-text-input-prefix")).toBeLessThan(
        indexOf(".vesper-text-input-field"),
      );
    });

    TEXT_INPUT_SIZES.forEach((size) => {
      test(`${size} input renders a ${PREFIX_CHIP_SIZES[size]} prefix chip`, () => {
        const result = render(
          <TextInput size={size} prefix={{ options: PREFIX_OPTIONS }} />,
        );

        expect(result.getByRole("combobox")).toHaveClass(
          `vesper-chip-${PREFIX_CHIP_SIZES[size]}`,
        );
      });
    });

    test("prefix has no explicit width by default", () => {
      const result = render(<TextInput prefix={{ options: PREFIX_OPTIONS }} />);

      const trigger = result.getByRole("combobox");
      expect(trigger.style.width).toBe("");
      expect(trigger.style.flexShrink).toBe("0");
    });

    test("prefix width is applied to the trigger", () => {
      const result = render(
        <TextInput prefix={{ options: PREFIX_OPTIONS, width: 80 }} />,
      );

      const trigger = result.getByRole("combobox");
      // the width is calculated as rem-relative
      expect(trigger.style.width).toBe("calc(5rem)");
      expect(trigger.style.flexShrink).toBe("0");
      expect(trigger.getBoundingClientRect().width).toBeCloseTo(80, 1);
    });

    test("renders string options", async () => {
      const result = render(<TextInput prefix={{ options: PREFIX_OPTIONS }} />);

      const items = await openPrefix(result.getByRole("combobox"));
      expect(items).toHaveLength(3);
      expect(items.map((item) => item.textContent)).toEqual(PREFIX_OPTIONS);
    });

    test("renders labelled options", async () => {
      const result = render(
        <TextInput prefix={{ options: PREFIX_LABELLED_OPTIONS }} />,
      );

      const items = await openPrefix(result.getByRole("combobox"));
      expect(items).toHaveLength(3);
      expect(items.map((item) => item.textContent)).toEqual([
        "+1",
        "+44",
        "+51",
      ]);
    });

    test("selecting an option calls onChange with the option value", async () => {
      const onChange = vi.fn();
      const result = render(
        <TextInput prefix={{ options: PREFIX_LABELLED_OPTIONS, onChange }} />,
      );

      const trigger = result.getByRole("combobox");
      const items = await openPrefix(trigger);
      await userEvent.click(items[1]!);

      await waitFor(() => {
        // the value is reported, and the label is displayed
        expect(onChange).toHaveBeenCalledExactlyOnceWith("uk");
        expect(trigger).toHaveTextContent("+44");
      });
    });

    test("selecting an option closes the dropdown", async () => {
      const result = render(<TextInput prefix={{ options: PREFIX_OPTIONS }} />);

      const trigger = result.getByRole("combobox");
      const items = await openPrefix(trigger);
      await userEvent.click(items[0]!);

      await waitFor(() => {
        expect(trigger).not.toHaveAttribute("data-popup-open");
      });
    });

    test("renders the prefix placeholder until an option is selected", async () => {
      const result = render(
        <TextInput prefix={{ options: PREFIX_OPTIONS, placeholder: "Code" }} />,
      );

      const trigger = result.getByRole("combobox");
      expect(trigger).toHaveTextContent("Code");

      const items = await openPrefix(trigger);
      await userEvent.click(items[2]!);

      await waitFor(() => {
        expect(trigger).toHaveTextContent("+51");
        expect(trigger).not.toHaveTextContent("Code");
      });
    });

    test("prefix defaultValue selects the matching option", async () => {
      const result = render(
        <TextInput prefix={{ options: PREFIX_OPTIONS, defaultValue: "+44" }} />,
      );

      const trigger = result.getByRole("combobox");
      expect(trigger).toHaveTextContent("+44");

      const items = await openPrefix(trigger);
      expect(items[1]).toHaveAttribute("data-selected");
      expect(items[0]).not.toHaveAttribute("data-selected");
      expect(items[2]).not.toHaveAttribute("data-selected");
    });

    test("prefix value is controlled when supplied", async () => {
      const onChange = vi.fn();
      const props = { options: PREFIX_OPTIONS, onChange };
      const result = render(<TextInput prefix={{ ...props, value: "+1" }} />);

      const trigger = result.getByRole("combobox");
      const items = await openPrefix(trigger);
      await userEvent.click(items[2]!);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledExactlyOnceWith("+51");
      });
    });

    test("prefix ariaLabel is applied to the trigger", () => {
      const result = render(
        <TextInput
          prefix={{ options: PREFIX_OPTIONS, ariaLabel: "Area code" }}
        />,
      );

      expect(
        result.getByRole("combobox", { name: "Area code" }),
      ).not.toBeNull();
    });

    test("prefix chip reflects the open state", async () => {
      const result = render(<TextInput prefix={{ options: PREFIX_OPTIONS }} />);

      const trigger = result.getByRole("combobox");
      expect(trigger).toHaveClass("vesper-chip-default");
      expect(trigger).not.toHaveClass("vesper-chip-selected");

      await openPrefix(trigger);

      await waitFor(() => {
        expect(trigger).toHaveClass("vesper-chip-contrast");
        expect(trigger).toHaveClass("vesper-chip-selected");
      });
    });

    test("prefix opens with the keyboard and closes with Escape", async () => {
      const result = render(<TextInput prefix={{ options: PREFIX_OPTIONS }} />);

      const trigger = result.getByRole("combobox");
      trigger.focus();
      await userEvent.keyboard("{Enter}");
      await waitFor(() => {
        expect(trigger).toHaveAttribute("data-popup-open");
      });

      await userEvent.keyboard("{Escape}");
      await waitFor(() => {
        expect(trigger).not.toHaveAttribute("data-popup-open");
      });
    });

    test("prefix is usable when the input has a label", async () => {
      const result = render(
        <TextInput
          label="Phone number"
          id="phone-number"
          prefix={{ options: PREFIX_OPTIONS, ariaLabel: "Area code" }}
        />,
      );

      const trigger = result.getByRole("combobox");
      const items = await openPrefix(trigger);
      await userEvent.click(items[1]!);

      await waitFor(() => {
        expect(trigger).toHaveTextContent("+44");
      });
    });

    test("prefix is disabled when the input is disabled", async () => {
      const result = render(
        <TextInput disabled prefix={{ options: PREFIX_OPTIONS }} />,
      );

      const trigger = result.getByRole("combobox");
      expect(trigger).toBeDisabled();
      expect(trigger).toHaveClass("vesper-chip-disabled");

      fireEvent.pointerDown(trigger);
      fireEvent.click(trigger);
      expect(trigger).not.toHaveAttribute("data-popup-open");
      expect(document.querySelector(".vesper-select-content")).toBeNull();
    });

    test("prefix renders a hidden input", () => {
      const result = render(
        <TextInput
          name="phone-number"
          prefix={{
            options: PREFIX_LABELLED_OPTIONS,
            name: "area-code",
            defaultValue: "uk",
          }}
        />,
      );

      expect(
        result.container.querySelector("input[name='area-code']"),
      ).toHaveValue("uk");
    });

    test("prefix inherits required prop", () => {
      const result = render(
        <form>
          <TextInput
            required
            prefix={{ options: PREFIX_OPTIONS, name: "area-code" }}
          />
        </form>,
      );

      expect(
        result.container.querySelector("input[name='area-code']"),
      ).toBeRequired();
      expect(result.getByRole("textbox")).toBeRequired();
    });

    test("prefix inherits form prop", () => {
      const result = render(
        <>
          <form id="contact-form" />
          <TextInput
            form="contact-form"
            prefix={{ options: PREFIX_OPTIONS, name: "area-code" }}
          />
        </>,
      );

      expect(
        result.container.querySelector("input[name='area-code']"),
      ).toHaveAttribute("form", "contact-form");
    });

    test("portals the prefix dropdown into the closest dialog ancestor", async () => {
      const result = render(
        <dialog open data-testid="dialog">
          <TextInput prefix={{ options: PREFIX_OPTIONS }} />
        </dialog>,
      );

      await openPrefix(result.getByRole("combobox"));

      const content = document.querySelector(".vesper-select-content")!;
      expect(result.getByTestId("dialog").contains(content)).toBe(true);
    });
  });
});

describe("text-input [snapshot]", () => {
  SNAPSHOT_CASES.forEach((permutation) => {
    const { name, ...props } = permutation;

    test(name, () => {
      const { container } = render(<TextInput {...props} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

describe("text-input [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    A11Y_CASES.forEach((permutation) => {
      const { name, ...props } = permutation;
      const label = `wcag2aaa (${name}, ${theme})`;

      const testFn = async () => {
        const { container } = render(<TextInput {...props} />);
        expect(await axe.run(container.firstChild!)).toHaveNoViolations();
      };

      const failsA11y = TEXT_INPUT_A11Y_FAILING_PERMUTATIONS.some(
        (p) =>
          p.variant === props.variant &&
          p.disabled === props.disabled &&
          p.theme === theme,
      );

      if (failsA11y) test.todo(label, testFn);
      else test(label, testFn);
    });

    [false, true].forEach((disabled) => {
      const name = disabled ? "with prefix, disabled" : "with prefix";

      const testFn = async () => {
        const { container } = render(
          <TextInput
            label="Phone number"
            disabled={disabled}
            prefix={{
              options: PREFIX_OPTIONS,
              ariaLabel: "Area code",
              defaultValue: "+1",
            }}
          />,
        );
        expect(await axe.run(container.firstChild!)).toHaveNoViolations();
      };

      // the prefix trigger renders `aria-pressed` (supplied by `Chip`) next to
      // the `role="combobox"` applied by the underlying Base UI select trigger,
      // which axe flags as an `aria-allowed-attr` violation
      test.todo(`wcag2aaa (${name}, ${theme})`, testFn);
    });
  });
});
