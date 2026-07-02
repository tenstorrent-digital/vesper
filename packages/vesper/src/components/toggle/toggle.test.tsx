import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import axe from "axe-core";

import { Toggle, TOGGLE_SIZES } from "@/components/toggle/toggle";
import { Globe, Tenstorrent } from "@/components/icons/icons";

import "@/styles/test.css";

afterEach(cleanup);

describe("toggle [unit]", () => {
  TOGGLE_SIZES.forEach((size) => {
    test(`${size} size class`, () => {
      const { container } = render(
        <Toggle
          size={size}
          options={[
            { text: "Option A", value: "option-a" },
            { text: "Option B", value: "option-b" },
          ]}
        />,
      );
      expect(container.firstChild).toHaveClass(`vesper-toggle-${size}`);
    });
  });

  test("custom className is merged", () => {
    const { container } = render(
      <Toggle
        className="custom-class"
        options={[
          { text: "Option A", value: "option-a" },
          { text: "Option B", value: "option-b" },
        ]}
      />,
    );
    expect(container.firstChild).toHaveClass("vesper-toggle");
    expect(container.firstChild).toHaveClass("vesper-toggle-lg");
    expect(container.firstChild).toHaveClass("custom-class");
  });

  test("additional props are passed through", () => {
    const { container } = render(
      <Toggle
        data-testid="toggle"
        aria-label="toggle group"
        options={[
          { text: "Option A", value: "option-a" },
          { text: "Option B", value: "option-b" },
        ]}
      />,
    );
    expect(container.firstChild).toHaveAttribute("data-testid", "toggle");
    expect(container.firstChild).toHaveAttribute("aria-label", "toggle group");
  });

  test("aria-label is applied to toggle items", () => {
    const result = render(
      <Toggle
        options={[
          { text: "Option A", value: "option-a", ariaLabel: "Select A" },
          { text: "Option B", value: "option-b", ariaLabel: "Select B" },
        ]}
      />,
    );
    const items = result.getAllByRole("radio");
    expect(items[0]).toHaveAttribute("aria-label", "Select A");
    expect(items[1]).toHaveAttribute("aria-label", "Select B");
  });

  test("renders text", () => {
    const result = render(
      <Toggle
        options={[
          { text: "Option A", value: "option-a" },
          { text: "Option B", value: "option-b" },
        ]}
      />,
    );
    const items = result.getAllByRole("radio");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Option A");
    expect(items[1]).toHaveTextContent("Option B");
  });

  test("renders icons", () => {
    const result = render(
      <Toggle
        options={[
          {
            icon: <Globe data-testid="icon-globe" />,
            value: "option-a",
            ariaLabel: "Globe",
          },
          {
            icon: <Tenstorrent data-testid="icon-tt" />,
            value: "option-b",
            ariaLabel: "Tenstorrent",
          },
        ]}
      />,
    );
    expect(result.queryByTestId("icon-globe")).not.toBeNull();
    expect(result.queryByTestId("icon-tt")).not.toBeNull();
  });

  test("clicking an option", async () => {
    const result = render(
      <Toggle
        options={[
          { text: "Option A", value: "option-a", ariaLabel: "Option A" },
          { text: "Option B", value: "option-b", ariaLabel: "Option B" },
        ]}
      />,
    );
    const items = result.getAllByRole("radio");

    await userEvent.click(items[0]!);
    expect(items[0]).toHaveAttribute("data-state", "on");
    expect(items[1]).toHaveAttribute("data-state", "off");

    await userEvent.click(items[1]!);
    expect(items[0]).toHaveAttribute("data-state", "off");
    expect(items[1]).toHaveAttribute("data-state", "on");
  });

  test("onValueChange callback", async () => {
    const onValueChange = vi.fn();
    const result = render(
      <Toggle
        onValueChange={onValueChange}
        options={[
          { text: "Option A", value: "option-a", ariaLabel: "Option A" },
          { text: "Option B", value: "option-b", ariaLabel: "Option B" },
        ]}
      />,
    );
    const items = result.getAllByRole("radio");

    await userEvent.click(items[1]!);
    expect(onValueChange).toHaveBeenCalledWith("option-b");
  });

  test("defaultValue", () => {
    const result = render(
      <Toggle
        defaultValue="option-b"
        options={[
          { text: "Option A", value: "option-a", ariaLabel: "Option A" },
          { text: "Option B", value: "option-b", ariaLabel: "Option B" },
        ]}
      />,
    );
    const items = result.getAllByRole("radio");
    expect(items[0]).toHaveAttribute("data-state", "off");
    expect(items[1]).toHaveAttribute("data-state", "on");
  });

  test("keyboard navigation with ArrowRight", async () => {
    const result = render(
      <Toggle
        defaultValue="option-a"
        options={[
          { text: "Option A", value: "option-a", ariaLabel: "Option A" },
          { text: "Option B", value: "option-b", ariaLabel: "Option B" },
          { text: "Option C", value: "option-c", ariaLabel: "Option C" },
        ]}
      />,
    );
    const items = result.getAllByRole("radio");

    await userEvent.tab();
    expect(items[0]).toHaveFocus();

    await userEvent.keyboard("{ArrowRight}");
    expect(items[1]).toHaveFocus();

    await userEvent.keyboard("{ArrowRight}");
    expect(items[2]).toHaveFocus();
  });

  test("keyboard navigation with ArrowLeft", async () => {
    const result = render(
      <Toggle
        defaultValue="option-c"
        options={[
          { text: "Option A", value: "option-a", ariaLabel: "Option A" },
          { text: "Option B", value: "option-b", ariaLabel: "Option B" },
          { text: "Option C", value: "option-c", ariaLabel: "Option C" },
        ]}
      />,
    );
    const items = result.getAllByRole("radio");

    await userEvent.tab();
    expect(items[2]).toHaveFocus();

    await userEvent.keyboard("{ArrowLeft}");
    expect(items[1]).toHaveFocus();

    await userEvent.keyboard("{ArrowLeft}");
    expect(items[0]).toHaveFocus();
  });

  test("keyboard navigation wraps around", async () => {
    const result = render(
      <Toggle
        defaultValue="option-c"
        options={[
          { text: "Option A", value: "option-a", ariaLabel: "Option A" },
          { text: "Option B", value: "option-b", ariaLabel: "Option B" },
          { text: "Option C", value: "option-c", ariaLabel: "Option C" },
        ]}
      />,
    );
    const items = result.getAllByRole("radio");

    await userEvent.tab();
    expect(items[2]).toHaveFocus();

    await userEvent.keyboard("{ArrowRight}");
    expect(items[0]).toHaveFocus();
  });

  test("keyboard Enter selects focused item", async () => {
    const onValueChange = vi.fn();
    const result = render(
      <Toggle
        defaultValue="option-a"
        onValueChange={onValueChange}
        options={[
          { text: "Option A", value: "option-a", ariaLabel: "Option A" },
          { text: "Option B", value: "option-b", ariaLabel: "Option B" },
        ]}
      />,
    );
    const items = result.getAllByRole("radio");

    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");
    expect(items[1]).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(items[1]).toHaveAttribute("data-state", "on");
    expect(onValueChange).toHaveBeenCalledWith("option-b");
  });
});

describe("toggle [snapshot]", () => {
  test("text options", async () => {
    const { container } = render(
      <Toggle
        options={[
          { text: "Option A", value: "option-a", ariaLabel: "aria-label A" },
          { text: "Option B", value: "option-b", ariaLabel: "aria-label B" },
        ]}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("icon options", async () => {
    const { container } = render(
      <Toggle
        options={[
          { icon: <Globe />, value: "option-a", ariaLabel: "aria-label A" },
          {
            icon: <Tenstorrent />,
            value: "option-b",
            ariaLabel: "aria-label B",
          },
        ]}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("mixed options", async () => {
    const { container } = render(
      <Toggle
        options={[
          { text: "Option A", value: "option-a", ariaLabel: "aria-label A" },
          {
            icon: <Tenstorrent />,
            value: "option-b",
            ariaLabel: "aria-label B",
          },
        ]}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("toggle [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    const testFn = async () => {
      const { container } = render(
        <Toggle
          options={[
            { text: "Option A", value: "option-a", ariaLabel: "aria-label A" },
            { text: "Option B", value: "option-b", ariaLabel: "aria-label B" },
          ]}
        />,
      );

      expect(await axe.run(container)).toHaveNoViolations();
    };

    test.todo(`a11y (text, ${theme})`, testFn);

    test(`a11y (icons, ${theme})`, async () => {
      const { container } = render(
        <Toggle
          options={[
            { icon: <Globe />, value: "option-a", ariaLabel: "aria-label A" },
            {
              icon: <Tenstorrent />,
              value: "option-b",
              ariaLabel: "aria-label B",
            },
          ]}
        />,
      );

      expect(await axe.run(container)).toHaveNoViolations();
    });
  });
});
