import { cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { Close, Globe, Search } from "@/components/icons/icons";
import {
  TEXT_INPUT_SIZES,
  TEXT_INPUT_VARIANTS,
  TextInput,
  TextInputProps,
} from "@/components/text-input/text-input";

import "@/styles/test.css";

type TextInputPermutation = TextInputProps & { permutationName: string };

const TEXT_INPUT_PERMUTATIONS: TextInputPermutation[] =
  TEXT_INPUT_SIZES.flatMap((size) =>
    TEXT_INPUT_VARIANTS.flatMap((variant) => [
      {
        permutationName: `${size}, ${variant}`,
        size,
        variant,
        defaultValue: "banana",
        "aria-label": "Label",
      },
      {
        permutationName: `${size}, ${variant}, disabled`,
        size,
        variant,
        disabled: true,
        "aria-label": "Label",
      },
      {
        permutationName: `${size}, ${variant}, full options`,
        size,
        variant,
        defaultValue: "banana",
        placeholder: "Placeholder text",
        name: "field-name",
        iconLeft: <Search />,
        iconRight: <Close />,
        "aria-label": "Label",
      },
    ]),
  );

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

      const inputWrapper = result.container.querySelector(".vesper-text-input");
      expect(inputWrapper).toHaveClass(`vesper-text-input-${variant}`);
    });
  });

  TEXT_INPUT_SIZES.forEach((size) => {
    test(`${size} size`, () => {
      const result = render(<TextInput size={size} />);

      const inputWrapper = result.container.querySelector(".vesper-text-input");
      expect(inputWrapper).toHaveClass(`vesper-text-input-${size}`);
    });
  });

  test("disabled prop disables input", () => {
    const result = render(<TextInput disabled />);
    expect(result.getByRole("textbox")).toBeDisabled();
  });

  test("the id prop is forwarded to the input", () => {
    const result = render(<TextInput id="email-input" />);

    expect(result.getByRole("textbox")).toHaveAttribute("id", "email-input");
  });

  test("renders an icon to the left when provided", () => {
    const clickHandler = vi.fn();
    const result = render(
      <TextInput
        iconLeft={<Globe data-testid="search-icon" />}
        iconLeftAction={{ handler: clickHandler, ariaLabel: "Search" }}
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
        iconRightAction={{ handler: clickHandler, ariaLabel: "Search" }}
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
        iconRightAction={{
          handler: rightIconClickHandler,
          ariaLabel: "Search",
        }}
        iconLeftAction={{ handler: leftIconClickHandler, ariaLabel: "Close" }}
        disabled
      />,
    );

    const [leftIconButton, rightIconButton] = result.getAllByRole("button");
    expect(leftIconButton).toBeDisabled();
    expect(rightIconButton).toBeDisabled();
  });

  test("additional prop passthrough", () => {
    const result = render(
      <TextInput aria-label="custom label" data-testid="foo" />,
    );

    const wrapper = result.container.firstChild;
    expect(wrapper).toHaveAttribute("data-testid", "foo");

    const input = result.getByRole("textbox");
    expect(input).toHaveAttribute("aria-label", "custom label");
  });

  test("custom className", () => {
    const result = render(
      <TextInput size="lg" variant="default" className="custom-class" />,
    );

    const el = result.container.firstChild;
    expect(el).toHaveClass("custom-class");
  });
});

describe("text-input [snapshot]", () => {
  TEXT_INPUT_PERMUTATIONS.forEach((permutation) => {
    const { permutationName, ...props } = permutation;

    test(permutationName, () => {
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

    TEXT_INPUT_PERMUTATIONS.forEach((permutation) => {
      const { permutationName, ...props } = permutation;

      test(`wcag2aaa (${permutationName}, ${theme})`, async () => {
        const { container } = render(<TextInput {...props} />);
        expect(await axe.run(container.firstChild!)).toHaveNoViolations();
      });
    });
  });
});
