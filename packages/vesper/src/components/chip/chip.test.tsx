import { render, cleanup, fireEvent } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import axe from "axe-core";

import { Chip } from "@/components/chip/chip";
import { Globe } from "@/components/icons/icons";

import "@/styles/test.css";

afterEach(cleanup);

describe("chip [unit]", () => {
  test("renders a button by default", () => {
    const { container } = render(<Chip>Label</Chip>);
    expect(container.firstElementChild?.tagName).toBe("BUTTON");
  });

  test("renders as a custom element via as prop", () => {
    const { container } = render(<Chip as="span">Label</Chip>);
    expect(container.firstElementChild?.tagName).toBe("SPAN");
  });

  test("default variant class", () => {
    const { container } = render(<Chip variant="default">Label</Chip>);
    expect(container.firstElementChild).toHaveClass("vesper-chip-default");
  });

  test("contrast variant class", () => {
    const { container } = render(<Chip variant="contrast">Label</Chip>);
    expect(container.firstElementChild).toHaveClass("vesper-chip-contrast");
  });

  test("selected class applied when selected", () => {
    const { container } = render(<Chip selected>Label</Chip>);
    expect(container.firstElementChild).toHaveClass("vesper-chip-selected");
  });

  test("selected class not applied when not selected", () => {
    const { container } = render(<Chip>Label</Chip>);
    expect(container.firstElementChild).not.toHaveClass("vesper-chip-selected");
  });

  test("disabled class applied when disabled", () => {
    const { container } = render(<Chip disabled>Label</Chip>);
    expect(container.firstElementChild).toHaveClass("vesper-chip-disabled");
  });

  test("disabled class not applied when not disabled", () => {
    const { container } = render(<Chip>Label</Chip>);
    expect(container.firstElementChild).not.toHaveClass("vesper-chip-disabled");
  });

  test("aria-pressed set when button", () => {
    const { container } = render(<Chip selected>Label</Chip>);
    expect(container.firstElementChild).toHaveAttribute("aria-pressed", "true");
  });

  test("aria-pressed not set for non-button element", () => {
    const { container } = render(
      <Chip as="span" selected>
        Label
      </Chip>,
    );
    expect(container.firstElementChild).not.toHaveAttribute("aria-pressed");
  });

  test("custom className is merged", () => {
    const { container } = render(<Chip className="custom-class">Label</Chip>);
    expect(container.firstElementChild).toHaveClass("vesper-chip");
    expect(container.firstElementChild).toHaveClass("custom-class");
  });

  test("iconLeft renders when provided", () => {
    const result = render(
      <Chip iconLeft={<Globe data-testid="icon-left" />}>Label</Chip>,
    );
    const icon = result.queryByTestId("icon-left");
    expect(icon).not.toBeNull();
  });

  test("iconRight renders when provided", () => {
    const result = render(
      <Chip iconRight={<Globe data-testid="icon-right" />}>Label</Chip>,
    );
    const icon = result.queryByTestId("icon-right");
    expect(icon).not.toBeNull();
  });

  test("both icons render when provided", () => {
    const result = render(
      <Chip
        iconLeft={<Globe data-testid="icon-left" />}
        iconRight={<Globe data-testid="icon-right" />}
      >
        Label
      </Chip>,
    );

    const iconLeft = result.queryByTestId("icon-left");
    const iconRight = result.queryByTestId("icon-right");

    expect(iconLeft).not.toBeNull();
    expect(iconRight).not.toBeNull();
  });

  test("onChange called on click", async () => {
    const onChange = vi.fn();
    const { container } = render(<Chip onChange={onChange}>Label</Chip>);

    await userEvent.click(container.firstElementChild!);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  test("onChange and onClick both fire on click", async () => {
    const onChange = vi.fn();
    const onClick = vi.fn();
    const { container } = render(
      <Chip onChange={onChange} onClick={onClick}>
        Label
      </Chip>,
    );

    await userEvent.click(container.firstElementChild!);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("disabled chip does not call onChange or onClick", () => {
    const onChange = vi.fn();
    const onClick = vi.fn();
    const { container } = render(
      <Chip disabled onChange={onChange} onClick={onClick}>
        Label
      </Chip>,
    );

    fireEvent.click(container.firstElementChild!);
    expect(onChange).not.toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("chip [snapshot]", () => {
  test("default variant", () => {
    const { container } = render(<Chip variant="default">Label</Chip>);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("contrast variant", () => {
    const { container } = render(<Chip variant="contrast">Label</Chip>);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("selected", () => {
    const { container } = render(<Chip selected>Label</Chip>);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("disabled", () => {
    const { container } = render(<Chip disabled>Label</Chip>);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("with icons", () => {
    const { container } = render(
      <Chip iconLeft={<Globe />} iconRight={<Globe />}>
        Label
      </Chip>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("chip [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    const defaultTestFn = async () => {
      const { container } = render(<Chip variant="default">Label</Chip>);
      expect(await axe.run(container)).toHaveNoViolations();
    };

    if (theme === "dark") {
      test.todo(`a11y (default, ${theme})`, defaultTestFn);
    } else {
      test(`a11y (default, ${theme})`, defaultTestFn);
    }

    test(`a11y (contrast, ${theme})`, async () => {
      const { container } = render(<Chip variant="contrast">Label</Chip>);
      expect(await axe.run(container)).toHaveNoViolations();
    });

    test(`a11y (default, selected, ${theme})`, async () => {
      const { container } = render(
        <Chip variant="default" selected>
          Label
        </Chip>,
      );
      expect(await axe.run(container)).toHaveNoViolations();
    });

    test(`a11y (contrast, selected, ${theme})`, async () => {
      const { container } = render(
        <Chip variant="contrast" selected>
          Label
        </Chip>,
      );
      expect(await axe.run(container)).toHaveNoViolations();
    });

    test(`a11y (disabled, ${theme})`, async () => {
      const { container } = render(<Chip disabled>Label</Chip>);
      expect(await axe.run(container)).toHaveNoViolations();
    });
  });
});
