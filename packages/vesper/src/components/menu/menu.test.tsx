import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react";
import axe from "axe-core";
import { createRef, type ReactElement, type ReactNode } from "react";
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

import { IconButton } from "@/components/icon-button/icon-button";
import {
  Blackhole,
  Ellipses,
  Globe,
  Tenstorrent,
} from "@/components/icons/icons";
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
 * children of every shape, which are all rendered as the content of the
 * trigger (never as the trigger itself)
 */
const TRIGGER_CHILDREN: {
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
    name: "single element",
    children: <span>trigger</span>,
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
  render: (open: boolean) => ReactElement;
}[] = [
  {
    name: "default trigger",
    render: (open) => (
      <Menu items={MENU_ITEMS} open={open}>
        trigger
      </Menu>
    ),
  },
  {
    name: "as TextButton",
    render: (open) => (
      <Menu as={TextButton} variant="contrast" items={MENU_ITEMS} open={open}>
        trigger
      </Menu>
    ),
  },
  {
    name: "as IconButton",
    render: (open) => (
      <Menu
        as={IconButton}
        icon={<Ellipses />}
        aria-label="More actions"
        items={MENU_ITEMS}
        open={open}
      />
    ),
  },
];

afterEach(cleanup);

describe("menu [unit]", () => {
  test("clicking non-disabled menu item", async () => {
    render(
      <Menu as={TextButton} items={MENU_ITEMS} defaultOpen>
        trigger
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
        <Menu as={TextButton} items={MENU_ITEMS} defaultOpen>
          trigger
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
      <Menu as={TextButton} items={MENU_ITEMS} defaultOpen>
        trigger
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
      <Menu as={TextButton} items={MENU_ITEMS} width={300} defaultOpen>
        trigger
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
      <Menu as={TextButton} items={items} defaultOpen>
        trigger
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
      <Menu as={TextButton} items={items} defaultOpen>
        trigger
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
      <Menu as={TextButton} items={items} defaultOpen>
        trigger
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
      <Menu as={TextButton} items={MENU_ITEMS} defaultOpen>
        trigger
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
            <Menu as={TextButton} items={MENU_ITEMS} defaultOpen>
              trigger
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
      <Menu
        as={TextButton}
        items={MENU_ITEMS}
        defaultOpen
        container={container}
      >
        trigger
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
        <Menu
          as={TextButton}
          items={MENU_ITEMS}
          defaultOpen
          container={container}
        >
          trigger
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
          <Menu as={TextButton} items={items} defaultOpen>
            trigger
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

    TRIGGER_CHILDREN.forEach(({ name, children, textContent }) => {
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

  describe("polymorphism", () => {
    test("renders the `as` component as the trigger", () => {
      const result = render(
        <Menu as={TextButton} items={MENU_ITEMS}>
          trigger
        </Menu>,
      );

      // the `as` component is the trigger, so there is no wrapping (nested) button
      const [trigger, ...otherButtons] = within(result.container).getAllByRole(
        "button",
      );

      expect(otherButtons).toHaveLength(0);
      expect(result.container.firstChild).toBe(trigger);
      expect(trigger).toHaveClass("vesper-text-button");
      expect(trigger).toHaveTextContent("trigger");
      expect(trigger).toHaveAttribute("aria-haspopup", "menu");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    test("forwards props to the `as` component", async () => {
      const onClick = vi.fn();

      const result = render(
        <Menu
          as={TextButton}
          items={MENU_ITEMS}
          variant="danger"
          className="custom-class"
          aria-label="Actions"
          onClick={onClick}
        >
          trigger
        </Menu>,
      );

      const trigger = within(result.container).getByRole("button");
      expect(trigger).toHaveClass(
        "vesper-text-button",
        "vesper-text-button-danger",
        "custom-class",
      );
      expect(trigger).toHaveAttribute("aria-label", "Actions");

      await userEvent.click(trigger);
      expect(onClick).toHaveBeenCalledTimes(1);
      await waitFor(() =>
        expect(document.querySelector(".vesper-menu")).not.toBeNull(),
      );
    });

    test("forwards ref to the `as` component", () => {
      const ref = createRef<HTMLButtonElement>();

      const result = render(
        <Menu as={TextButton} items={MENU_ITEMS} ref={ref}>
          trigger
        </Menu>,
      );

      const trigger = within(result.container).getByRole("button");
      expect(ref.current).toBe(trigger);
    });
  });
});

describe("menu [snapshot]", () => {
  test("closed", () => {
    render(
      <Menu as={TextButton} items={MENU_ITEMS} open={false}>
        trigger
      </Menu>,
    );

    expect(document.querySelector(".vesper-menu")).toMatchSnapshot();
  });

  test("open", async () => {
    render(
      <Menu as={TextButton} items={MENU_ITEMS} open>
        trigger
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

  test("trigger (as)", () => {
    const result = render(
      <Menu as={TextButton} items={MENU_ITEMS} open={false}>
        trigger
      </Menu>,
    );

    expect(result.container).toMatchSnapshot();
  });
});

describe("menu [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty(
        "background",
        "var(--vesper-color-stone-0)",
      );
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    A11Y_PERMUTATIONS.forEach(({ name, render: renderMenu }) => {
      test(`a11y (open, ${name})`, async () => {
        const result = render(renderMenu(true));

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
        const result = render(renderMenu(false));

        expect(
          await axe.run(result.container.ownerDocument),
        ).toHaveNoViolations();
      });
    });
  });
});
