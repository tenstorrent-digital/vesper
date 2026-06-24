import { render, cleanup, fireEvent } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import axe from "axe-core";

import { Switch, SWITCH_SIZES } from "@/components/switch/switch";

import "@/styles/test.css";

afterEach(cleanup);

describe("switch [unit]", () => {
  SWITCH_SIZES.forEach((size) => {
    test(`${size} size class`, () => {
      const result = render(<Switch size={size} aria-label="toggle" />);
      const switchEl = result.getByRole("switch");
      expect(switchEl).toHaveClass(`vesper-switch-${size}`);
    });
  });

  test("custom className is merged", () => {
    const result = render(
      <Switch className="custom-class" aria-label="toggle" />,
    );
    const switchEl = result.getByRole("switch");
    expect(switchEl).toHaveClass("vesper-switch");
    expect(switchEl).toHaveClass("vesper-switch-md");
    expect(switchEl).toHaveClass("custom-class");
  });

  test("additional props are passed through", () => {
    const result = render(
      <Switch data-testid="my-switch" aria-label="toggle" />,
    );
    const switchEl = result.getByRole("switch");
    expect(switchEl).toHaveAttribute("data-testid", "my-switch");
    expect(switchEl).toHaveAttribute("aria-label", "toggle");
  });

  test("renders label text", () => {
    const result = render(<Switch label="Enable notifications" />);
    expect(result.getByText("Enable notifications")).not.toBeNull();
  });

  test("label wraps switch in a label element", () => {
    const { container } = render(<Switch label="My Label" />);
    const labelEl = container.querySelector("label");
    expect(labelEl).not.toBeNull();
    expect(labelEl).toHaveClass("vesper-switch-label");
  });

  test("no label element when label prop is not provided", () => {
    const { container } = render(<Switch aria-label="toggle" />);
    const labelEl = container.querySelector("label");
    expect(labelEl).toBeNull();
  });

  test("unchecked by default", () => {
    const result = render(<Switch aria-label="toggle" />);
    const switchEl = result.getByRole("switch");
    expect(switchEl).toHaveAttribute("data-state", "unchecked");
    expect(switchEl).toHaveAttribute("aria-checked", "false");
  });

  test("defaultChecked sets initial state", () => {
    const result = render(<Switch defaultChecked aria-label="toggle" />);
    const switchEl = result.getByRole("switch");
    expect(switchEl).toHaveAttribute("data-state", "checked");
    expect(switchEl).toHaveAttribute("aria-checked", "true");
  });

  test("clicking toggles the switch", async () => {
    const result = render(<Switch aria-label="toggle" />);
    const switchEl = result.getByRole("switch");

    expect(switchEl).toHaveAttribute("data-state", "unchecked");

    await userEvent.click(switchEl);
    expect(switchEl).toHaveAttribute("data-state", "checked");

    await userEvent.click(switchEl);
    expect(switchEl).toHaveAttribute("data-state", "unchecked");
  });

  test("onCheckedChange callback is called", async () => {
    const onCheckedChange = vi.fn();
    const result = render(
      <Switch onCheckedChange={onCheckedChange} aria-label="toggle" />,
    );
    const switchEl = result.getByRole("switch");

    await userEvent.click(switchEl);
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    await userEvent.click(switchEl);
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  test("disabled switch not toggled by click", () => {
    const onCheckedChange = vi.fn();
    const result = render(
      <Switch disabled onCheckedChange={onCheckedChange} aria-label="toggle" />,
    );
    const switchEl = result.getByRole("switch");

    fireEvent.click(switchEl);
    expect(switchEl).toHaveAttribute("data-state", "unchecked");
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  test("disabled switch not toggled by keyboard", () => {
    const onCheckedChange = vi.fn();
    const result = render(
      <Switch disabled onCheckedChange={onCheckedChange} aria-label="toggle" />,
    );
    const switchEl = result.getByRole("switch");

    fireEvent.keyDown(switchEl, { key: " " });
    fireEvent.keyUp(switchEl, { key: " " });
    expect(switchEl).toHaveAttribute("data-state", "unchecked");
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  test("keyboard Space toggles the switch", async () => {
    const result = render(<Switch aria-label="toggle" />);
    const switchEl = result.getByRole("switch");

    await userEvent.tab();
    expect(switchEl).toHaveFocus();

    await userEvent.keyboard(" ");
    expect(switchEl).toHaveAttribute("data-state", "checked");

    await userEvent.keyboard(" ");
    expect(switchEl).toHaveAttribute("data-state", "unchecked");
  });

  test("keyboard Enter toggles the switch", async () => {
    const result = render(<Switch aria-label="toggle" />);
    const switchEl = result.getByRole("switch");

    await userEvent.tab();
    expect(switchEl).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(switchEl).toHaveAttribute("data-state", "checked");
  });

  test("switch is focusable via Tab", async () => {
    const result = render(<Switch aria-label="toggle" />);
    const switchEl = result.getByRole("switch");

    await userEvent.tab();
    expect(switchEl).toHaveFocus();
  });
});

describe("switch [snapshot]", () => {
  test("sm", async () => {
    const { container } = render(<Switch size="sm" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("sm, with label", async () => {
    const { container } = render(<Switch size="sm" label="Label" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("sm, disabled", async () => {
    const { container } = render(<Switch size="sm" disabled />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("sm, disabled, with label", async () => {
    const { container } = render(<Switch size="sm" disabled label="Label" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("md", async () => {
    const { container } = render(<Switch size="md" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("md, with label", async () => {
    const { container } = render(<Switch size="md" label="Label" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("md, disabled", async () => {
    const { container } = render(<Switch size="md" disabled />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("md, disabled, with label", async () => {
    const { container } = render(<Switch size="md" disabled label="Label" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("switch [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    SWITCH_SIZES.forEach((size) => {
      test(`wcag2aaa (${size}, ${theme})`, async () => {
        const { container } = render(<Switch size={size} label="Label" />);

        expect(
          await axe.run(container, { runOnly: "wcag2aaa" }),
        ).toHaveNoViolations();
      });
    });
  });
});
