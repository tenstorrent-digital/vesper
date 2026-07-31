import { cleanup, fireEvent, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import {
  Switch,
  SWITCH_SIZES,
  type SwitchProps,
} from "@/components/switch/switch";

import "@/styles/test.css";

export const SWITCH_PERMUTATIONS = SWITCH_SIZES.flatMap(
  (size): (SwitchProps & { name: string })[] => [
    { name: `${size}`, size, ["aria-label"]: "Label" },
    {
      name: `${size}, disabled`,
      size,
      disabled: true,
      ["aria-label"]: "Label",
    },
    { name: `${size}, with label`, size, label: "Label" },
    {
      name: `${size}, disabled, with label`,
      size,
      disabled: true,
      label: "Label",
    },
  ],
);

afterEach(cleanup);

describe("switch [unit]", () => {
  SWITCH_SIZES.forEach((size) => {
    test(`${size} size class`, () => {
      const { container } = render(<Switch size={size} label="toggle" />);
      expect(container.firstChild).toHaveClass(`vesper-switch-${size}`);
    });
  });

  test("custom className is merged", () => {
    const { container } = render(
      <Switch className="custom-class" label="toggle" />,
    );
    expect(container.firstChild).toHaveClass("vesper-switch");
    expect(container.firstChild).toHaveClass("vesper-switch-md");
    expect(container.firstChild).toHaveClass("custom-class");
  });

  test("additional props are passed through", () => {
    const { container } = render(
      <Switch data-testid="my-switch" label="toggle" />,
    );
    expect(container.firstChild).toHaveAttribute("data-testid", "my-switch");
  });

  test("renders label text", () => {
    const result = render(<Switch label="Enable notifications" />);
    expect(result.getByText("Enable notifications")).not.toBeNull();
  });

  test("renders label text with asterisk when marked as required", () => {
    const result = render(<Switch label="Enable notifications" required />);
    expect(result.getByText("Enable notifications *")).not.toBeNull();
  });

  test("no label text rendered when label prop is not provided", () => {
    const { container } = render(<Switch />);
    const labelText = container.querySelector(".vesper-switch-label");
    expect(labelText).toBeNull();
  });

  test("unchecked by default", () => {
    const result = render(<Switch label="toggle" />);
    const checkbox = result.getByRole("switch");
    expect(checkbox).not.toBeChecked();
  });

  test("defaultChecked sets initial state", () => {
    const result = render(<Switch defaultChecked label="toggle" />);
    const checkbox = result.getByRole("switch");
    expect(checkbox).toBeChecked();
  });

  test("clicking toggles the switch", async () => {
    const { container } = render(<Switch label="toggle" />);
    const checkbox = container.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    const label = container.firstChild as HTMLLabelElement;

    expect(checkbox).not.toBeChecked();

    await userEvent.click(label);
    expect(checkbox).toBeChecked();

    await userEvent.click(label);
    expect(checkbox).not.toBeChecked();
  });

  test("onChange callback is called", async () => {
    const onChange = vi.fn();
    const { container } = render(<Switch onChange={onChange} label="toggle" />);
    const label = container.firstChild as HTMLLabelElement;

    await userEvent.click(label);
    expect(onChange).toHaveBeenCalled();
  });

  test("disabled switch not toggled by click", () => {
    const onChange = vi.fn();
    const result = render(
      <Switch disabled onChange={onChange} label="toggle" />,
    );
    const checkbox = result.getByRole("switch");
    const label = result.container.firstChild as HTMLLabelElement;

    fireEvent.click(label);
    expect(checkbox).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  test("disabled switch not toggled by keyboard", () => {
    const onChange = vi.fn();
    const result = render(
      <Switch disabled onChange={onChange} label="toggle" />,
    );
    const checkbox = result.getByRole("switch");

    fireEvent.keyDown(checkbox, { key: " " });
    fireEvent.keyUp(checkbox, { key: " " });
    expect(checkbox).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  test("keyboard Space toggles the switch", async () => {
    const result = render(<Switch label="toggle" />);
    const checkbox = result.getByRole("switch");

    await userEvent.tab();
    expect(checkbox).toHaveFocus();

    await userEvent.keyboard(" ");
    expect(checkbox).toBeChecked();

    await userEvent.keyboard(" ");
    expect(checkbox).not.toBeChecked();
  });

  test("switch is focusable via Tab", async () => {
    const result = render(<Switch label="toggle" />);
    const checkbox = result.getByRole("switch");

    await userEvent.tab();
    expect(checkbox).toHaveFocus();
  });

  test("aria-checked is false by default", () => {
    const result = render(<Switch label="toggle" />);
    const checkbox = result.getByRole("switch");
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  test("aria-checked reflects defaultChecked", () => {
    const result = render(<Switch defaultChecked />);
    const checkbox = result.getByRole("switch");
    expect(checkbox).toHaveAttribute("aria-checked", "true");
  });

  test("aria-checked updates in uncontrolled usage", async () => {
    const { container } = render(<Switch />);
    const checkbox = container.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    const label = container.firstChild as HTMLLabelElement;

    expect(checkbox).toHaveAttribute("aria-checked", "false");

    await userEvent.click(label);
    expect(checkbox).toHaveAttribute("aria-checked", "true");

    await userEvent.click(label);
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  test("aria-checked reflects checked prop when true", () => {
    const result = render(<Switch checked={true} />);
    const checkbox = result.getByRole("switch");
    expect(checkbox).toHaveAttribute("aria-checked", "true");
  });

  test("aria-checked reflects checked prop when false", () => {
    const result = render(<Switch checked={false} />);
    const checkbox = result.getByRole("switch");
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  test("aria-checked updates when checked prop changes", () => {
    const { rerender, getByRole } = render(
      <Switch checked={false} label="toggle" />,
    );
    const checkbox = getByRole("switch");
    expect(checkbox).toHaveAttribute("aria-checked", "false");

    rerender(<Switch checked={true} label="toggle" />);
    expect(checkbox).toHaveAttribute("aria-checked", "true");
  });

  test("aria-checked updates on keyboard toggle", async () => {
    const result = render(<Switch label="toggle" />);
    const checkbox = result.getByRole("switch");

    await userEvent.tab();
    expect(checkbox).toHaveAttribute("aria-checked", "false");

    await userEvent.keyboard(" ");
    expect(checkbox).toHaveAttribute("aria-checked", "true");

    await userEvent.keyboard(" ");
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  test("aria-checked not present when role is not switch", async () => {
    const result = render(<Switch label="toggle" role="checkbox" />);
    const checkbox = result.getByRole("checkbox");

    expect(checkbox).not.toHaveAttribute("aria-checked", "true");
  });
});

describe("switch [snapshot]", () => {
  SWITCH_PERMUTATIONS.forEach(({ name, ...props }) => {
    test(name, () => {
      const { container } = render(<Switch {...props} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

describe("switch [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    SWITCH_PERMUTATIONS.forEach(({ name, ...props }) => {
      test(`wcag2aaa (${name}, ${theme})`, async () => {
        const result = render(<Switch {...props} />);

        expect(await axe.run(result.container)).toHaveNoViolations();
      });
    });
  });
});
