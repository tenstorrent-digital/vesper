import {
  render,
  within,
  cleanup,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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

import "@/styles/styles.css";

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
  it("fires onClick when the action button is clicked", async () => {
    const onClick = vi.fn();
    const result = render(
      <SplitButton onClick={onClick} menuItems={MENU_ITEMS}>
        button text
      </SplitButton>,
    );

    const [actionButton] = within(result.container).getAllByRole("button");
    actionButton?.click();
    expect(onClick).toHaveBeenCalled();
  });

  it("does not fire onClick when disabled", async () => {
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

  it("does not open the menu when action button is clicked", async () => {
    const result = render(
      <SplitButton menuItems={MENU_ITEMS}>button text</SplitButton>,
    );

    const [actionButton] = within(result.container).getAllByRole("button");
    actionButton?.click();
    expect(document.querySelector(".vesper-menu")).toBeNull();
  });

  it("does not open the menu when disabled and the menu button is clicked", async () => {
    const result = render(
      <SplitButton disabled menuItems={MENU_ITEMS}>
        button text
      </SplitButton>,
    );

    const [, menuButton] = within(result.container).getAllByRole("button");
    fireEvent.pointerDown(menuButton!);
    expect(document.querySelector(".vesper-menu")).toBeNull();
  });

  it("opens the menu when the menu button is clicked in a closed state", () => {
    const result = render(
      <SplitButton menuItems={MENU_ITEMS}>button text</SplitButton>,
    );

    const [, menuButton] = within(result.container).getAllByRole("button");
    fireEvent.pointerDown(menuButton!);
    expect(document.querySelector(".vesper-menu")).not.toBeNull();
  });

  it("closes the menu when clicking a non-disabled menu item", async () => {
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

  it("closes the menu when pointerdown fires on anything outside the menu", async () => {
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

  it("closes the menu via Escape key", async () => {
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

  it("sets a custom menu width when provided", async () => {
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

    it(`renders correctly when size="${size}", variant="${variant}", disabled=${disabled}`, () => {
      const result = render(
        <SplitButton {...permutation}>button text</SplitButton>,
      );
      expect(result.container).toMatchSnapshot();
    });
  });
});

describe("split-button [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    describe(`${theme} mode`, () => {
      beforeEach(() => {
        document.documentElement.setAttribute("data-vesper-theme", theme);
      });

      afterEach(() => {
        document.documentElement.removeAttribute("data-vesper-theme");
      });

      SPLIT_BUTTON_PERMUTATIONS.forEach((permutation) => {
        const { disabled, variant, size } = permutation;

        it(`renders without wcag2aaa violations when closed and size="${size}", variant="${variant}", disabled=${disabled}`, async () => {
          const result = render(
            <SplitButton {...permutation}>button text</SplitButton>,
          );

          expect(
            await axe.run(result.container.ownerDocument, {
              runOnly: "wcag2aaa",
            }),
          ).toHaveNoViolations();
        });

        it(`renders without wcag2aaa violations when open and size="${size}", variant="${variant}", disabled=${disabled}`, async () => {
          const result = render(
            <SplitButton {...permutation} menuOpen>
              button text
            </SplitButton>,
          );

          await waitFor(() =>
            expect(document.querySelector(".vesper-menu")).not.toBeNull(),
          );

          expect(
            await axe.run(result.container.ownerDocument, {
              runOnly: "wcag2aaa",
            }),
          ).toHaveNoViolations();
        });
      });
    });
  });
});
