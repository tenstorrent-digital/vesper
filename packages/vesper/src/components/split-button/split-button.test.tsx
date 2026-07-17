import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { Blackhole, Globe, Tenstorrent } from "@/components/icons/icons";
import { MenuItemProps } from "@/components/menu/menu";
import {
  SPLIT_BUTTON_SIZES,
  SPLIT_BUTTON_VARIANTS,
  SplitButton,
  type SplitButtonProps,
} from "@/components/split-button/split-button";

import "@/styles/test.css";

const MENU_ITEMS: MenuItemProps[] = [
  {
    text: "Label",
    description: "The description",
    icon: <Tenstorrent />,
    style: "default",
    onSelect() {},
  },
  {
    text: "Label",
    description: "The description",
    icon: <Globe />,
    style: "selected",
    onSelect() {},
  },
  {
    text: "Label",
    description: "The description",
    icon: <Blackhole />,
    style: "danger",
    onSelect() {},
  },
  {
    text: "Label",
    description: "The description",
    style: "locked",
    onSelect() {},
  },
  {
    text: "Label",
    description: "The description",
    style: "disabled",
    onSelect() {},
  },
];

const SPLIT_BUTTON_PERMUTATIONS = SPLIT_BUTTON_VARIANTS.flatMap((variant) =>
  SPLIT_BUTTON_SIZES.flatMap((size): SplitButtonProps[] => [
    { size, variant, disabled: false, menuItems: MENU_ITEMS, menuOpen: false },
    { size, variant, disabled: false, menuItems: MENU_ITEMS, menuOpen: true },
    { size, variant, disabled: true, menuItems: MENU_ITEMS, menuOpen: false },
    { size, variant, disabled: true, menuItems: MENU_ITEMS, menuOpen: true },
  ]),
);

afterEach(cleanup);

describe("split-button [unit]", () => {
  test("clicking action button", async () => {
    const onClick = vi.fn();
    const result = render(
      <SplitButton onClick={onClick} menuItems={MENU_ITEMS}>
        button text
      </SplitButton>,
    );

    const [actionButton] = within(result.container).getAllByRole("button");
    actionButton?.click();
    expect(onClick).toHaveBeenCalled();
    expect(document.querySelector(".vesper-menu")).toBeNull();
  });

  test("clicking disabled action button", async () => {
    const onClick = vi.fn();
    const result = render(
      <SplitButton disabled onClick={onClick} menuItems={MENU_ITEMS}>
        button text
      </SplitButton>,
    );

    const [actionButton] = within(result.container).getAllByRole("button");
    actionButton?.click();
    expect(onClick).not.toHaveBeenCalled();
  });

  test("clicking menu button", () => {
    const result = render(
      <SplitButton menuItems={MENU_ITEMS}>button text</SplitButton>,
    );

    const [, menuButton] = within(result.container).getAllByRole("button");
    fireEvent.pointerDown(menuButton!);
    expect(document.querySelector(".vesper-menu")).not.toBeNull();
  });

  test("clicking disabled menu button", async () => {
    const result = render(
      <SplitButton disabled menuItems={MENU_ITEMS}>
        button text
      </SplitButton>,
    );

    const [, menuButton] = within(result.container).getAllByRole("button");
    fireEvent.pointerDown(menuButton!);
    expect(document.querySelector(".vesper-menu")).toBeNull();
  });

  test("clicking menu item", async () => {
    render(
      <SplitButton menuItems={MENU_ITEMS} defaultMenuOpen>
        button text
      </SplitButton>,
    );

    await userEvent.click(
      document.querySelector(".vesper-menu-item:not([data-disabled])")!,
    );
    expect(document.querySelector(".vesper-menu")).toBeNull();
  });

  test("pointerdown outside menu when open", async () => {
    const result = render(
      <>
        <SplitButton menuItems={MENU_ITEMS} defaultMenuOpen>
          button text
        </SplitButton>
        <span data-testid="non-menu-element" />
      </>,
    );

    await waitFor(() =>
      expect(document.querySelector(".vesper-menu-item")).not.toBeNull(),
    );
    fireEvent.pointerDown(
      within(result.container).getByTestId("non-menu-element"),
    );
    await waitFor(() =>
      expect(document.querySelector(".vesper-menu")).toBeNull(),
    );
  });

  test("closing via Escape key", async () => {
    render(
      <SplitButton menuItems={MENU_ITEMS} defaultMenuOpen>
        button text
      </SplitButton>,
    );

    await waitFor(() =>
      expect(document.querySelector(".vesper-menu")).not.toBeNull(),
    );
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(document.querySelector(".vesper-menu")).toBeNull(),
    );
  });

  test("menuButtonAriaLabel", () => {
    const result = render(
      <SplitButton menuItems={MENU_ITEMS} menuButtonAriaLabel="Open options">
        button text
      </SplitButton>,
    );

    const [, menuButton] = within(result.container).getAllByRole("button");
    expect(menuButton).toHaveAttribute("aria-label", "Open options");
  });

  test("custom menu width", async () => {
    render(
      <SplitButton menuItems={MENU_ITEMS} menuWidth={300} defaultMenuOpen>
        button text
      </SplitButton>,
    );

    await waitFor(() =>
      expect(document.querySelector(".vesper-menu")).not.toBeNull(),
    );
    expect(document.querySelector(".vesper-menu")).toHaveStyle("width: 300px;");
  });
});

describe("split-button [snapshot]", () => {
  SPLIT_BUTTON_PERMUTATIONS.forEach((permutation) => {
    const { disabled, variant, size, menuOpen } = permutation;
    const testName =
      ["wcag2aaa (" + variant, size, disabled && "disabled", menuOpen && "open"]
        .filter(Boolean)
        .join(", ") + ")";

    test(testName, () => {
      const result = render(
        <SplitButton {...permutation}>button text</SplitButton>,
      );
      expect(result.container).toMatchSnapshot();
    });
  });
});

const SPLIT_BUTTON_A11Y_FAILING_PERMUTATIONS: {
  variant: (typeof SPLIT_BUTTON_VARIANTS)[number];
  theme: string;
}[] = [
  { variant: "subtle", theme: "light" },
  { variant: "contrast", theme: "light" },
  { variant: "subtle", theme: "dark" },
  { variant: "contrast", theme: "dark" },
];

describe("split-button [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    SPLIT_BUTTON_PERMUTATIONS.forEach((permutation) => {
      const { disabled, variant, size, menuOpen } = permutation;
      const testName = [
        "wcag2aaa (" + variant,
        size,
        disabled && "disabled",
        menuOpen && "open",
        theme + ")",
      ]
        .filter(Boolean)
        .join(", ");

      const testFn = async () => {
        const result = render(
          <SplitButton {...permutation}>button text</SplitButton>,
        );

        expect(
          await axe.run(result.container.ownerDocument),
        ).toHaveNoViolations();
      };

      const failsA11y = SPLIT_BUTTON_A11Y_FAILING_PERMUTATIONS.some(
        (p) => p.variant === variant && p.theme === theme,
      );

      if (failsA11y) test.todo(testName, testFn);
      else test(testName, testFn);
    });
  });
});
