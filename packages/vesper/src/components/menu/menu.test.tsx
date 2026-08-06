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

  test("portals menu content into document.body", async () => {
    render(
      <Menu items={MENU_ITEMS} defaultOpen>
        <TextButton>trigger</TextButton>
      </Menu>,
    );

    await waitFor(() =>
      expect(document.querySelector(".vesper-menu")).not.toBeNull(),
    );

    const content = document.querySelector(".vesper-menu")!;
    expect(content.closest("dialog")).toBeNull();
    expect(document.body.contains(content)).toBe(true);
  });

  test("portals into the closest dialog ancestor", async () => {
    const result = render(
      <dialog open data-testid="dialog">
        <div>
          <div>
            <Menu items={MENU_ITEMS} defaultOpen>
              <TextButton>trigger</TextButton>
            </Menu>
          </div>
        </div>
      </dialog>,
    );

    const dialog = result.getByTestId("dialog");

    await waitFor(() =>
      expect(dialog.querySelector(".vesper-menu")).not.toBeNull(),
    );

    const content = document.querySelector(".vesper-menu")!;
    expect(dialog.contains(content)).toBe(true);
  });

  test("portals into the container prop", async () => {
    const container = document.createElement("div");
    document.body.append(container);

    render(
      <Menu items={MENU_ITEMS} defaultOpen container={container}>
        <TextButton>trigger</TextButton>
      </Menu>,
    );

    await waitFor(() =>
      expect(container.querySelector(".vesper-menu")).not.toBeNull(),
    );

    container.remove();
  });

  test("container prop takes precedence over the closest dialog ancestor", async () => {
    const container = document.createElement("div");
    document.body.append(container);

    const result = render(
      <dialog open data-testid="dialog">
        <Menu items={MENU_ITEMS} defaultOpen container={container}>
          <TextButton>trigger</TextButton>
        </Menu>
      </dialog>,
    );

    await waitFor(() =>
      expect(container.querySelector(".vesper-menu")).not.toBeNull(),
    );

    const dialog = result.getByTestId("dialog");
    expect(dialog.querySelector(".vesper-menu")).toBeNull();

    container.remove();
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
