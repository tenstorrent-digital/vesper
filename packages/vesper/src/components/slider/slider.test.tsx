import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import axe from "axe-core";

import { Slider } from "@/components/slider/slider";

import "@/styles/test.css";

afterEach(cleanup);

describe("slider [unit]", () => {
  test("renders a single thumb", () => {
    const result = render(<Slider aria-label="Volume" />);
    const thumbs = result.getAllByRole("slider");
    expect(thumbs).toHaveLength(1);
  });

  test("controlled value sets thumb position", () => {
    const result = render(<Slider aria-label="Volume" value={42} />);
    const thumb = result.getByRole("slider");
    expect(thumb).toHaveAttribute("aria-valuenow", "42");
  });

  test("defaultValue sets initial thumb position", () => {
    const result = render(<Slider aria-label="Volume" defaultValue={30} />);
    const thumb = result.getByRole("slider");
    expect(thumb).toHaveAttribute("aria-valuenow", "30");
  });

  test("defaults to min when no value or defaultValue is provided", () => {
    const result = render(<Slider aria-label="Volume" min={10} max={90} />);
    const thumb = result.getByRole("slider");
    expect(thumb).toHaveAttribute("aria-valuenow", "10");
  });

  test("custom min and max", () => {
    const result = render(
      <Slider aria-label="Volume" value={25} min={10} max={50} />,
    );
    const thumb = result.getByRole("slider");
    expect(thumb).toHaveAttribute("aria-valuemin", "10");
    expect(thumb).toHaveAttribute("aria-valuemax", "50");
    expect(thumb).toHaveAttribute("aria-valuenow", "25");
  });

  test("thumb aria label", () => {
    const result = render(<Slider thumbAriaLabel="Brightness" value={50} />);
    const thumb = result.getByRole("slider");
    expect(thumb).toHaveAttribute("aria-label", "Brightness");
  });

  test("keyboard ArrowRight increases value", async () => {
    const result = render(
      <Slider aria-label="Volume" defaultValue={50} step={1} />,
    );
    const thumb = result.getByRole("slider");

    thumb.focus();
    await userEvent.keyboard("{ArrowRight}");

    expect(thumb).toHaveAttribute("aria-valuenow", "51");
  });

  test("keyboard ArrowLeft decreases value", async () => {
    const result = render(
      <Slider aria-label="Volume" defaultValue={50} step={1} />,
    );
    const thumb = result.getByRole("slider");

    thumb.focus();
    await userEvent.keyboard("{ArrowLeft}");

    expect(thumb).toHaveAttribute("aria-valuenow", "49");
  });

  test("value does not go below min", async () => {
    const result = render(
      <Slider aria-label="Volume" defaultValue={0} min={0} max={100} />,
    );
    const thumb = result.getByRole("slider");

    thumb.focus();
    await userEvent.keyboard("{ArrowLeft}");

    expect(thumb).toHaveAttribute("aria-valuenow", "0");
  });

  test("value does not go above max", async () => {
    const result = render(
      <Slider aria-label="Volume" defaultValue={100} min={0} max={100} />,
    );
    const thumb = result.getByRole("slider");

    thumb.focus();
    await userEvent.keyboard("{ArrowRight}");

    expect(thumb).toHaveAttribute("aria-valuenow", "100");
  });

  test("step value affects keyboard increment", async () => {
    const result = render(
      <Slider aria-label="Volume" defaultValue={50} step={5} />,
    );
    const thumb = result.getByRole("slider");

    thumb.focus();
    await userEvent.keyboard("{ArrowRight}");

    expect(thumb).toHaveAttribute("aria-valuenow", "55");
  });

  test("disabled state", () => {
    const { container } = render(
      <Slider aria-label="Volume" value={50} disabled />,
    );
    expect(container.firstChild).toHaveAttribute("data-disabled", "");
  });

  test("disabled slider does not respond to keyboard", async () => {
    const onValueChange = vi.fn();
    const result = render(
      <Slider
        aria-label="Volume"
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
      <Slider aria-label="Volume" min={0} max={5} step={1} showTicks />,
    );
    const ticks = container.querySelectorAll(".vesper-range-tick");
    expect(ticks).toHaveLength(4);
  });

  test("showValueLabel adds labeled class to thumb", () => {
    const { container } = render(
      <Slider aria-label="Volume" value={50} showValueLabel />,
    );
    const thumb = container.querySelector(".vesper-range-thumb");
    expect(thumb).toHaveClass("vesper-range-thumb-labeled");
  });

  test("valueLabel sets CSS custom property on thumb", () => {
    const { container } = render(
      <Slider aria-label="Volume" value={50} valueLabel="50%" showValueLabel />,
    );
    const thumb = container.querySelector(".vesper-range-thumb") as HTMLElement;
    expect(thumb.style.getPropertyValue("--vesper-range-thumb-label")).toBe(
      '"50%"',
    );
  });

  test("no inline label style when valueLabel is not provided", () => {
    const { container } = render(
      <Slider aria-label="Volume" value={50} showValueLabel />,
    );
    const thumb = container.querySelector(".vesper-range-thumb") as HTMLElement;
    expect(thumb.style.getPropertyValue("--vesper-range-thumb-label")).toBe("");
  });

  test("custom className is passed through", () => {
    const { container } = render(
      <Slider aria-label="Volume" value={50} className="custom-slider" />,
    );
    expect(container.firstChild).toHaveClass("vesper-range");
    expect(container.firstChild).toHaveClass("custom-slider");
  });

  test("additional props are passed through", () => {
    const { container } = render(
      <Slider aria-label="Volume" value={50} data-testid="my-slider" />,
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
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    test.todo(`a11y (default, ${theme})`, async () => {
      const { container } = render(
        <Slider aria-label="Volume" defaultValue={50} />,
      );

      expect(await axe.run(container)).toHaveNoViolations();
    });

    test.todo(`a11y (with ticks, ${theme})`, async () => {
      const { container } = render(
        <Slider
          aria-label="Volume"
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
          aria-label="Volume"
          value={50}
          valueLabel="50%"
          showValueLabel
        />,
      );

      expect(await axe.run(container)).toHaveNoViolations();
    });

    test.todo(`a11y (disabled, ${theme})`, async () => {
      const { container } = render(
        <Slider aria-label="Volume" value={50} disabled />,
      );

      expect(await axe.run(container)).toHaveNoViolations();
    });
  });
});
