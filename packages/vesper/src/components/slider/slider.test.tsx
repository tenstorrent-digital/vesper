import { cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import {
  Slider,
  SLIDER_VARIANTS,
  type SliderProps,
  type SliderVariant,
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
  { name: "with label", value: 50, label: "Label text" },
  { name: "with message", value: 50, message: "Message text" },
  // One per variant, with both a label and a message
  ...SLIDER_VARIANTS.map((variant) => ({
    name: `variant: ${variant}`,
    value: 50,
    variant,
    label: "Label text",
    message: "Message text",
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
  // One per variant, with both a label and a message
  ...SLIDER_VARIANTS.map((variant) => ({
    name: `variant: ${variant}`,
    value: 50,
    variant,
    label: "Label text",
    message: "Message text",
  })),
];

/**
 * The message text does not meet the enhanced (AAA) color contrast threshold
 * for these variant/theme combinations
 *
 * @see packages/vesper/src/components/form-input-wrapper/form-input-wrapper.test.tsx
 */
const SLIDER_A11Y_FAILING_MESSAGE_PERMUTATIONS: {
  variant: SliderVariant;
  theme: "light" | "dark";
}[] = [
  { theme: "light", variant: "default" },
  { theme: "light", variant: "warning" },
  { theme: "light", variant: "error" },
  { theme: "light", variant: "success" },
  { theme: "dark", variant: "default" },
  { theme: "dark", variant: "error" },
  { theme: "dark", variant: "success" },
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

  test("keyboard ArrowRight increases value", async () => {
    const { thumb } = await renderSlider({ defaultValue: 50, step: 1 });

    thumb.focus();
    await userEvent.keyboard("{ArrowRight}");

    expect(thumb).toHaveAttribute("aria-valuenow", "51");
  });

  test("keyboard ArrowLeft decreases value", async () => {
    const { thumb } = await renderSlider({ defaultValue: 50, step: 1 });

    thumb.focus();
    await userEvent.keyboard("{ArrowLeft}");

    expect(thumb).toHaveAttribute("aria-valuenow", "49");
  });

  test("value does not go below min", async () => {
    const { thumb } = await renderSlider({ defaultValue: 0, min: 0, max: 100 });

    thumb.focus();
    await userEvent.keyboard("{ArrowLeft}");

    expect(thumb).toHaveAttribute("aria-valuenow", "0");
  });

  test("value does not go above max", async () => {
    const { thumb } = await renderSlider({
      defaultValue: 100,
      min: 0,
      max: 100,
    });

    thumb.focus();
    await userEvent.keyboard("{ArrowRight}");

    expect(thumb).toHaveAttribute("aria-valuenow", "100");
  });

  test("step value affects keyboard increment", async () => {
    const { thumb } = await renderSlider({ defaultValue: 50, step: 5 });

    thumb.focus();
    await userEvent.keyboard("{ArrowRight}");

    expect(thumb).toHaveAttribute("aria-valuenow", "55");
  });

  test("disabled state", async () => {
    const { root } = await renderSlider({ value: 50, disabled: true });
    expect(root).toHaveAttribute("data-disabled", "");
  });

  test("disabled slider does not respond to keyboard", async () => {
    const onValueChange = vi.fn();
    const { thumb } = await renderSlider({
      defaultValue: 50,
      disabled: true,
      onValueChange,
    });

    thumb.focus();
    await userEvent.keyboard("{ArrowRight}");

    expect(thumb).toHaveAttribute("aria-valuenow", "50");
    expect(onValueChange).not.toHaveBeenCalled();
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

  test("no label is rendered by default", async () => {
    const { container } = await renderSlider({ value: 50 });
    expect(container.querySelector("label")).toBeNull();
  });

  test("renders a label when supplied", async () => {
    const { container } = await renderSlider({ value: 50, label: "Volume" });

    const label = container.querySelector(".vesper-form-input-wrapper-label");
    expect(label).not.toBeNull();
    expect(label!.tagName).toBe("LABEL");
    expect(label).toHaveTextContent("Volume");
  });

  test("the label is associated with the thumb", async () => {
    const result = await renderSlider({ value: 50, label: "Volume" });

    const label = result.container.querySelector(
      ".vesper-form-input-wrapper-label",
    );
    expect(label).toHaveAttribute("for", result.thumb.id);
    expect(result.getByLabelText("Volume")).toBe(result.thumb);
  });

  test("an empty message is rendered by default", async () => {
    const result = await renderSlider({ value: 50 });

    const message = result.getByRole("status");
    expect(message).toHaveAttribute("data-message", "false");
    expect(message).toHaveTextContent("");
  });

  test("renders a message when supplied", async () => {
    const result = await renderSlider({ value: 50, message: "Pick a volume" });

    const message = result.getByRole("status");
    expect(message).toHaveAttribute("data-message", "true");
    expect(message).toHaveTextContent("Pick a volume");
  });

  test("the message is linked to the slider via aria-describedby", async () => {
    const result = await renderSlider({ value: 50, message: "Pick a volume" });

    const message = result.getByRole("status");
    expect(message.id).not.toBe("");
    expect(result.root).toHaveAttribute("aria-describedby", message.id);
  });

  test("aria-describedby is unset when no message is supplied", async () => {
    const { root } = await renderSlider({ value: 50 });
    expect(root).not.toHaveAttribute("aria-describedby");
  });

  test("a custom aria-describedby is preserved alongside the message id", async () => {
    const result = await renderSlider({
      value: 50,
      message: "Pick a volume",
      "aria-describedby": "external-description",
    });

    const message = result.getByRole("status");
    expect(result.root).toHaveAttribute(
      "aria-describedby",
      `external-description ${message.id}`,
    );
  });

  test("aria-invalid is forwarded to the slider", async () => {
    const { root } = await renderSlider({ value: 50, "aria-invalid": true });
    expect(root).toHaveAttribute("aria-invalid", "true");
  });

  test("custom className is merged onto the wrapper", async () => {
    const { wrapper, root } = await renderSlider({
      value: 50,
      className: "custom-slider",
    });

    expect(wrapper).toHaveClass("vesper-form-input-wrapper");
    expect(wrapper).toHaveClass("custom-slider");
    expect(root).toHaveClass("vesper-range");
    expect(root).not.toHaveClass("custom-slider");
  });

  test("additional props are passed through to the wrapper", async () => {
    const result = render(
      <Slider thumbAriaLabel="Volume" value={50} data-testid="my-slider" />,
    );
    await result.findByRole("slider");

    expect(result.container.firstElementChild).toHaveAttribute(
      "data-testid",
      "my-slider",
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
      const testName = `wcag2aaa (${name}, ${theme})`;

      const testFn = async () => {
        const { container } = await renderSlider(props);
        expect(await axe.run(container)).toHaveNoViolations();
      };

      const failsA11y =
        !!props.message &&
        SLIDER_A11Y_FAILING_MESSAGE_PERMUTATIONS.some(
          (p) =>
            p.theme === theme && p.variant === (props.variant ?? "default"),
        );

      if (failsA11y) test.todo(testName, testFn);
      else test(testName, testFn);
    });
  });
});
