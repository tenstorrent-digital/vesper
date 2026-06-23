import {
  render,
  within,
  cleanup,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import axe from "axe-core";

import {
  SplitButton,
  SPLIT_BUTTON_SIZES,
  SPLIT_BUTTON_VARIANTS,
  type SplitButtonProps,
} from "@/components/split-button/split-button";
import { MenuItemProps } from "@/components/menu/menu";
import { Blackhole, Globe, Tenstorrent } from "@/components/icons/icons";

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
    { size, variant, disabled: false, menuItems: MENU_ITEMS },
    { size, variant, disabled: true, menuItems: MENU_ITEMS },
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
    const { disabled, variant, size } = permutation;

    test(`${variant}, ${size}${disabled ? ", disabled" : ""}`, () => {
      const result = render(
        <SplitButton {...permutation}>button text</SplitButton>,
      );
      expect(result.container).toMatchSnapshot();
    });
  });
});

describe("split-button [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    SPLIT_BUTTON_PERMUTATIONS.forEach((permutation) => {
      const { disabled, variant, size } = permutation;

      test(`wcag2aaa (${variant}, ${size},${disabled ? " disabled," : ""} ${theme})`, async () => {
        const result = render(
          <SplitButton {...permutation}>button text</SplitButton>,
        );

        expect(
          await axe.run(result.container.ownerDocument, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test.todo(`wcag2aaa (${variant}, ${size},${disabled ? " disabled," : ""} ${theme}, open)`);
    });
  });
});
