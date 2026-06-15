import {
  render,
  within,
  cleanup,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import axe from "axe-core";

import { Menu, type MenuItemProps } from "@/components/menu/menu";
import { Blackhole, Globe, Tenstorrent } from "@/components/icons/icons";
import { TextButton } from "@/components/text-button/text-button";

import "@/styles/styles.css";
import { userEvent } from "vitest/browser";

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
  it("opens when the trigger is clicked in a closed state", async () => {
    const result = render(
      <Menu items={MENU_ITEMS} defaultOpen={false}>
        <TextButton>trigger</TextButton>
      </Menu>,
    );

    await userEvent.click(within(result.container).getByRole("button"));
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
