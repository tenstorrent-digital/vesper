import { cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import {
  Slider,
  SLIDER_VARIANTS,
  type SliderProps,
} from "@/components/slider/slider";

import "@/styles/test.css";

/**
 * base-ui keeps the thumb hidden until it has measured the track, so every
 * render is followed by an async role query to wait for it to settle.
 */
async function renderSlider(props: Partial<SliderProps> = {}) {
  const result = render(<Slider thumbAriaLabel="Volume" {...props} />);

  const thumb = await result.findByRole("slider");
  const wrapper = result.container.firstElementChild as HTMLElement;
  const root = result.container.querySelector<HTMLElement>(".vesper-range")!;

  return { ...result, thumb, wrapper, root };
}

const SLIDER_SNAPSHOT_PERMUTATIONS: (Partial<SliderProps> & {
  name: string;
})[] = [
  { name: "default", defaultValue: 50 },
  { name: "with custom min/max/step", value: 4, min: 0, max: 10, step: 2 },
  {
    name: "with ticks",
    defaultValue: 2,
    min: 0,
    max: 5,
    step: 1,
    showTicks: true,
  },
  {
    name: "with value label",
    value: 75,
    valueLabel: "75%",
    showValueLabel: true,
  },
  { name: "disabled", value: 50, disabled: true },
  // One per variant
  ...SLIDER_VARIANTS.map((variant) => ({
    name: `variant: ${variant}`,
    value: 50,
    variant,
  })),
];

const SLIDER_A11Y_PERMUTATIONS: (Partial<SliderProps> & { name: string })[] = [
  { name: "default", defaultValue: 50 },
  {
    name: "with ticks",
    defaultValue: 2,
    min: 0,
    max: 5,
    step: 1,
    showTicks: true,
  },
  {
    name: "with value label",
    value: 50,
    valueLabel: "50%",
    showValueLabel: true,
  },
  { name: "disabled", value: 50, disabled: true },
  // One per variant
  ...SLIDER_VARIANTS.map((variant) => ({
    name: `variant: ${variant}`,
    value: 50,
    variant,
  })),
];

afterEach(cleanup);

describe("slider [unit]", () => {
  test("renders a single thumb", async () => {
    const result = await renderSlider();
    expect(result.getAllByRole("slider")).toHaveLength(1);
  });

  test("controlled value sets thumb position", async () => {
    const { thumb } = await renderSlider({ value: 42 });
    expect(thumb).toHaveAttribute("aria-valuenow", "42");
  });

  test("defaultValue sets initial thumb position", async () => {
    const { thumb } = await renderSlider({ defaultValue: 30 });
    expect(thumb).toHaveAttribute("aria-valuenow", "30");
  });

  test("defaults to min when no value or defaultValue is provided", async () => {
    const { thumb } = await renderSlider({ min: 10, max: 90 });
    expect(thumb).toHaveAttribute("aria-valuenow", "10");
  });

  test("custom min and max", async () => {
    const { thumb } = await renderSlider({ value: 25, min: 10, max: 50 });

    expect(thumb).toHaveAttribute("min", "10");
    expect(thumb).toHaveAttribute("max", "50");
    expect(thumb).toHaveAttribute("aria-valuenow", "25");
  });

  test("thumb aria label", async () => {
    const { thumb } = await renderSlider({
      thumbAriaLabel: "Brightness",
      value: 50,
    });
    expect(thumb).toHaveAttribute("aria-label", "Brightness");
  });

  test("disabled state", async () => {
    const { root } = await renderSlider({ value: 50, disabled: true });
    expect(root).toHaveAttribute("data-disabled", "");
  });

  test("showTicks renders tick marks", async () => {
    const { container } = await renderSlider({
      min: 0,
      max: 5,
      step: 1,
      showTicks: true,
    });

    expect(container.querySelectorAll(".vesper-range-tick")).toHaveLength(4);
  });

  test("showValueLabel adds labeled class to the slider and its thumb", async () => {
    const { container, root } = await renderSlider({
      value: 50,
      showValueLabel: true,
    });

    expect(root).toHaveClass("vesper-range-labeled");
    expect(container.querySelector(".vesper-range-thumb")).toHaveClass(
      "vesper-range-thumb-labeled",
    );
  });

  test("valueLabel sets CSS custom property on thumb", async () => {
    const { container } = await renderSlider({
      value: 50,
      valueLabel: "50%",
      showValueLabel: true,
    });

    const thumb = container.querySelector<HTMLElement>(".vesper-range-thumb")!;
    expect(thumb.style.getPropertyValue("--vesper-range-thumb-label")).toBe(
      '"50%"',
    );
  });

  test("value label falls back to the thumb value", async () => {
    const { container } = await renderSlider({
      value: 50,
      showValueLabel: true,
    });

    const thumb = container.querySelector<HTMLElement>(".vesper-range-thumb")!;
    expect(thumb.style.getPropertyValue("--vesper-range-thumb-label")).toBe(
      '"50"',
    );
  });

  test("no label custom property when showValueLabel is false", async () => {
    const { container } = await renderSlider({ value: 50, valueLabel: "50%" });

    const thumb = container.querySelector<HTMLElement>(".vesper-range-thumb")!;
    expect(thumb.style.getPropertyValue("--vesper-range-thumb-label")).toBe("");
  });

  test("pressing the track updates the value", async () => {
    const onValueChange = vi.fn();
    const onValueCommit = vi.fn();
    const { container, thumb } = await renderSlider({
      defaultValue: 0,
      onValueChange,
      onValueCommit,
    });

    // clicking an element presses its center, ie. the middle of the track
    await userEvent.click(container.querySelector(".vesper-range-track")!);

    expect(thumb).toHaveAttribute("aria-valuenow", "50");
    expect(onValueChange).toHaveBeenCalledWith(50);
    expect(onValueCommit).toHaveBeenCalledWith(50);
  });

  test("disabled slider does not respond to pointer", async () => {
    const onValueChange = vi.fn();
    const { container, thumb } = await renderSlider({
      defaultValue: 0,
      disabled: true,
      onValueChange,
    });

    await userEvent.click(container.querySelector(".vesper-range-track")!);

    expect(thumb).toHaveAttribute("aria-valuenow", "0");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  test("additional props are passed through to the wrapper", async () => {
    const result = render(
      <Slider
        thumbAriaLabel="Volume"
        value={50}
        data-testid="my-slider"
        aria-label="Range slider"
      />,
    );
    await result.findByRole("slider");

    expect(result.container.firstElementChild).toHaveAttribute(
      "data-testid",
      "my-slider",
    );
    expect(result.container.firstElementChild).toHaveAttribute(
      "aria-label",
      "Range slider",
    );
  });
});

describe("slider [snapshot]", () => {
  SLIDER_SNAPSHOT_PERMUTATIONS.forEach(({ name, ...props }) => {
    test(name, async () => {
      const { container } = await renderSlider(props);
      expect(container.firstChild).toMatchSnapshot();
    });
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

    SLIDER_A11Y_PERMUTATIONS.forEach(({ name, ...props }) => {
      test(`wcag2aaa (${name}, ${theme})`, async () => {
        const { container } = await renderSlider(props);
        expect(await axe.run(container)).toHaveNoViolations();
      });
    });
  });
});
