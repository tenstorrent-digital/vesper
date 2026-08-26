import { cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import {
  Range,
  RANGE_VARIANTS,
  type RangeProps,
  type RangeVariant,
} from "@/components/range/range";

import "@/styles/test.css";

const THUMB_ARIA_LABELS = ["Range (min)", "Range (max)"];

/**
 * base-ui keeps the thumbs hidden until it has measured the track, so every
 * render is followed by an async role query to wait for them to settle.
 */
async function renderRange(props: Partial<RangeProps> = {}) {
  const result = render(
    <Range thumbAriaLabels={THUMB_ARIA_LABELS} {...props} />,
  );

  const thumbs = await result.findAllByRole("slider");
  const wrapper = result.container.firstElementChild as HTMLElement;
  const root = result.container.querySelector<HTMLElement>(".vesper-range")!;

  return { ...result, thumbs, wrapper, root };
}

const RANGE_SNAPSHOT_PERMUTATIONS: (Partial<RangeProps> & { name: string })[] =
  [
    { name: "default" },
    { name: "with custom min/max/step", min: 0, max: 10, step: 2 },
    { name: "with ticks", min: 0, max: 5, step: 1, showTicks: true },
    {
      name: "with value labels",
      showValueLabels: true,
      valueLabels: ["Min", "Max"],
    },
    {
      name: "with multiple values",
      values: [20, 40, 60, 80],
      valueLabels: ["A", "B", "C", "D"],
      showValueLabels: true,
    },
    { name: "disabled", disabled: true },
    { name: "with label", label: "Label text" },
    { name: "with message", message: "Message text" },
    // One per variant, with both a label and a message
    ...RANGE_VARIANTS.map((variant) => ({
      name: `variant: ${variant}`,
      variant,
      label: "Label text",
      message: "Message text",
    })),
  ];

const RANGE_A11Y_PERMUTATIONS: (Partial<RangeProps> & { name: string })[] = [
  { name: "default" },
  { name: "with ticks", min: 0, max: 5, step: 1, showTicks: true },
  {
    name: "with value labels",
    showValueLabels: true,
    valueLabels: ["$0", "$100"],
  },
  { name: "disabled", disabled: true },
  // One per variant, with both a label and a message
  ...RANGE_VARIANTS.map((variant) => ({
    name: `variant: ${variant}`,
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
const RANGE_A11Y_FAILING_MESSAGE_PERMUTATIONS: {
  variant: RangeVariant;
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

describe("range [unit]", () => {
  test("custom className is merged onto the wrapper", async () => {
    const { wrapper } = await renderRange({ className: "custom-class" });
    expect(wrapper).toHaveClass("custom-class");
  });

  test("additional props are passed through to the wrapper", async () => {
    const result = render(
      <Range thumbAriaLabels={THUMB_ARIA_LABELS} data-testid="range-slider" />,
    );
    await result.findAllByRole("slider");

    expect(result.container.firstElementChild).toHaveAttribute(
      "data-testid",
      "range-slider",
    );
  });

  test("thumb aria labels", async () => {
    const { thumbs } = await renderRange({
      thumbAriaLabels: ["Price (min)", "Price (max)"],
    });

    expect(thumbs[0]).toHaveAttribute("aria-label", "Price (min)");
    expect(thumbs[1]).toHaveAttribute("aria-label", "Price (max)");
  });

  test("renders two thumbs by default", async () => {
    const { thumbs } = await renderRange();
    expect(thumbs).toHaveLength(2);
  });

  test("renders thumbs matching values array length", async () => {
    const { thumbs } = await renderRange({ values: [10, 30, 50, 70] });
    expect(thumbs).toHaveLength(4);
  });

  test("default min/max/step values", async () => {
    const { thumbs } = await renderRange();

    expect(thumbs[0]).toHaveAttribute("min", "0");
    expect(thumbs[0]).toHaveAttribute("max", "100");
    expect(thumbs[0]).toHaveAttribute("step", "1");
    expect(thumbs[1]).toHaveAttribute("min", "0");
    expect(thumbs[1]).toHaveAttribute("max", "100");
    expect(thumbs[1]).toHaveAttribute("step", "1");
  });

  test("custom min and max", async () => {
    const { thumbs } = await renderRange({ min: 10, max: 50 });

    expect(thumbs[0]).toHaveAttribute("min", "10");
    expect(thumbs[0]).toHaveAttribute("max", "50");
  });

  test("defaultValues sets initial thumb positions", async () => {
    const { thumbs } = await renderRange({ defaultValues: [20, 80] });

    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "20");
    expect(thumbs[1]).toHaveAttribute("aria-valuenow", "80");
  });

  test("defaultValues defaults to [min, max]", async () => {
    const { thumbs } = await renderRange({ min: 5, max: 95 });

    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "5");
    expect(thumbs[1]).toHaveAttribute("aria-valuenow", "95");
  });

  test("controlled values", async () => {
    const { thumbs } = await renderRange({ values: [25, 75] });

    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "25");
    expect(thumbs[1]).toHaveAttribute("aria-valuenow", "75");
  });

  test("no label is rendered by default", async () => {
    const { container } = await renderRange();
    expect(container.querySelector("label")).toBeNull();
  });

  test("renders a label when supplied", async () => {
    const { container } = await renderRange({ label: "Price" });

    const label = container.querySelector(".vesper-form-input-wrapper-label");
    expect(label).not.toBeNull();
    expect(label!.tagName).toBe("LABEL");
    expect(label).toHaveTextContent("Price");
  });

  test("the label is associated with the first thumb", async () => {
    const result = await renderRange({ label: "Price" });

    const label = result.container.querySelector(
      ".vesper-form-input-wrapper-label",
    );
    expect(label).toHaveAttribute("for", result.thumbs[0]!.id);
    expect(result.getByLabelText("Price", { selector: "input" })).toBe(
      result.thumbs[0],
    );
  });

  test("an empty message is rendered by default", async () => {
    const result = await renderRange();

    const message = result.getByRole("status");
    expect(message).toHaveAttribute("data-message", "false");
    expect(message).toHaveTextContent("");
  });

  test("renders a message when supplied", async () => {
    const result = await renderRange({ message: "Pick a price range" });

    const message = result.getByRole("status");
    expect(message).toHaveAttribute("data-message", "true");
    expect(message).toHaveTextContent("Pick a price range");
  });

  test("the label is linked to the first thumb via htmlFor", async () => {
    const result = await renderRange({ label: "Price" });

    const label = result.container.querySelector<HTMLElement>(
      ".vesper-form-input-wrapper-label",
    )!;

    const [first] = result.thumbs;
    expect(label).toHaveAttribute("for", first?.id);
  });

  test("aria-label is forwarded to the slider root", async () => {
    const result = await renderRange({
      "aria-label": "Price in USD",
    });
    expect(result.root).toHaveAttribute("aria-label", "Price in USD");
  });

  test("aria-labelledby is forwarded to the slider root", async () => {
    const result = await renderRange({
      "aria-labelledby": "external-label",
    });
    expect(result.root).toHaveAttribute("aria-labelledby", "external-label");
  });

  test("the message is linked to the thumbs via aria-describedby", async () => {
    const result = await renderRange({ message: "Pick a price range" });

    const message = result.getByRole("status");
    expect(message.id).not.toBe("");

    result.thumbs.forEach((thumb) =>
      expect(thumb).toHaveAttribute("aria-describedby", message.id),
    );
  });

  test("aria-describedby is unset when no message is supplied", async () => {
    const { thumbs } = await renderRange();

    thumbs.forEach((thumb) =>
      expect(thumb).not.toHaveAttribute("aria-describedby"),
    );
  });

  test("a custom aria-describedby is preserved alongside the message id", async () => {
    const result = await renderRange({
      message: "Pick a price range",
      "aria-describedby": "external-description",
    });

    const message = result.getByRole("status");

    result.thumbs.forEach((thumb) =>
      expect(thumb).toHaveAttribute(
        "aria-describedby",
        `external-description ${message.id}`,
      ),
    );
  });

  test("a custom aria-describedby is used when no message is supplied", async () => {
    const result = await renderRange({
      "aria-describedby": "external-description",
    });

    result.thumbs.forEach((thumb) =>
      expect(thumb).toHaveAttribute("aria-describedby", "external-description"),
    );
  });

  test("showTicks renders tick marks", async () => {
    const { container } = await renderRange({
      min: 0,
      max: 5,
      step: 1,
      showTicks: true,
    });

    const ticks = container.querySelectorAll(".vesper-range-tick");
    // Ticks between min and max: Math.ceil((5 - 0) / 1) - 1 = 4
    expect(ticks).toHaveLength(4);
  });

  test("showTicks with different step values", async () => {
    const { container } = await renderRange({
      min: 0,
      max: 10,
      step: 2,
      showTicks: true,
    });

    const ticks = container.querySelectorAll(".vesper-range-tick");
    // Math.ceil((10 - 0) / 2) - 1 = 4
    expect(ticks).toHaveLength(4);
  });

  test("ticks are not rendered when showTicks is false", async () => {
    const { container } = await renderRange({ min: 0, max: 5, step: 1 });
    expect(container.querySelectorAll(".vesper-range-tick")).toHaveLength(0);
  });

  test("ticks are positioned as a fraction of the track", async () => {
    const { container } = await renderRange({
      min: 0,
      max: 100,
      step: 25,
      showTicks: true,
    });

    const ticks = container.querySelectorAll<HTMLElement>(".vesper-range-tick");
    const tickPositions = Array.from(ticks).map((tick) =>
      tick.style.getPropertyValue("--vesper-range-tick-position"),
    );
    expect(ticks).toHaveLength(3);
    expect(tickPositions).toEqual(["0.25", "0.5", "0.75"]);
  });

  test("ticks are not rendered for a non-positive step", async () => {
    const { container } = await renderRange({ step: 0, showTicks: true });
    expect(container.querySelectorAll(".vesper-range-tick")).toHaveLength(0);
  });

  test("ticks are not rendered for a non-finite step", async () => {
    const { container } = await renderRange({
      step: Infinity,
      showTicks: true,
    });
    expect(container.querySelectorAll(".vesper-range-tick")).toHaveLength(0);
  });

  test("showValueLabels adds the labeled class to the range", async () => {
    const { root } = await renderRange({ showValueLabels: true });
    expect(root).toHaveClass("vesper-range-labeled");
  });

  test("the range is not labeled when showValueLabels is false", async () => {
    const { root } = await renderRange();
    expect(root).not.toHaveClass("vesper-range-labeled");
  });

  test("showValueLabels adds labeled class to thumbs", async () => {
    const { container } = await renderRange({ showValueLabels: true });

    const thumbs = container.querySelectorAll(".vesper-range-thumb");
    thumbs.forEach((thumb) => {
      expect(thumb).toHaveClass("vesper-range-thumb-labeled");
    });
  });

  test("thumbs do not have labeled class when showValueLabels is false", async () => {
    const { container } = await renderRange();

    const thumbs = container.querySelectorAll(".vesper-range-thumb");
    thumbs.forEach((thumb) => {
      expect(thumb).not.toHaveClass("vesper-range-thumb-labeled");
    });
  });

  test("valueLabels sets CSS custom property on thumbs", async () => {
    const { container } = await renderRange({
      valueLabels: ["$10", "$90"],
      showValueLabels: true,
    });

    const thumbs = container.querySelectorAll<HTMLElement>(
      ".vesper-range-thumb",
    );

    expect(
      thumbs[0]!.style.getPropertyValue("--vesper-range-thumb-label"),
    ).toBe('"$10"');

    expect(
      thumbs[1]!.style.getPropertyValue("--vesper-range-thumb-label"),
    ).toBe('"$90"');
  });

  test("valueLabels with controlled values", async () => {
    const { container } = await renderRange({
      values: [10, 50, 90],
      valueLabels: ["Low", "Mid", "High"],
      showValueLabels: true,
    });

    const thumbs = container.querySelectorAll<HTMLElement>(
      ".vesper-range-thumb",
    );

    expect(thumbs).toHaveLength(3);

    expect(
      thumbs[0]!.style.getPropertyValue("--vesper-range-thumb-label"),
    ).toBe('"Low"');

    expect(
      thumbs[1]!.style.getPropertyValue("--vesper-range-thumb-label"),
    ).toBe('"Mid"');

    expect(
      thumbs[2]!.style.getPropertyValue("--vesper-range-thumb-label"),
    ).toBe('"High"');
  });

  test("value labels fall back to the thumb values", async () => {
    const { container } = await renderRange({
      values: [10, 90],
      showValueLabels: true,
    });

    const thumbs = container.querySelectorAll<HTMLElement>(
      ".vesper-range-thumb",
    );

    expect(
      thumbs[0]!.style.getPropertyValue("--vesper-range-thumb-label"),
    ).toBe('"10"');

    expect(
      thumbs[1]!.style.getPropertyValue("--vesper-range-thumb-label"),
    ).toBe('"90"');
  });

  test("no label custom property when showValueLabels is false", async () => {
    const { container } = await renderRange({ valueLabels: ["$10", "$90"] });

    const thumbs = container.querySelectorAll<HTMLElement>(
      ".vesper-range-thumb",
    );

    thumbs.forEach((thumb) => {
      expect(thumb.style.getPropertyValue("--vesper-range-thumb-label")).toBe(
        "",
      );
    });
  });

  test("disabled state", async () => {
    const { root } = await renderRange({ disabled: true });
    expect(root).toHaveAttribute("data-disabled", "");
  });

  test("disabled thumbs cannot be adjusted via keyboard", async () => {
    const onValuesChange = vi.fn();
    const { thumbs } = await renderRange({
      defaultValues: [25, 75],
      disabled: true,
      onValuesChange,
    });

    thumbs[0]!.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "25");

    await userEvent.keyboard("{ArrowLeft}");
    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "25");

    expect(onValuesChange).not.toHaveBeenCalled();
  });

  test("onValuesChange callback on keyboard interaction", async () => {
    const onValuesChange = vi.fn();
    const { thumbs } = await renderRange({
      defaultValues: [25, 75],
      onValuesChange,
    });

    thumbs[0]!.focus();
    expect(thumbs[0]).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");

    expect(onValuesChange).toHaveBeenCalled();
  });

  test("keyboard ArrowRight increases thumb value", async () => {
    const { thumbs } = await renderRange({
      defaultValues: [50, 75],
      step: 1,
    });

    thumbs[0]!.focus();
    expect(thumbs[0]).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");

    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "51");
  });

  test("keyboard ArrowLeft decreases thumb value", async () => {
    const { thumbs } = await renderRange({
      defaultValues: [50, 75],
      step: 1,
    });

    thumbs[0]!.focus();
    expect(thumbs[0]).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");

    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "49");
  });

  test("thumb value does not go below min", async () => {
    const { thumbs } = await renderRange({
      min: 0,
      max: 100,
      defaultValues: [0, 50],
    });

    thumbs[0]!.focus();
    expect(thumbs[0]).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");

    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "0");
  });

  test("thumb value does not go above max", async () => {
    const { thumbs } = await renderRange({
      min: 0,
      max: 100,
      defaultValues: [50, 100],
    });

    thumbs[1]!.focus();
    expect(thumbs[1]).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");

    expect(thumbs[1]).toHaveAttribute("aria-valuenow", "100");
  });

  test("step value affects keyboard increment", async () => {
    const { thumbs } = await renderRange({
      defaultValues: [50, 80],
      step: 5,
    });

    thumbs[0]!.focus();
    expect(thumbs[0]).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");

    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "55");
  });

  test("pressing the track moves the nearest thumb", async () => {
    const onValuesChange = vi.fn();
    const onValuesCommit = vi.fn();
    const { container, thumbs } = await renderRange({
      defaultValues: [0, 80],
      onValuesChange,
      onValuesCommit,
    });

    // clicking an element presses its center, ie. the middle of the track
    await userEvent.click(container.querySelector(".vesper-range-track")!);

    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "0");
    expect(thumbs[1]).toHaveAttribute("aria-valuenow", "50");

    expect(onValuesChange).toHaveBeenCalledWith([0, 50]);
    expect(onValuesCommit).toHaveBeenCalledWith([0, 50]);
  });

  test("disabled thumbs cannot be adjusted by pointer", async () => {
    const onValuesChange = vi.fn();
    const { container, thumbs } = await renderRange({
      defaultValues: [0, 80],
      disabled: true,
      onValuesChange,
    });

    await userEvent.click(container.querySelector(".vesper-range-track")!);

    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "0");
    expect(thumbs[1]).toHaveAttribute("aria-valuenow", "80");
    expect(onValuesChange).not.toHaveBeenCalled();
  });
});

describe("range [snapshot]", () => {
  RANGE_SNAPSHOT_PERMUTATIONS.forEach(({ name, ...props }) => {
    test(name, async () => {
      const { container } = await renderRange(props);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

describe("range [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    RANGE_A11Y_PERMUTATIONS.forEach(({ name, ...props }) => {
      const testName = `wcag2aaa (${name}, ${theme})`;

      const testFn = async () => {
        const { container } = await renderRange({
          thumbAriaLabels: ["Price (min)", "Price (max)"],
          ...props,
        });

        expect(await axe.run(container)).toHaveNoViolations();
      };

      const failsA11y =
        !!props.message &&
        RANGE_A11Y_FAILING_MESSAGE_PERMUTATIONS.some(
          (p) =>
            p.theme === theme && p.variant === (props.variant ?? "default"),
        );

      if (failsA11y) test.todo(testName, testFn);
      else test(testName, testFn);
    });
  });
});
