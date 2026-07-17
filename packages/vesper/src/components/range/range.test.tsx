import { cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { Range } from "@/components/range/range";

import "@/styles/test.css";

afterEach(cleanup);

describe("range [unit]", () => {
  test("custom className is merged", () => {
    const { container } = render(
      <Range aria-label="Range" className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass("vesper-range");
    expect(container.firstChild).toHaveClass("custom-class");
  });

  test("additional props are passed through", () => {
    const { container } = render(
      <Range aria-label="Range" data-testid="range-slider" />,
    );
    expect(container.firstChild).toHaveAttribute("data-testid", "range-slider");
  });

  test("thumb aria labels", () => {
    const result = render(
      <Range thumbAriaLabels={["Price (min)", "Price (max)"]} />,
    );
    const thumbs = result.getAllByRole("slider");

    expect(thumbs[0]).toHaveAttribute("aria-label", "Price (min)");
    expect(thumbs[1]).toHaveAttribute("aria-label", "Price (max)");
  });

  test("renders two thumbs by default", () => {
    const result = render(<Range aria-label="Range" />);
    const thumbs = result.getAllByRole("slider");
    expect(thumbs).toHaveLength(2);
  });

  test("renders thumbs matching values array length", () => {
    const result = render(
      <Range aria-label="Range" values={[10, 30, 50, 70]} />,
    );
    const thumbs = result.getAllByRole("slider");
    expect(thumbs).toHaveLength(4);
  });

  test("default min/max/step values", () => {
    const result = render(<Range aria-label="Range" />);
    const thumbs = result.getAllByRole("slider");
    expect(thumbs[0]).toHaveAttribute("aria-valuemin", "0");
    expect(thumbs[0]).toHaveAttribute("aria-valuemax", "100");
    expect(thumbs[1]).toHaveAttribute("aria-valuemin", "0");
    expect(thumbs[1]).toHaveAttribute("aria-valuemax", "100");
  });

  test("custom min and max", () => {
    const result = render(<Range aria-label="Range" min={10} max={50} />);
    const thumbs = result.getAllByRole("slider");
    expect(thumbs[0]).toHaveAttribute("aria-valuemin", "10");
    expect(thumbs[0]).toHaveAttribute("aria-valuemax", "50");
  });

  test("defaultValues sets initial thumb positions", () => {
    const result = render(
      <Range aria-label="Range" defaultValues={[20, 80]} />,
    );
    const thumbs = result.getAllByRole("slider");
    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "20");
    expect(thumbs[1]).toHaveAttribute("aria-valuenow", "80");
  });

  test("defaultValues defaults to [min, max]", () => {
    const result = render(<Range aria-label="Range" min={5} max={95} />);
    const thumbs = result.getAllByRole("slider");
    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "5");
    expect(thumbs[1]).toHaveAttribute("aria-valuenow", "95");
  });

  test("controlled values", () => {
    const result = render(<Range aria-label="Range" values={[25, 75]} />);
    const thumbs = result.getAllByRole("slider");
    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "25");
    expect(thumbs[1]).toHaveAttribute("aria-valuenow", "75");
  });

  test("showTicks renders tick marks", () => {
    const { container } = render(
      <Range aria-label="Range" min={0} max={5} step={1} showTicks />,
    );
    const ticks = container.querySelectorAll(".vesper-range-tick");
    // Ticks between min and max: Math.ceil((5 - 0) / 1) - 1 = 4
    expect(ticks).toHaveLength(4);
  });

  test("showTicks with different step values", () => {
    const { container } = render(
      <Range aria-label="Range" min={0} max={10} step={2} showTicks />,
    );
    const ticks = container.querySelectorAll(".vesper-range-tick");
    // Math.ceil((10 - 0) / 2) - 1 = 4
    expect(ticks).toHaveLength(4);
  });

  test("ticks are not rendered when showTicks is false", () => {
    const { container } = render(
      <Range aria-label="Range" min={0} max={5} step={1} />,
    );
    const ticks = container.querySelectorAll(".vesper-range-tick");
    expect(ticks).toHaveLength(0);
  });

  test("tick positioning uses correct left percentage", () => {
    const { container } = render(
      <Range aria-label="Range" min={0} max={100} step={25} showTicks />,
    );
    const ticks = container.querySelectorAll(".vesper-range-tick");
    // tickLeft = 100 / (100 - 0) = 1
    // positions: 1 * 25 = 25%, 1 * 50 = 50%, 1 * 75 = 75%
    expect(ticks).toHaveLength(3);
    expect((ticks[0] as HTMLElement).style.left).toBe("25%");
    expect((ticks[1] as HTMLElement).style.left).toBe("50%");
    expect((ticks[2] as HTMLElement).style.left).toBe("75%");
  });

  test("showValueLabels adds labeled class to thumbs", () => {
    const { container } = render(<Range aria-label="Range" showValueLabels />);
    const thumbs = container.querySelectorAll(".vesper-range-thumb");
    thumbs.forEach((thumb) => {
      expect(thumb).toHaveClass("vesper-range-thumb-labeled");
    });
  });

  test("thumbs do not have labeled class when showValueLabels is false", () => {
    const { container } = render(<Range aria-label="Range" />);
    const thumbs = container.querySelectorAll(".vesper-range-thumb");
    thumbs.forEach((thumb) => {
      expect(thumb).not.toHaveClass("vesper-range-thumb-labeled");
    });
  });

  test("valueLabels sets CSS custom property on thumbs", () => {
    const { container } = render(
      <Range aria-label="Range" valueLabels={["$10", "$90"]} showValueLabels />,
    );

    const thumbs = container.querySelectorAll(
      ".vesper-range-thumb",
    ) as NodeListOf<HTMLElement>;

    expect(
      thumbs[0]!.style.getPropertyValue("--vesper-range-thumb-label"),
    ).toBe('"$10"');

    expect(
      thumbs[1]!.style.getPropertyValue("--vesper-range-thumb-label"),
    ).toBe('"$90"');
  });

  test("valueLabels with controlled values", () => {
    const { container } = render(
      <Range
        aria-label="Range"
        values={[10, 50, 90]}
        valueLabels={["Low", "Mid", "High"]}
        showValueLabels
      />,
    );
    const thumbs = container.querySelectorAll(
      ".vesper-range-thumb",
    ) as NodeListOf<HTMLElement>;

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

  test("no inline style when valueLabels are not provided", () => {
    const { container } = render(<Range aria-label="Range" showValueLabels />);

    const thumbs = container.querySelectorAll(
      ".vesper-range-thumb",
    ) as NodeListOf<HTMLElement>;

    thumbs.forEach((thumb) => {
      expect(thumb.style.getPropertyValue("--vesper-range-thumb-label")).toBe(
        "",
      );
    });
  });

  test("disabled state", () => {
    const { container } = render(<Range aria-label="Range" disabled />);
    expect(container.firstChild).toHaveAttribute("data-disabled", "");
  });

  test("disabled thumbs cannot be adjusted via keyboard", async () => {
    const onValuesChange = vi.fn();
    const result = render(
      <Range
        aria-label="Range"
        defaultValues={[25, 75]}
        disabled
        onValuesChange={onValuesChange}
      />,
    );
    const thumbs = result.getAllByRole("slider");

    thumbs[0]!.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "25");

    await userEvent.keyboard("{ArrowLeft}");
    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "25");

    expect(onValuesChange).not.toHaveBeenCalled();
  });

  test("onValuesChange callback on keyboard interaction", async () => {
    const onValuesChange = vi.fn();
    const result = render(
      <Range
        aria-label="Range"
        defaultValues={[25, 75]}
        onValuesChange={onValuesChange}
      />,
    );
    const thumbs = result.getAllByRole("slider");

    thumbs[0]!.focus();
    expect(thumbs[0]).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");

    expect(onValuesChange).toHaveBeenCalled();
  });

  test("keyboard ArrowRight increases thumb value", async () => {
    const result = render(
      <Range aria-label="Range" defaultValues={[50, 75]} step={1} />,
    );
    const thumbs = result.getAllByRole("slider");

    thumbs[0]!.focus();
    expect(thumbs[0]).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");

    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "51");
  });

  test("keyboard ArrowLeft decreases thumb value", async () => {
    const result = render(
      <Range aria-label="Range" defaultValues={[50, 75]} step={1} />,
    );
    const thumbs = result.getAllByRole("slider");

    thumbs[0]!.focus();
    expect(thumbs[0]).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");

    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "49");
  });

  test("thumb value does not go below min", async () => {
    const result = render(
      <Range aria-label="Range" min={0} max={100} defaultValues={[0, 50]} />,
    );
    const thumbs = result.getAllByRole("slider");

    thumbs[0]!.focus();
    expect(thumbs[0]).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");

    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "0");
  });

  test("thumb value does not go above max", async () => {
    const result = render(
      <Range aria-label="Range" min={0} max={100} defaultValues={[50, 100]} />,
    );
    const thumbs = result.getAllByRole("slider");

    thumbs[1]!.focus();
    expect(thumbs[1]).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");

    expect(thumbs[1]).toHaveAttribute("aria-valuenow", "100");
  });

  test("step value affects keyboard increment", async () => {
    const result = render(
      <Range aria-label="Range" defaultValues={[50, 80]} step={5} />,
    );
    const thumbs = result.getAllByRole("slider");

    thumbs[0]!.focus();
    expect(thumbs[0]).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");

    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "55");
  });
});

describe("range [snapshot]", () => {
  test("default", () => {
    const { container } = render(<Range aria-label="Range" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("with custom min/max/step", () => {
    const { container } = render(
      <Range aria-label="Range" min={0} max={10} step={2} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("with ticks", () => {
    const { container } = render(
      <Range aria-label="Range" min={0} max={5} step={1} showTicks />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("with value labels", () => {
    const { container } = render(
      <Range aria-label="Range" showValueLabels valueLabels={["Min", "Max"]} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("with multiple values", () => {
    const { container } = render(
      <Range
        aria-label="Range"
        values={[20, 40, 60, 80]}
        valueLabels={["A", "B", "C", "D"]}
        showValueLabels
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("disabled", () => {
    const { container } = render(<Range aria-label="Range" disabled />);
    expect(container.firstChild).toMatchSnapshot();
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

    test.todo(`a11y (default, ${theme})`, async () => {
      const { container } = render(<Range aria-label="Price range" />);

      expect(await axe.run(container)).toHaveNoViolations();
    });

    test.todo(`a11y (with ticks, ${theme})`, async () => {
      const { container } = render(
        <Range aria-label="Price range" min={0} max={5} step={1} showTicks />,
      );

      expect(await axe.run(container)).toHaveNoViolations();
    });

    test.todo(`a11y (with value labels, ${theme})`, async () => {
      const { container } = render(
        <Range
          aria-label="Price range"
          showValueLabels
          valueLabels={["$0", "$100"]}
        />,
      );

      expect(await axe.run(container)).toHaveNoViolations();
    });

    test.todo(`a11y (disabled, ${theme})`, async () => {
      const { container } = render(<Range aria-label="Price range" disabled />);

      expect(await axe.run(container)).toHaveNoViolations();
    });
  });
});
