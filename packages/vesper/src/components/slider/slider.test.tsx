import { cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { Slider } from "@/components/slider/slider";

import "@/styles/test.css";

afterEach(cleanup);

describe("slider [unit]", () => {
  test("renders a single thumb", () => {
    const result = render(<Slider thumbAriaLabel="Volume" />);
    const thumbs = result.getAllByRole("slider");
    expect(thumbs).toHaveLength(1);
  });

  test("controlled value sets thumb position", () => {
    const result = render(<Slider thumbAriaLabel="Volume" value={42} />);
    const thumb = result.getByRole("slider");
    expect(thumb).toHaveAttribute("aria-valuenow", "42");
  });

  test("defaultValue sets initial thumb position", () => {
    const result = render(<Slider thumbAriaLabel="Volume" defaultValue={30} />);
    const thumb = result.getByRole("slider");
    expect(thumb).toHaveAttribute("aria-valuenow", "30");
  });

  test("defaults to min when no value or defaultValue is provided", () => {
    const result = render(<Slider thumbAriaLabel="Volume" min={10} max={90} />);
    const thumb = result.getByRole("slider");
    expect(thumb).toHaveAttribute("aria-valuenow", "10");
  });

  test("custom min and max", () => {
    const result = render(
      <Slider thumbAriaLabel="Volume" value={25} min={10} max={50} />,
    );
    const thumb = result.getByRole("slider");
    expect(thumb).toHaveAttribute("min", "10");
    expect(thumb).toHaveAttribute("max", "50");
    expect(thumb).toHaveAttribute("aria-valuenow", "25");
  });

  test("thumb aria label", () => {
    const result = render(<Slider thumbAriaLabel="Brightness" value={50} />);
    const thumb = result.getByRole("slider");
    expect(thumb).toHaveAttribute("aria-label", "Brightness");
  });

  test("keyboard ArrowRight increases value", async () => {
    const result = render(
      <Slider thumbAriaLabel="Volume" defaultValue={50} step={1} />,
    );
    const thumb = result.getByRole("slider");

    thumb.focus();
    await userEvent.keyboard("{ArrowRight}");

    expect(thumb).toHaveAttribute("aria-valuenow", "51");
  });

  test("keyboard ArrowLeft decreases value", async () => {
    const result = render(
      <Slider thumbAriaLabel="Volume" defaultValue={50} step={1} />,
    );
    const thumb = result.getByRole("slider");

    thumb.focus();
    await userEvent.keyboard("{ArrowLeft}");

    expect(thumb).toHaveAttribute("aria-valuenow", "49");
  });

  test("value does not go below min", async () => {
    const result = render(
      <Slider thumbAriaLabel="Volume" defaultValue={0} min={0} max={100} />,
    );
    const thumb = result.getByRole("slider");

    thumb.focus();
    await userEvent.keyboard("{ArrowLeft}");

    expect(thumb).toHaveAttribute("aria-valuenow", "0");
  });

  test("value does not go above max", async () => {
    const result = render(
      <Slider thumbAriaLabel="Volume" defaultValue={100} min={0} max={100} />,
    );
    const thumb = result.getByRole("slider");

    thumb.focus();
    await userEvent.keyboard("{ArrowRight}");

    expect(thumb).toHaveAttribute("aria-valuenow", "100");
  });

  test("step value affects keyboard increment", async () => {
    const result = render(
      <Slider thumbAriaLabel="Volume" defaultValue={50} step={5} />,
    );
    const thumb = result.getByRole("slider");

    thumb.focus();
    await userEvent.keyboard("{ArrowRight}");

    expect(thumb).toHaveAttribute("aria-valuenow", "55");
  });

  test("disabled state", () => {
    const { container } = render(
      <Slider thumbAriaLabel="Volume" value={50} disabled />,
    );
    expect(container.firstChild).toHaveAttribute("data-disabled", "");
  });

  test("disabled slider does not respond to keyboard", async () => {
    const onValueChange = vi.fn();
    const result = render(
      <Slider
        thumbAriaLabel="Volume"
        defaultValue={50}
        disabled
        onValueChange={onValueChange}
      />,
    );
    const thumb = result.getByRole("slider");

    thumb.focus();
    await userEvent.keyboard("{ArrowRight}");

    expect(thumb).toHaveAttribute("aria-valuenow", "50");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  test("showTicks renders tick marks", () => {
    const { container } = render(
      <Slider thumbAriaLabel="Volume" min={0} max={5} step={1} showTicks />,
    );
    const ticks = container.querySelectorAll(".vesper-range-tick");
    expect(ticks).toHaveLength(4);
  });

  test("showValueLabel adds labeled class to thumb", () => {
    const { container } = render(
      <Slider thumbAriaLabel="Volume" value={50} showValueLabel />,
    );
    const thumb = container.querySelector(".vesper-range-thumb");
    expect(thumb).toHaveClass("vesper-range-thumb-labeled");
  });

  test("valueLabel sets CSS custom property on thumb", () => {
    const { container } = render(
      <Slider
        thumbAriaLabel="Volume"
        value={50}
        valueLabel="50%"
        showValueLabel
      />,
    );
    const thumb = container.querySelector(".vesper-range-thumb") as HTMLElement;
    expect(thumb.style.getPropertyValue("--vesper-range-thumb-label")).toBe(
      '"50%"',
    );
  });

  test("value label falls back to the thumb value", () => {
    const { container } = render(
      <Slider thumbAriaLabel="Volume" value={50} showValueLabel />,
    );
    const thumb = container.querySelector(".vesper-range-thumb") as HTMLElement;
    expect(thumb.style.getPropertyValue("--vesper-range-thumb-label")).toBe(
      '"50"',
    );
  });

  test("no label custom property when showValueLabel is false", () => {
    const { container } = render(
      <Slider thumbAriaLabel="Volume" value={50} valueLabel="50%" />,
    );
    const thumb = container.querySelector(".vesper-range-thumb") as HTMLElement;
    expect(thumb.style.getPropertyValue("--vesper-range-thumb-label")).toBe("");
  });

  test("pressing the track updates the value", async () => {
    const onValueChange = vi.fn();
    const onValueCommit = vi.fn();
    const result = render(
      <Slider
        thumbAriaLabel="Volume"
        defaultValue={0}
        onValueChange={onValueChange}
        onValueCommit={onValueCommit}
      />,
    );

    // clicking an element presses its center, ie. the middle of the track
    await userEvent.click(
      result.container.querySelector(".vesper-range-track")!,
    );

    expect(result.getByRole("slider")).toHaveAttribute("aria-valuenow", "50");
    expect(onValueChange).toHaveBeenCalledWith(50);
    expect(onValueCommit).toHaveBeenCalledWith(50);
  });

  test("disabled slider does not respond to pointer", async () => {
    const onValueChange = vi.fn();
    const result = render(
      <Slider
        thumbAriaLabel="Volume"
        defaultValue={0}
        disabled
        onValueChange={onValueChange}
      />,
    );

    await userEvent.click(
      result.container.querySelector(".vesper-range-track")!,
    );

    expect(result.getByRole("slider")).toHaveAttribute("aria-valuenow", "0");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  test("custom className is passed through", () => {
    const { container } = render(
      <Slider thumbAriaLabel="Volume" value={50} className="custom-slider" />,
    );
    expect(container.firstChild).toHaveClass("vesper-range");
    expect(container.firstChild).toHaveClass("custom-slider");
  });

  test("additional props are passed through", () => {
    const { container } = render(
      <Slider thumbAriaLabel="Volume" value={50} data-testid="my-slider" />,
    );
    expect(container.firstChild).toHaveAttribute("data-testid", "my-slider");
  });
});

describe("slider [snapshot]", () => {
  test("default", () => {
    const { container } = render(
      <Slider thumbAriaLabel="Volume" defaultValue={50} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("with custom min/max/step", () => {
    const { container } = render(
      <Slider thumbAriaLabel="Volume" value={4} min={0} max={10} step={2} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("with ticks", () => {
    const { container } = render(
      <Slider
        thumbAriaLabel="Volume"
        defaultValue={2}
        min={0}
        max={5}
        step={1}
        showTicks
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("with value label", () => {
    const { container } = render(
      <Slider
        thumbAriaLabel="Volume"
        value={75}
        valueLabel="75%"
        showValueLabel
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("disabled", () => {
    const { container } = render(
      <Slider thumbAriaLabel="Volume" value={50} disabled />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("slider [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    test.todo(`a11y (default, ${theme})`, async () => {
      const { container } = render(
        <Slider thumbAriaLabel="Volume" defaultValue={50} />,
      );

      expect(await axe.run(container)).toHaveNoViolations();
    });

    test.todo(`a11y (with ticks, ${theme})`, async () => {
      const { container } = render(
        <Slider
          thumbAriaLabel="Volume"
          defaultValue={2}
          min={0}
          max={5}
          step={1}
          showTicks
        />,
      );

      expect(await axe.run(container)).toHaveNoViolations();
    });

    test.todo(`a11y (with value label, ${theme})`, async () => {
      const { container } = render(
        <Slider
          thumbAriaLabel="Volume"
          value={50}
          valueLabel="50%"
          showValueLabel
        />,
      );

      expect(await axe.run(container)).toHaveNoViolations();
    });

    test.todo(`a11y (disabled, ${theme})`, async () => {
      const { container } = render(
        <Slider thumbAriaLabel="Volume" value={50} disabled />,
      );

      expect(await axe.run(container)).toHaveNoViolations();
    });
  });
});
