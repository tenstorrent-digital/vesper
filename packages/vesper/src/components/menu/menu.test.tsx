import type { ReactElement } from "react";
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
import { Menu, type MenuItemProps } from "@/components/menu/menu";
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
  test("clicking trigger when closed", () => {
    const result = render(
      <Menu items={MENU_ITEMS} defaultOpen={false}>
        <TextButton>trigger</TextButton>
      </Menu>,
    );

    fireEvent.pointerDown(within(result.container).getByRole("button"));
    expect(document.querySelector(".vesper-menu")).not.toBeNull();
  });

  test("clicking non-disabled menu item", async () => {
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

  test("pointerdown outside menu when open", async () => {
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

  test("closing via Escape key", async () => {
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

  test("custom width", async () => {
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

  test("menu item onSelect", async () => {
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

  test("disabled menu item onSelect", async () => {
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

  test("locked menu item onSelect", async () => {
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

  test("nullable children do not render menu", () => {
    const result = render(<Menu items={MENU_ITEMS} open />);

    expect(result.container.innerHTML).toBe("");
    expect(document.querySelector(".vesper-menu")).toBeNull();
  });

  test("fragment children do not render menu", () => {
    const result = render(
      <Menu items={MENU_ITEMS} open>
        <>
          <TextButton>trigger</TextButton>
        </>
      </Menu>,
    );

    expect(within(result.container).getByRole("button")).not.toBeNull();
    expect(document.querySelector(".vesper-menu")).toBeNull();
  });

  test("non-element children do not render menu", () => {
    const result = render(
      <Menu items={MENU_ITEMS} open>
        plain text trigger
      </Menu>,
    );

    expect(result.container.innerHTML).toBe("plain text trigger");
    expect(document.querySelector(".vesper-menu")).toBeNull();
  });

  (["default", "danger", "locked", "selected", "disabled"] as const).forEach(
    (style) => {
      test(`menu item ${style} class`, async () => {
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
  test("closed", () => {
    render(
      <Menu items={MENU_ITEMS} open={false}>
        <TextButton>trigger</TextButton>
      </Menu>,
    );

    expect(document.querySelector(".vesper-menu")).toMatchSnapshot();
  });

  test("open", async () => {
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
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    test.todo("a11y (open)", async () => {
      const result = render(
        <Menu items={MENU_ITEMS} open>
          <TextButton variant="contrast">trigger</TextButton>
        </Menu>,
      );

      await waitFor(() =>
        expect(document.querySelector(".vesper-menu")).not.toBeNull(),
      );

      expect(
        await axe.run(result.container.ownerDocument),
      ).toHaveNoViolations();
    });

    test("a11y (closed)", async () => {
      const result = render(
        <Menu items={MENU_ITEMS} open={false}>
          <TextButton variant="contrast">trigger</TextButton>
        </Menu>,
      );

      expect(
        await axe.run(result.container.ownerDocument),
      ).toHaveNoViolations();
    });
  });
});
