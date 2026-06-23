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

import { SplitButton } from "@/components/split-button/split-button";
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

  test("keydown on action button does not open menu", async () => {
    const result = render(
      <SplitButton menuItems={MENU_ITEMS}>button text</SplitButton>,
    );

    const [actionButton] = within(result.container).getAllByRole("button");
    fireEvent.keyDown(actionButton!, { key: "Enter" });
    expect(document.querySelector(".vesper-menu")).toBeNull();
  });
});

describe("split-button [snapshot]", () => {
  // 1 case for each variant
  test("variant: subtle", () => {
    const result = render(
      <SplitButton variant="subtle" size="md" menuItems={MENU_ITEMS}>
        button text
      </SplitButton>,
    );
    expect(result.container).toMatchSnapshot();
  });

  test("variant: contrast", () => {
    const result = render(
      <SplitButton variant="contrast" size="md" menuItems={MENU_ITEMS}>
        button text
      </SplitButton>,
    );
    expect(result.container).toMatchSnapshot();
  });

  // 1 case for each size
  test("size: sm", () => {
    const result = render(
      <SplitButton variant="subtle" size="sm" menuItems={MENU_ITEMS}>
        button text
      </SplitButton>,
    );
    expect(result.container).toMatchSnapshot();
  });

  test("size: md", () => {
    const result = render(
      <SplitButton variant="subtle" size="md" menuItems={MENU_ITEMS}>
        button text
      </SplitButton>,
    );
    expect(result.container).toMatchSnapshot();
  });

  test("size: lg", () => {
    const result = render(
      <SplitButton variant="subtle" size="lg" menuItems={MENU_ITEMS}>
        button text
      </SplitButton>,
    );
    expect(result.container).toMatchSnapshot();
  });

  // 1 case for disabled
  test("disabled", () => {
    const result = render(
      <SplitButton variant="subtle" size="md" menuItems={MENU_ITEMS} disabled>
        button text
      </SplitButton>,
    );
    expect(result.container).toMatchSnapshot();
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

    // 1 case for each variant
    test(`wcag2aaa (variant: subtle, ${theme})`, async () => {
      const result = render(
        <SplitButton variant="subtle" size="md" menuItems={MENU_ITEMS}>
          button text
        </SplitButton>,
      );

      expect(
        await axe.run(result.container.ownerDocument, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (variant: subtle, open, ${theme})`);

    test(`wcag2aaa (variant: contrast, ${theme})`, async () => {
      const result = render(
        <SplitButton variant="contrast" size="md" menuItems={MENU_ITEMS}>
          button text
        </SplitButton>,
      );

      expect(
        await axe.run(result.container.ownerDocument, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (variant: contrast, open, ${theme})`);

    // 1 case for each size
    test(`wcag2aaa (size: sm, ${theme})`, async () => {
      const result = render(
        <SplitButton variant="subtle" size="sm" menuItems={MENU_ITEMS}>
          button text
        </SplitButton>,
      );

      expect(
        await axe.run(result.container.ownerDocument, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (size: sm, open, ${theme})`);

    test(`wcag2aaa (size: md, ${theme})`, async () => {
      const result = render(
        <SplitButton variant="subtle" size="md" menuItems={MENU_ITEMS}>
          button text
        </SplitButton>,
      );

      expect(
        await axe.run(result.container.ownerDocument, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (size: md, open, ${theme})`);

    test(`wcag2aaa (size: lg, ${theme})`, async () => {
      const result = render(
        <SplitButton variant="subtle" size="lg" menuItems={MENU_ITEMS}>
          button text
        </SplitButton>,
      );

      expect(
        await axe.run(result.container.ownerDocument, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (size: lg, open, ${theme})`);

    // 1 case for disabled
    test(`wcag2aaa (disabled, ${theme})`, async () => {
      const result = render(
        <SplitButton variant="subtle" size="md" menuItems={MENU_ITEMS} disabled>
          button text
        </SplitButton>,
      );

      expect(
        await axe.run(result.container.ownerDocument, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test.todo(`wcag2aaa (disabled, open, ${theme})`);
  });
});
