import { createRef } from "react";
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import {
  SCROLL_THUMB_VARIANTS,
  SCROLL_THUMB_VISIBILITIES,
  ScrollArea,
  ScrollAreaProps,
} from "@/components/scroll-area/scroll-area";

import "@/styles/test.css";

afterEach(cleanup);

interface ScrollAreaPermutation extends ScrollAreaProps {
  permutationName: string;
  scrollThumbCount: number;
}

const SCROLL_AREA_PERMUTATIONS: ScrollAreaPermutation[] =
  SCROLL_THUMB_VARIANTS.flatMap((thumbVariant) =>
    SCROLL_THUMB_VISIBILITIES.flatMap((thumbVisibility) => [
      {
        permutationName: `${thumbVariant}, ${thumbVisibility}, no overflow`,
        scrollThumbCount: 0,
        thumbVariant,
        thumbVisibility,
        style: { width: 200, height: 200 },
      },
      {
        permutationName: `${thumbVariant}, ${thumbVisibility}, y overflow`,
        scrollThumbCount: 1,
        thumbVariant,
        thumbVisibility,
        style: { width: 200, height: 200 },
        children: <div style={{ width: 200, height: 400 }} />,
      },
      {
        permutationName: `${thumbVariant}, ${thumbVisibility}, x overflow`,
        scrollThumbCount: 1,
        thumbVariant,
        thumbVisibility,
        style: { width: 200, height: 200 },
        children: <div style={{ width: 400, height: 200 }} />,
      },
      {
        permutationName: `${thumbVariant}, ${thumbVisibility}, x & y overflow`,
        scrollThumbCount: 2,
        thumbVariant,
        thumbVisibility,
        style: { width: 200, height: 200 },
        children: <div style={{ width: 400, height: 400 }} />,
      },
    ]),
  );

const getScrollbars = (result: RenderResult) =>
  result.container.querySelectorAll<HTMLElement>(
    ".vesper-scroll-area-scrollbar",
  );

const getViewport = (result: RenderResult) =>
  result.container.querySelector<HTMLElement>(".vesper-scroll-area-viewport");

const getScrollbarThumbs = (result: RenderResult) =>
  result.container.querySelectorAll<HTMLElement>(".vesper-scroll-area-thumb");

/** Wait for base-ui scrollbar rendering to settle */
const settleScrollbars = async (result: RenderResult, scrollThumbCount = 0) => {
  await waitFor(() => {
    expect(
      result.container.querySelectorAll(".vesper-scroll-area-thumb").length,
    ).toBe(scrollThumbCount);
  });

  result.container
    .querySelectorAll<HTMLElement>(".vesper-scroll-area-scrollbar")
    .forEach((scrollbar) => {
      fireEvent.pointerLeave(scrollbar);
      fireEvent.mouseLeave(scrollbar);
    });
};

describe("scroll-area [unit]", () => {
  test("renders a div", () => {
    const { container } = render(<ScrollArea />);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  test("renders its children", () => {
    const result = render(
      <ScrollArea>
        <p>hello world</p>
      </ScrollArea>,
    );
    expect(result.getByText("hello world")).not.toBeNull();
  });

  test("custom className", () => {
    const result = render(<ScrollArea className="custom-class" />);
    expect(result.container.firstChild).toHaveClass("vesper-scroll-area");
    expect(result.container.firstChild).toHaveClass("custom-class");
  });

  test("additional prop passthrough", () => {
    const result = render(
      <ScrollArea aria-label="Biography" id="biography-id" />,
    );
    expect(result.container.firstChild).toHaveAttribute(
      "aria-label",
      "Biography",
    );
    expect(result.container.firstChild).toHaveAttribute("id", "biography-id");
  });

  test("doesn't renders scrollbars when there is no overflow", async () => {
    const result = render(
      <ScrollArea style={{ width: 400, height: 400 }}>
        <div style={{ width: 200, height: 200 }} />
      </ScrollArea>,
    );

    await settleScrollbars(result);

    const thumbs = getScrollbarThumbs(result);
    expect(thumbs.length).toBe(0);
  });

  test("renders scrollbars when there is overflow", async () => {
    const result = render(
      <ScrollArea style={{ width: 200, height: 200 }}>
        <div style={{ width: 400, height: 400 }} />
      </ScrollArea>,
    );

    await settleScrollbars(result);

    const thumbs = getScrollbarThumbs(result);
    expect(thumbs.length).toBe(2);
  });

  test("viewportRef exposes the inner viewport element", async () => {
    const viewportRef = createRef<HTMLDivElement>();
    const { container } = render(
      <ScrollArea viewportRef={viewportRef} style={{ width: 200, height: 200 }}>
        <div style={{ width: 400, height: 400 }} />
      </ScrollArea>,
    );

    const viewport = container.querySelector(".vesper-scroll-area-viewport");
    expect(viewportRef.current).toBe(viewport);
  });

  test("viewportRef exposes the inner viewport element", async () => {
    const viewportRef = createRef<HTMLDivElement>();
    const result = render(
      <ScrollArea viewportRef={viewportRef} style={{ width: 200, height: 200 }}>
        <div style={{ width: 400, height: 400 }} />
      </ScrollArea>,
    );

    const viewport = getViewport(result);
    expect(viewportRef.current).toBe(viewport);
  });

  test("wheel and scroll handlers are forwarded to the viewport", async () => {
    const onScroll = vi.fn();
    const onScrollCapture = vi.fn();
    const onScrollEnd = vi.fn();
    const onScrollEndCapture = vi.fn();
    const onWheel = vi.fn();
    const onWheelCapture = vi.fn();

    const result = render(
      <ScrollArea
        style={{ width: 200, height: 200 }}
        onScroll={onScroll}
        onScrollCapture={onScrollCapture}
        onScrollEnd={onScrollEnd}
        onScrollEndCapture={onScrollEndCapture}
        onWheel={onWheel}
        onWheelCapture={onWheelCapture}
      >
        <div style={{ width: 400, height: 400 }} />
      </ScrollArea>,
    );

    await settleScrollbars(result);

    const viewport = getViewport(result)!;
    await userEvent.wheel(viewport, { delta: { y: 100 } });

    expect(onScroll).toHaveBeenCalled();
    expect(onScrollCapture).toHaveBeenCalled();
    expect(onScrollEnd).toHaveBeenCalled();
    expect(onScrollEndCapture).toHaveBeenCalled();
    expect(onWheel).toHaveBeenCalled();
    expect(onWheelCapture).toHaveBeenCalled();
  });

  SCROLL_THUMB_VARIANTS.forEach((variant) => {
    test(`when thumbVariant is "${variant}"`, async () => {
      const result = render(
        <ScrollArea thumbVariant={variant} style={{ width: 200, height: 200 }}>
          <div style={{ width: 400, height: 400 }} />
        </ScrollArea>,
      );

      await settleScrollbars(result);

      const thumbs = getScrollbarThumbs(result);
      thumbs.forEach((thumb) => {
        expect(thumb).toHaveClass(`vesper-scroll-area-thumb-${variant}`);
      });
    });
  });

  SCROLL_THUMB_VISIBILITIES.forEach((visibility) => {
    test(`when thumbVisibility is "${visibility}"`, async () => {
      const result = render(
        <ScrollArea
          thumbVisibility={visibility}
          style={{ width: 200, height: 200 }}
        >
          <div style={{ width: 400, height: 400 }} />
        </ScrollArea>,
      );

      await settleScrollbars(result);

      const scrollbars = getScrollbars(result);
      scrollbars.forEach((thumb) =>
        expect(thumb).toHaveAttribute("data-visibility", visibility),
      );
    });
  });
});

describe("scroll-area [snapshot]", () => {
  SCROLL_AREA_PERMUTATIONS.forEach((permutation) => {
    const { permutationName, scrollThumbCount, ...props } = permutation;

    test(permutationName, async () => {
      const result = render(<ScrollArea {...props} />);
      await settleScrollbars(result, scrollThumbCount);

      expect(result.container.firstChild).toMatchSnapshot();
    });
  });
});

describe("scroll-area [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    SCROLL_AREA_PERMUTATIONS.forEach((permutation) => {
      const { permutationName, scrollThumbCount, ...props } = permutation;

      test(`a11y (${theme}) ${permutationName}`, async () => {
        const result = render(<ScrollArea {...props} />);
        await settleScrollbars(result, scrollThumbCount);

        expect(await axe.run(result.container)).toHaveNoViolations();
      });
    });
  });
});
