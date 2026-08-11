import { createRef } from "react";
import { cleanup, fireEvent, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { Globe, Tenstorrent } from "@/components/icons/icons";
import { Toggle, TOGGLE_SIZES } from "@/components/toggle/toggle";

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
    expect(container.firstChild).toHaveClass("vesper-toggle-md");
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

  test("roving tabindex exposes a single tab stop", async () => {
    const result = render(
      <Toggle
        defaultValue="option-b"
        options={[
          { text: "Option A", value: "option-a", ariaLabel: "Option A" },
          { text: "Option B", value: "option-b", ariaLabel: "Option B" },
          { text: "Option C", value: "option-c", ariaLabel: "Option C" },
        ]}
      />,
    );
    const items = result.getAllByRole("radio");

    // the selected option is the only tab stop
    expect(items[0]).toHaveAttribute("tabindex", "-1");
    expect(items[1]).toHaveAttribute("tabindex", "0");
    expect(items[2]).toHaveAttribute("tabindex", "-1");

    // the tab stop follows focus within the group
    items[1]!.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(items[2]).toHaveFocus();
    expect(items[0]).toHaveAttribute("tabindex", "-1");
    expect(items[1]).toHaveAttribute("tabindex", "-1");
    expect(items[2]).toHaveAttribute("tabindex", "0");
  });

  test("first option is the tab stop when nothing is selected", () => {
    const result = render(
      <Toggle
        options={[
          { text: "Option A", value: "option-a", ariaLabel: "Option A" },
          { text: "Option B", value: "option-b", ariaLabel: "Option B" },
        ]}
      />,
    );
    const items = result.getAllByRole("radio");
    expect(items[0]).toHaveAttribute("tabindex", "0");
    expect(items[1]).toHaveAttribute("tabindex", "-1");
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
    expect(items[0]).toHaveAttribute("aria-checked", "true");
    expect(items[1]).toHaveAttribute("aria-checked", "false");

    await userEvent.click(items[1]!);
    expect(items[0]).toHaveAttribute("aria-checked", "false");
    expect(items[1]).toHaveAttribute("aria-checked", "true");
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
    expect(items[0]).toHaveAttribute("aria-checked", "false");
    expect(items[1]).toHaveAttribute("aria-checked", "true");
  });

  test("keyboard navigation with ArrowRight and ArrowLeft", async () => {
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

    await userEvent.keyboard("{ArrowLeft}");
    expect(items[0]).toHaveFocus();
  });

  test("keyboard navigation with ArrowDown and ArrowUp", async () => {
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

    await userEvent.keyboard("{ArrowDown}");
    expect(items[1]).toHaveFocus();

    await userEvent.keyboard("{ArrowUp}");
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
    expect(items[1]).toHaveAttribute("aria-checked", "true");
    expect(onValueChange).toHaveBeenCalledWith("option-b");
  });

  test("ref exposes the toggle group element", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Toggle
        ref={ref}
        options={[
          { text: "Option A", value: "option-a" },
          { text: "Option B", value: "option-b" },
        ]}
      />,
    );
    expect(ref.current).toBe(container.firstChild);
  });

  test("clicking the selected option deselects it", async () => {
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

    await userEvent.click(items[0]!);
    expect(items[0]).toHaveAttribute("aria-checked", "false");
    expect(onValueChange).toHaveBeenCalledWith("");
  });

  test("selection follows the value prop", () => {
    const options = [
      { text: "Option A", value: "option-a" },
      { text: "Option B", value: "option-b" },
    ];
    const result = render(<Toggle value="option-a" options={options} />);
    const items = result.getAllByRole("radio");
    expect(items[0]).toHaveAttribute("aria-checked", "true");

    result.rerender(<Toggle value="option-b" options={options} />);
    expect(items[0]).toHaveAttribute("aria-checked", "false");
    expect(items[1]).toHaveAttribute("aria-checked", "true");
  });

  test("disabled toggle", () => {
    const { container } = render(
      <Toggle
        disabled
        options={[
          { text: "Option A", value: "option-a" },
          { text: "Option B", value: "option-b" },
        ]}
      />,
    );
    expect(container.firstChild).toHaveClass("vesper-toggle-disabled");
    expect(container.querySelector("select")).toBeDisabled();
    container.querySelectorAll("button").forEach((item) => {
      expect(item).toBeDisabled();
    });
  });

  test("selected value is submitted with form data", async () => {
    const result = render(
      <form>
        <Toggle
          name="toggle-name"
          options={[
            { text: "Option A", value: "option-a", ariaLabel: "Option A" },
            { text: "Option B", value: "option-b", ariaLabel: "Option B" },
          ]}
        />
      </form>,
    );
    const form = result.container.querySelector("form")!;
    expect(new FormData(form).get("toggle-name")).toBe("");

    await userEvent.click(result.getAllByRole("radio")[1]!);
    expect(new FormData(form).get("toggle-name")).toBe("option-b");
  });

  test("resetting the parent form restores the defaultValue", async () => {
    const onValueChange = vi.fn();
    const result = render(
      <form>
        <Toggle
          name="toggle-name"
          defaultValue="option-a"
          onValueChange={onValueChange}
          options={[
            { text: "Option A", value: "option-a", ariaLabel: "Option A" },
            { text: "Option B", value: "option-b", ariaLabel: "Option B" },
          ]}
        />
      </form>,
    );
    const items = result.getAllByRole("radio");

    await userEvent.click(items[1]!);
    expect(items[1]).toHaveAttribute("aria-checked", "true");

    fireEvent.reset(result.container.querySelector("form")!);
    expect(items[0]).toHaveAttribute("aria-checked", "true");
    expect(items[1]).toHaveAttribute("aria-checked", "false");
    expect(onValueChange).toHaveBeenLastCalledWith("option-a");
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

  test("disabled", async () => {
    const { container } = render(
      <Toggle
        disabled
        defaultValue="option-a"
        options={[
          { text: "Option A", value: "option-a", ariaLabel: "aria-label A" },
          { text: "Option B", value: "option-b", ariaLabel: "aria-label B" },
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

    test(`a11y (icons, disabled, ${theme})`, async () => {
      const { container } = render(
        <Toggle
          disabled
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
