import { cleanup, render, RenderResult } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { Range, type RangeProps } from "@/components/range/range";

import "@/styles/test.css";

const THUMB_ARIA_LABELS = ["Range (min)", "Range (max)"];

async function getRangeSliders(result: RenderResult) {
  return await result.findAllByRole("slider");
}

async function getRangeThumbs(result: RenderResult) {
  return (await getRangeSliders(result)).map((slider) => slider.parentElement!);
}

function getRangeTicks(result: RenderResult) {
  return result.container.querySelectorAll<HTMLElement>(".vesper-range-tick");
}

function getRangeTrack(result: RenderResult) {
  return result.container.querySelector<HTMLElement>(".vesper-range-track")!;
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
];

afterEach(cleanup);

describe("range [unit]", () => {
  test("custom className is merged onto the wrapper", async () => {
    const result = render(
      <Range thumbAriaLabels={THUMB_ARIA_LABELS} className="custom-class" />,
    );
    expect(result.container.firstChild).toHaveClass("custom-class");
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
    const result = render(
      <Range thumbAriaLabels={["Price (min)", "Price (max)"]} />,
    );

    const sliders = await getRangeSliders(result);

    expect(sliders[0]).toHaveAttribute("aria-label", "Price (min)");
    expect(sliders[1]).toHaveAttribute("aria-label", "Price (max)");
  });

  test("renders two thumbs by default", async () => {
    const result = render(<Range thumbAriaLabels={THUMB_ARIA_LABELS} />);
    const sliders = await getRangeSliders(result);
    expect(sliders).toHaveLength(2);
  });

  test("renders thumbs matching values array length", async () => {
    const result = render(
      <Range thumbAriaLabels={THUMB_ARIA_LABELS} values={[10, 30, 50, 70]} />,
    );
    const sliders = await getRangeSliders(result);
    expect(sliders).toHaveLength(4);
  });

  test("default min/max/step values", async () => {
    const result = render(<Range thumbAriaLabels={THUMB_ARIA_LABELS} />);
    const sliders = await getRangeSliders(result);

    expect(sliders[0]).toHaveAttribute("min", "0");
    expect(sliders[0]).toHaveAttribute("max", "100");
    expect(sliders[0]).toHaveAttribute("step", "1");
    expect(sliders[1]).toHaveAttribute("min", "0");
    expect(sliders[1]).toHaveAttribute("max", "100");
    expect(sliders[1]).toHaveAttribute("step", "1");
  });

  test("custom min and max", async () => {
    const result = render(
      <Range thumbAriaLabels={THUMB_ARIA_LABELS} min={10} max={50} />,
    );
    const sliders = await getRangeSliders(result);

    expect(sliders[0]).toHaveAttribute("min", "10");
    expect(sliders[0]).toHaveAttribute("max", "50");
  });

  test("defaultValues sets initial thumb positions", async () => {
    const result = render(
      <Range thumbAriaLabels={THUMB_ARIA_LABELS} defaultValues={[20, 80]} />,
    );
    const sliders = await getRangeSliders(result);

    expect(sliders[0]).toHaveAttribute("aria-valuenow", "20");
    expect(sliders[1]).toHaveAttribute("aria-valuenow", "80");
  });

  test("defaultValues defaults to [min, max]", async () => {
    const result = render(
      <Range thumbAriaLabels={THUMB_ARIA_LABELS} min={5} max={95} />,
    );
    const sliders = await getRangeSliders(result);

    expect(sliders[0]).toHaveAttribute("aria-valuenow", "5");
    expect(sliders[1]).toHaveAttribute("aria-valuenow", "95");
  });

  test("controlled values", async () => {
    const result = render(
      <Range thumbAriaLabels={THUMB_ARIA_LABELS} values={[25, 75]} />,
    );
    const sliders = await getRangeSliders(result);

    expect(sliders[0]).toHaveAttribute("aria-valuenow", "25");
    expect(sliders[1]).toHaveAttribute("aria-valuenow", "75");
  });

  test("aria-labelledby is forwarded to the first thumb", async () => {
    const result = render(
      <Range thumbAriaLabels={THUMB_ARIA_LABELS} aria-labelledby="label-id" />,
    );
    const sliders = await getRangeSliders(result);
    expect(sliders[0]).toHaveAttribute("aria-labelledby", "label-id");
    expect(sliders[1]).not.toHaveAttribute("aria-labelledby", "label-id");
  });

  test("aria-describedby is forwarded to all thumbs", async () => {
    const result = render(
      <Range
        thumbAriaLabels={THUMB_ARIA_LABELS}
        aria-describedby="description-id"
      />,
    );
    const sliders = await getRangeSliders(result);
    sliders.forEach((thumb) => {
      expect(thumb).toHaveAttribute("aria-describedby", "description-id");
    });
  });

  test("other aria attributes are forwarded to the slider root", async () => {
    const result = render(
      <Range thumbAriaLabels={THUMB_ARIA_LABELS} aria-label="Price range" />,
    );
    expect(result.container.firstChild).toHaveAttribute(
      "aria-label",
      "Price range",
    );
  });

  test("showTicks renders tick marks", async () => {
    const result = render(
      <Range
        thumbAriaLabels={THUMB_ARIA_LABELS}
        min={0}
        max={5}
        step={1}
        showTicks
      />,
    );

    // Ticks between min and max: Math.ceil((5 - 0) / 1) - 1 = 4
    const ticks = getRangeTicks(result);
    expect(ticks).toHaveLength(4);
  });

  test("showTicks with different step values", async () => {
    const result = render(
      <Range
        thumbAriaLabels={THUMB_ARIA_LABELS}
        min={0}
        max={10}
        step={2}
        showTicks
      />,
    );

    // Math.ceil((10 - 0) / 2) - 1 = 4
    const ticks = getRangeTicks(result);
    expect(ticks).toHaveLength(4);
  });

  test("ticks are not rendered when showTicks is false", async () => {
    const result = render(
      <Range thumbAriaLabels={THUMB_ARIA_LABELS} min={0} max={5} step={1} />,
    );

    const ticks = getRangeTicks(result);
    expect(ticks).toHaveLength(0);
  });

  test("ticks are positioned as a fraction of the track", async () => {
    const result = render(
      <Range
        thumbAriaLabels={THUMB_ARIA_LABELS}
        min={0}
        max={100}
        step={25}
        showTicks
      />,
    );

    const ticks = getRangeTicks(result);
    const tickPositions = Array.from(ticks).map((tick) =>
      tick.style.getPropertyValue("--vesper-range-tick-position"),
    );
    expect(ticks).toHaveLength(3);
    expect(tickPositions).toEqual(["0.25", "0.5", "0.75"]);
  });

  test("ticks are not rendered for a non-positive step", async () => {
    const result = render(
      <Range thumbAriaLabels={THUMB_ARIA_LABELS} step={0} showTicks />,
    );
    const ticks = getRangeTicks(result);
    expect(ticks).toHaveLength(0);
  });

  test("ticks are not rendered for a non-finite step", async () => {
    const result = render(
      <Range thumbAriaLabels={THUMB_ARIA_LABELS} step={Infinity} showTicks />,
    );
    const ticks = getRangeTicks(result);
    expect(ticks).toHaveLength(0);
  });

  test("showValueLabels adds the labeled class to the range", async () => {
    const result = render(
      <Range thumbAriaLabels={THUMB_ARIA_LABELS} showValueLabels />,
    );
    expect(result.container.firstChild).toHaveClass("vesper-range-labeled");
  });

  test("showValueLabels adds labeled class to thumbs", async () => {
    const result = render(
      <Range thumbAriaLabels={THUMB_ARIA_LABELS} showValueLabels />,
    );

    const thumbs = await getRangeThumbs(result);
    thumbs.forEach((thumb) => {
      expect(thumb).toHaveClass("vesper-range-thumb-labeled");
    });
  });

  test("the range is not labeled when showValueLabels is false", async () => {
    const result = render(
      <Range thumbAriaLabels={THUMB_ARIA_LABELS} showValueLabels={false} />,
    );
    expect(result.container.firstChild).not.toHaveClass("vesper-range-labeled");
  });

  test("thumbs do not have labeled class when showValueLabels is false", async () => {
    const result = render(
      <Range thumbAriaLabels={THUMB_ARIA_LABELS} showValueLabels={false} />,
    );

    const thumbs = await getRangeThumbs(result);
    thumbs.forEach((thumb) => {
      expect(thumb).not.toHaveClass("vesper-range-thumb-labeled");
    });
  });

  test("valueLabels sets CSS custom property on thumbs", async () => {
    const result = render(
      <Range
        thumbAriaLabels={THUMB_ARIA_LABELS}
        defaultValues={[10, 50, 90]}
        valueLabels={["Low", "Mid", "High"]}
        showValueLabels
      />,
    );

    const thumbs = await getRangeThumbs(result);
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
    const { container } = render(
      <Range
        thumbAriaLabels={THUMB_ARIA_LABELS}
        defaultValues={[10, 90]}
        showValueLabels
      />,
    );

    const sliders = container.querySelectorAll<HTMLElement>(
      ".vesper-range-thumb",
    );

    expect(
      sliders[0]!.style.getPropertyValue("--vesper-range-thumb-label"),
    ).toBe('"10"');

    expect(
      sliders[1]!.style.getPropertyValue("--vesper-range-thumb-label"),
    ).toBe('"90"');
  });

  test("no label custom property when showValueLabels is false", async () => {
    const result = render(
      <Range
        thumbAriaLabels={THUMB_ARIA_LABELS}
        valueLabels={["$10", "$90"]}
      />,
    );

    const sliders = await getRangeSliders(result);

    sliders.forEach((thumb) => {
      expect(thumb.style.getPropertyValue("--vesper-range-thumb-label")).toBe(
        "",
      );
    });
  });

  test("disabled state", async () => {
    const result = render(
      <Range thumbAriaLabels={THUMB_ARIA_LABELS} disabled />,
    );
    expect(result.container.firstChild).toHaveAttribute("data-disabled", "");
  });

  test("disabled thumbs cannot be adjusted via keyboard", async () => {
    const onValuesChange = vi.fn();
    const result = render(
      <Range
        thumbAriaLabels={THUMB_ARIA_LABELS}
        defaultValues={[25, 75]}
        onValuesChange={onValuesChange}
        disabled
      />,
    );

    const sliders = await getRangeSliders(result);

    sliders[0]!.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(sliders[0]).toHaveAttribute("aria-valuenow", "25");

    await userEvent.keyboard("{ArrowLeft}");
    expect(sliders[0]).toHaveAttribute("aria-valuenow", "25");

    expect(onValuesChange).not.toHaveBeenCalled();
  });

  test("onValuesChange callback on keyboard interaction", async () => {
    const onValuesChange = vi.fn();
    const result = render(
      <Range
        thumbAriaLabels={THUMB_ARIA_LABELS}
        defaultValues={[25, 75]}
        onValuesChange={onValuesChange}
      />,
    );

    const sliders = await getRangeSliders(result);

    sliders[0]!.focus();
    expect(sliders[0]).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");

    expect(onValuesChange).toHaveBeenCalled();
  });

  test("keyboard ArrowRight increases thumb value", async () => {
    const result = render(
      <Range
        thumbAriaLabels={THUMB_ARIA_LABELS}
        defaultValues={[50, 75]}
        step={1}
      />,
    );

    const sliders = await getRangeSliders(result);

    sliders[0]!.focus();
    expect(sliders[0]).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");

    expect(sliders[0]).toHaveAttribute("aria-valuenow", "51");
  });

  test("keyboard ArrowLeft decreases thumb value", async () => {
    const result = render(
      <Range
        thumbAriaLabels={THUMB_ARIA_LABELS}
        defaultValues={[50, 75]}
        step={1}
      />,
    );

    const sliders = await getRangeSliders(result);

    sliders[0]!.focus();
    expect(sliders[0]).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");

    expect(sliders[0]).toHaveAttribute("aria-valuenow", "49");
  });

  test("thumb value does not go below min", async () => {
    const result = render(
      <Range
        thumbAriaLabels={THUMB_ARIA_LABELS}
        min={0}
        max={100}
        defaultValues={[0, 50]}
      />,
    );

    const sliders = await getRangeSliders(result);

    sliders[0]!.focus();
    expect(sliders[0]).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");

    expect(sliders[0]).toHaveAttribute("aria-valuenow", "0");
  });

  test("thumb value does not go above max", async () => {
    const result = render(
      <Range
        thumbAriaLabels={THUMB_ARIA_LABELS}
        min={0}
        max={100}
        defaultValues={[50, 100]}
      />,
    );

    const sliders = await getRangeSliders(result);

    sliders[1]!.focus();
    expect(sliders[1]).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");

    expect(sliders[1]).toHaveAttribute("aria-valuenow", "100");
  });

  test("step value affects keyboard increment", async () => {
    const result = render(
      <Range
        thumbAriaLabels={THUMB_ARIA_LABELS}
        step={5}
        defaultValues={[50, 80]}
      />,
    );

    const sliders = await getRangeSliders(result);

    sliders[0]!.focus();
    expect(sliders[0]).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");

    expect(sliders[0]).toHaveAttribute("aria-valuenow", "55");
  });

  test("pressing the track moves the nearest thumb", async () => {
    const onValuesChange = vi.fn();
    const onValuesCommit = vi.fn();
    const result = render(
      <Range
        thumbAriaLabels={THUMB_ARIA_LABELS}
        defaultValues={[0, 80]}
        onValuesChange={onValuesChange}
        onValuesCommit={onValuesCommit}
      />,
    );

    const sliders = await getRangeSliders(result);
    const track = getRangeTrack(result);

    // clicking an element presses its center, ie. the middle of the track
    await userEvent.click(track);

    expect(sliders[0]).toHaveAttribute("aria-valuenow", "0");
    expect(sliders[1]).toHaveAttribute("aria-valuenow", "50");

    expect(onValuesChange).toHaveBeenCalledWith([0, 50]);
    expect(onValuesCommit).toHaveBeenCalledWith([0, 50]);
  });

  test("disabled thumbs cannot be adjusted by pointer", async () => {
    const onValuesChange = vi.fn();
    const result = render(
      <Range
        thumbAriaLabels={THUMB_ARIA_LABELS}
        defaultValues={[0, 80]}
        onValuesChange={onValuesChange}
        disabled
      />,
    );

    const sliders = await getRangeSliders(result);
    const track = getRangeTrack(result);

    // clicking an element presses its center, ie. the middle of the track
    await userEvent.click(track);

    expect(sliders[0]).toHaveAttribute("aria-valuenow", "0");
    expect(sliders[1]).toHaveAttribute("aria-valuenow", "80");
    expect(onValuesChange).not.toHaveBeenCalled();
  });
});

describe("range [snapshot]", () => {
  RANGE_SNAPSHOT_PERMUTATIONS.forEach(({ name, ...props }) => {
    test(name, async () => {
      const { container } = render(
        <Range thumbAriaLabels={THUMB_ARIA_LABELS} {...props} />,
      );
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
      test(`wcag2aaa (${name}, ${theme})`, async () => {
        const { container } = render(
          <Range thumbAriaLabels={THUMB_ARIA_LABELS} {...props} />,
        );
        expect(await axe.run(container)).toHaveNoViolations();
      });
    });
  });
});
