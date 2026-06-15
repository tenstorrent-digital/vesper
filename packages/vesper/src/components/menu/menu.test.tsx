import {
  render,
  within,
  cleanup,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axe from "axe-core";
import { userEvent } from "vitest/browser";

import { Menu, type MenuItemProps } from "@/components/menu/menu";
import { Blackhole, Globe, Tenstorrent } from "@/components/icons/icons";
import { TextButton } from "@/components/text-button/text-button";

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

afterEach(cleanup);

describe("menu [unit]", () => {
  it("opens when the trigger is clicked in a closed state", () => {
    const result = render(
      <Menu items={MENU_ITEMS} defaultOpen={false}>
        <TextButton>trigger</TextButton>
      </Menu>,
    );

    fireEvent.pointerDown(within(result.container).getByRole("button"));
    expect(document.querySelector(".vesper-menu")).not.toBeNull();
  });

  it("closes when clicking a non-disabled menu item", async () => {
    render(
      <Menu items={MENU_ITEMS} defaultOpen>
        <TextButton>trigger</TextButton>
      </Menu>,
    );

    await userEvent.click(
      document.querySelector(".vesper-menu-item:not([data-disabled])")!,
    );
    expect(document.querySelector(".vesper-menu")).toBeNull();
  });

  it("closes when pointerdown fires on anything outside the menu", async () => {
    const result = render(
      <>
        <Menu items={MENU_ITEMS} defaultOpen>
          <TextButton>trigger</TextButton>
        </Menu>
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

  it("closes via Escape key", async () => {
    render(
      <Menu items={MENU_ITEMS} defaultOpen>
        <TextButton>trigger</TextButton>
      </Menu>,
    );

    await waitFor(() =>
      expect(document.querySelector(".vesper-menu")).not.toBeNull(),
    );
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(document.querySelector(".vesper-menu")).toBeNull(),
    );
  });

  it("sets a custom width when provided", async () => {
    render(
      <Menu items={MENU_ITEMS} width={300} defaultOpen>
        <TextButton>trigger</TextButton>
      </Menu>,
    );

    await waitFor(() =>
      expect(document.querySelector(".vesper-menu")).not.toBeNull(),
    );
    expect(document.querySelector(".vesper-menu")).toHaveStyle("width: 300px;");
  });

  it("fires onSelect when a menu item is clicked", async () => {
    const onSelect = vi.fn();
    const items: MenuItemProps[] = [
      { text: "Item", style: "default", onSelect },
    ];

    render(
      <Menu items={items} defaultOpen>
        <TextButton>trigger</TextButton>
      </Menu>,
    );

    await waitFor(() =>
      expect(document.querySelector(".vesper-menu-item")).not.toBeNull(),
    );
    await userEvent.click(document.querySelector(".vesper-menu-item")!);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("does not fire onSelect when a disabled item is clicked", async () => {
    const onSelect = vi.fn();
    const items: MenuItemProps[] = [
      { text: "Disabled Item", style: "disabled", onSelect },
    ];

    render(
      <Menu items={items} defaultOpen>
        <TextButton>trigger</TextButton>
      </Menu>,
    );

    await waitFor(() =>
      expect(document.querySelector(".vesper-menu-item")).not.toBeNull(),
    );
    (document.querySelector(".vesper-menu-item") as HTMLElement).click();
    expect(onSelect).not.toHaveBeenCalled();
    expect(document.querySelector(".vesper-menu")).not.toBeNull();
  });

  it("does not fire onSelect when a locked item is clicked", async () => {
    const onSelect = vi.fn();
    const items: MenuItemProps[] = [
      { text: "Locked Item", style: "locked", onSelect },
    ];

    render(
      <Menu items={items} defaultOpen>
        <TextButton>trigger</TextButton>
      </Menu>,
    );

    await waitFor(() =>
      expect(document.querySelector(".vesper-menu-item")).not.toBeNull(),
    );
    (document.querySelector(".vesper-menu-item") as HTMLElement).click();
    expect(onSelect).not.toHaveBeenCalled();
    expect(document.querySelector(".vesper-menu")).not.toBeNull();
  });

  (["default", "danger", "locked", "selected", "disabled"] as const).forEach(
    (style) => {
      it(`applies the correct class for item style "${style}"`, async () => {
        const items: MenuItemProps[] = [{ text: "Item", style, onSelect() {} }];

        render(
          <Menu items={items} defaultOpen>
            <TextButton>trigger</TextButton>
          </Menu>,
        );

        await waitFor(() =>
          expect(document.querySelector(".vesper-menu-item")).not.toBeNull(),
        );
        expect(document.querySelector(".vesper-menu-item")).toHaveClass(
          `vesper-menu-item-${style}`,
        );
      });
    },
  );
});

describe("menu [snapshot]", () => {
  it("renders correctly when closed", () => {
    render(
      <Menu items={MENU_ITEMS} open={false}>
        <TextButton>trigger</TextButton>
      </Menu>,
    );

    expect(document.querySelector(".vesper-menu")).toMatchSnapshot();
  });

  it("renders correctly when open", async () => {
    render(
      <Menu items={MENU_ITEMS} open>
        <TextButton>trigger</TextButton>
      </Menu>,
    );

    await waitFor(() =>
      expect(document.querySelector(".vesper-menu")).not.toBeNull(),
    );
    expect(document.querySelector(".vesper-menu")).toMatchSnapshot();
  });
});

describe("menu [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    describe(`${theme} mode`, () => {
      beforeEach(() => {
        document.documentElement.setAttribute("data-vesper-theme", theme);
      });

      afterEach(() => {
        document.documentElement.removeAttribute("data-vesper-theme");
      });

      it("renders without wcag2aaa violations when open", async () => {
        const result = render(
          <Menu items={MENU_ITEMS} open>
            <TextButton variant="contrast">trigger</TextButton>
          </Menu>,
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

      it("renders without wcag2aaa violations when closed", async () => {
        const result = render(
          <Menu items={MENU_ITEMS} open={false}>
            <TextButton variant="contrast">trigger</TextButton>
          </Menu>,
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
