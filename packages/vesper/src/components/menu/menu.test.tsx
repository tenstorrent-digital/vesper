import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react";
import axe from "axe-core";
import { createRef, type ReactNode } from "react";
import {
  afterEach,
  assert,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
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

/**
 * children that are not a single react element, which can't be rendered as
 * the trigger itself (even when `asChild` is set)
 */
const NON_ELEMENT_CHILDREN: {
  name: string;
  children: ReactNode;
  textContent: string;
}[] = [
  { name: "nullable", children: undefined, textContent: "" },
  {
    name: "plain text",
    children: "plain text trigger",
    textContent: "plain text trigger",
  },
  {
    name: "fragment",
    children: (
      <>
        <span>trigger</span>
      </>
    ),
    textContent: "trigger",
  },
  {
    name: "multiple element",
    children: [
      <span key="first">first</span>,
      <span key="second">second</span>,
    ],
    textContent: "firstsecond",
  },
];

const A11Y_PERMUTATIONS: {
  name: string;
  asChild?: boolean;
  children: ReactNode;
}[] = [
  { name: "default trigger", children: "trigger" },
  {
    name: "asChild",
    asChild: true,
    children: <TextButton variant="contrast">trigger</TextButton>,
  },
];

afterEach(cleanup);

describe("menu [unit]", () => {
  test("clicking non-disabled menu item", async () => {
    render(
      <Menu items={MENU_ITEMS} defaultOpen asChild>
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
        <Menu items={MENU_ITEMS} defaultOpen asChild>
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
      <Menu items={MENU_ITEMS} defaultOpen asChild>
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
      <Menu items={MENU_ITEMS} width={300} defaultOpen asChild>
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
      <Menu items={items} defaultOpen asChild>
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
      <Menu items={items} defaultOpen asChild>
        <TextButton>trigger</TextButton>
      </Menu>,
    );

    await waitFor(() =>
      expect(document.querySelector(".vesper-menu-item")).not.toBeNull(),
    );
    const menuItem = document.querySelector(".vesper-menu-item");
    assert.instanceOf(menuItem, HTMLElement);
    menuItem.click();
    expect(onSelect).not.toHaveBeenCalled();
    expect(document.querySelector(".vesper-menu")).not.toBeNull();
  });

  test("locked menu item onSelect", async () => {
    const onSelect = vi.fn();
    const items: MenuItemProps[] = [
      { text: "Locked Item", style: "locked", onSelect },
    ];

    render(
      <Menu items={items} defaultOpen asChild>
        <TextButton>trigger</TextButton>
      </Menu>,
    );

    await waitFor(() =>
      expect(document.querySelector(".vesper-menu-item")).not.toBeNull(),
    );
    const menuItem = document.querySelector(".vesper-menu-item");
    assert.instanceOf(menuItem, HTMLElement);
    menuItem.click();
    expect(onSelect).not.toHaveBeenCalled();
    expect(document.querySelector(".vesper-menu")).not.toBeNull();
  });

  test("portals menu content into document.body", async () => {
    render(
      <Menu items={MENU_ITEMS} defaultOpen asChild>
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
            <Menu items={MENU_ITEMS} defaultOpen asChild>
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
      <Menu items={MENU_ITEMS} defaultOpen container={container} asChild>
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
        <Menu items={MENU_ITEMS} defaultOpen container={container} asChild>
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
          <Menu items={items} defaultOpen asChild>
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

  describe("default trigger", () => {
    test("renders a button trigger wrapping its children", () => {
      const result = render(
        <Menu items={MENU_ITEMS}>
          <span data-testid="child">trigger</span>
        </Menu>,
      );

      const trigger = result.container.firstChild;
      const child = result.getByTestId("child");

      assert.instanceOf(trigger, HTMLButtonElement);
      expect(trigger).toHaveAttribute("type", "button");
      expect(trigger).toHaveAttribute("aria-haspopup", "menu");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).toContainElement(child);
      expect(child).not.toHaveAttribute("aria-haspopup");
    });

    test("clicking the trigger opens the menu", async () => {
      const result = render(<Menu items={MENU_ITEMS}>trigger</Menu>);

      const trigger = within(result.container).getByRole("button");
      await userEvent.click(trigger);

      await waitFor(() =>
        expect(document.querySelector(".vesper-menu")).not.toBeNull(),
      );
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    test("forwards props to the trigger", async () => {
      const onClick = vi.fn();

      const result = render(
        <Menu
          items={MENU_ITEMS}
          className="custom-class"
          aria-label="Actions"
          data-testid="trigger"
          onClick={onClick}
        >
          ...
        </Menu>,
      );

      const trigger = result.getByTestId("trigger");
      assert.instanceOf(trigger, HTMLButtonElement);
      expect(trigger).toHaveClass("custom-class");
      expect(trigger).toHaveAttribute("aria-label", "Actions");

      await userEvent.click(trigger);
      expect(onClick).toHaveBeenCalledTimes(1);
      await waitFor(() =>
        expect(document.querySelector(".vesper-menu")).not.toBeNull(),
      );
    });

    test("forwards ref to the trigger", () => {
      const ref = createRef<HTMLButtonElement>();

      const result = render(
        <Menu items={MENU_ITEMS} ref={ref}>
          trigger
        </Menu>,
      );

      assert.instanceOf(ref.current, HTMLButtonElement);
      expect(ref.current).toBe(result.container.firstChild);
    });

    test("portals into the closest dialog ancestor", async () => {
      const result = render(
        <dialog open data-testid="dialog">
          <Menu items={MENU_ITEMS} defaultOpen>
            trigger
          </Menu>
        </dialog>,
      );

      const dialog = result.getByTestId("dialog");

      await waitFor(() =>
        expect(dialog.querySelector(".vesper-menu")).not.toBeNull(),
      );
    });

    NON_ELEMENT_CHILDREN.forEach(({ name, children, textContent }) => {
      test(`renders ${name} children inside the trigger`, async () => {
        const result = render(
          <Menu items={MENU_ITEMS} open>
            {children}
          </Menu>,
        );

        // an open menu renders focus guards around the trigger, so the trigger
        // is not necessarily the first child of the container
        const buttons = result.container.querySelectorAll("button");
        expect(buttons).toHaveLength(1);

        const trigger = buttons[0];
        assert.instanceOf(trigger, HTMLButtonElement);
        expect(trigger.textContent).toBe(textContent);
        expect(trigger).toHaveAttribute("aria-haspopup", "menu");

        await waitFor(() =>
          expect(document.querySelector(".vesper-menu")).not.toBeNull(),
        );
      });
    });
  });

  describe("asChild", () => {
    test("renders the child as the trigger", () => {
      const result = render(
        <Menu items={MENU_ITEMS} asChild>
          <TextButton>trigger</TextButton>
        </Menu>,
      );

      // the child is the trigger, so there is no wrapping (nested) button
      const [trigger, ...otherButtons] = within(result.container).getAllByRole(
        "button",
      );

      expect(otherButtons).toHaveLength(0);
      expect(result.container.firstChild).toBe(trigger);
      expect(trigger).toHaveClass("vesper-text-button");
      expect(trigger).toHaveAttribute("aria-haspopup", "menu");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    test("clicking the child opens the menu", async () => {
      const result = render(
        <Menu items={MENU_ITEMS} asChild>
          <TextButton>trigger</TextButton>
        </Menu>,
      );

      const trigger = within(result.container).getByRole("button");
      await userEvent.click(trigger);

      await waitFor(() =>
        expect(document.querySelector(".vesper-menu")).not.toBeNull(),
      );
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    test("merges props with the child's props", async () => {
      const onClick = vi.fn();
      const onChildClick = vi.fn();

      const result = render(
        <Menu
          items={MENU_ITEMS}
          asChild
          className="menu-class"
          aria-label="Actions"
          onClick={onClick}
        >
          <TextButton className="child-class" onClick={onChildClick}>
            trigger
          </TextButton>
        </Menu>,
      );

      const trigger = within(result.container).getByRole("button");
      expect(trigger).toHaveClass(
        "vesper-text-button",
        "menu-class",
        "child-class",
      );
      expect(trigger).toHaveAttribute("aria-label", "Actions");

      await userEvent.click(trigger);
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onChildClick).toHaveBeenCalledTimes(1);
      await waitFor(() =>
        expect(document.querySelector(".vesper-menu")).not.toBeNull(),
      );
    });

    test("forwards ref to the child", () => {
      const ref = createRef<HTMLButtonElement>();
      const childRef = createRef<HTMLButtonElement>();

      const result = render(
        <Menu items={MENU_ITEMS} asChild ref={ref}>
          <TextButton ref={childRef}>trigger</TextButton>
        </Menu>,
      );

      const trigger = within(result.container).getByRole("button");
      expect(ref.current).toBe(trigger);
      expect(childRef.current).toBe(trigger);
    });

    NON_ELEMENT_CHILDREN.forEach(({ name, children, textContent }) => {
      test(`falls back to rendering ${name} children inside a button trigger`, async () => {
        const result = render(
          <Menu items={MENU_ITEMS} open asChild>
            {children}
          </Menu>,
        );

        // an open menu renders focus guards around the trigger, so the trigger
        // is not necessarily the first child of the container
        const buttons = result.container.querySelectorAll("button");
        expect(buttons).toHaveLength(1);

        const trigger = buttons[0];
        assert.instanceOf(trigger, HTMLButtonElement);
        expect(trigger.textContent).toBe(textContent);
        expect(trigger).toHaveAttribute("aria-haspopup", "menu");

        await waitFor(() =>
          expect(document.querySelector(".vesper-menu")).not.toBeNull(),
        );
      });
    });
  });
});

describe("menu [snapshot]", () => {
  test("closed", () => {
    render(
      <Menu items={MENU_ITEMS} open={false} asChild>
        <TextButton>trigger</TextButton>
      </Menu>,
    );

    expect(document.querySelector(".vesper-menu")).toMatchSnapshot();
  });

  test("open", async () => {
    render(
      <Menu items={MENU_ITEMS} open asChild>
        <TextButton>trigger</TextButton>
      </Menu>,
    );

    await waitFor(() =>
      expect(document.querySelector(".vesper-menu")).not.toBeNull(),
    );
    expect(document.querySelector(".vesper-menu")).toMatchSnapshot();
  });

  test("trigger", () => {
    const result = render(
      <Menu items={MENU_ITEMS} open={false}>
        trigger
      </Menu>,
    );

    expect(result.container).toMatchSnapshot();
  });

  test("trigger (asChild)", () => {
    const result = render(
      <Menu items={MENU_ITEMS} open={false} asChild>
        <TextButton>trigger</TextButton>
      </Menu>,
    );

    expect(result.container).toMatchSnapshot();
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

    A11Y_PERMUTATIONS.forEach(({ name, asChild, children }) => {
      test(`a11y (open, ${name})`, async () => {
        const result = render(
          <Menu items={MENU_ITEMS} open asChild={asChild}>
            {children}
          </Menu>,
        );

        await waitFor(() =>
          expect(document.querySelector(".vesper-menu")).not.toBeNull(),
        );

        // the menu content is portaled outside of the render container, so
        // a11y is checked at the document level
        //
        // the page-level `region` rule is disabled here: it flags content that
        // isn't contained by a landmark, which is an artifact of rendering a
        // component in isolation rather than a menu accessibility issue
        expect(
          await axe.run(result.container.ownerDocument, {
            rules: { region: { enabled: false } },
          }),
        ).toHaveNoViolations();
      });

      test(`a11y (closed, ${name})`, async () => {
        const result = render(
          <Menu items={MENU_ITEMS} open={false} asChild={asChild}>
            {children}
          </Menu>,
        );

        expect(
          await axe.run(result.container.ownerDocument),
        ).toHaveNoViolations();
      });
    });
  });
});
