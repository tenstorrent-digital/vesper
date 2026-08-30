import { cleanup, render, RenderResult } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

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
}

const SCROLL_AREA_PERMUTATIONS: ScrollAreaPermutation[] =
  SCROLL_THUMB_VARIANTS.flatMap((thumbVariant) =>
    SCROLL_THUMB_VISIBILITIES.flatMap((thumbVisibility) => [
      {
        permutationName: `${thumbVariant}, ${thumbVisibility}, no overflow`,
        thumbVariant,
        thumbVisibility,
        style: { width: 200, height: 200 },
      },
      {
        permutationName: `${thumbVariant}, ${thumbVisibility}, y overflow`,
        thumbVariant,
        thumbVisibility,
        style: { width: 200, height: 200 },
        children: <div style={{ width: 200, height: 400 }} />,
      },
      {
        permutationName: `${thumbVariant}, ${thumbVisibility}, x overflow`,
        thumbVariant,
        thumbVisibility,
        style: { width: 200, height: 200 },
        children: <div style={{ width: 400, height: 200 }} />,
      },
      {
        permutationName: `${thumbVariant}, ${thumbVisibility}, x & y overflow`,
        thumbVariant,
        thumbVisibility,
        style: { width: 200, height: 200 },
        children: <div style={{ width: 400, height: 400 }} />,
      },
    ]),
  );

const flushEffects = () => new Promise((r) => setTimeout(r, 0));

const getScrollbars = (result: RenderResult) =>
  result.container.querySelectorAll<HTMLElement>(
    ".vesper-scroll-area-scrollbar",
  );

const getScrollbarThumbs = (result: RenderResult) =>
  result.container.querySelectorAll<HTMLElement>(".vesper-scroll-area-thumb");

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

    await flushEffects();

    const thumbs = getScrollbarThumbs(result);
    expect(thumbs.length).toBe(0);
  });

  test("renders scrollbars when there is overflow", async () => {
    const result = render(
      <ScrollArea style={{ width: 200, height: 200 }}>
        <div style={{ width: 400, height: 400 }} />
      </ScrollArea>,
    );

    await flushEffects();

    const thumbs = getScrollbarThumbs(result);
    expect(thumbs.length).toBe(2);
  });

  SCROLL_THUMB_VARIANTS.forEach((variant) => {
    test(`when thumbVariant is "${variant}"`, async () => {
      const result = render(
        <ScrollArea thumbVariant={variant} style={{ width: 200, height: 200 }}>
          <div style={{ width: 400, height: 400 }} />
        </ScrollArea>,
      );

      await flushEffects();

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

      await flushEffects();

      const scrollbars = getScrollbars(result);
      scrollbars.forEach((thumb) =>
        expect(thumb).toHaveAttribute("data-visibility", visibility),
      );
    });
  });
});

describe("scroll-area [snapshot]", () => {
  SCROLL_AREA_PERMUTATIONS.forEach((permutation) => {
    const { permutationName, ...props } = permutation;

    test(permutationName, async () => {
      const { container } = render(<ScrollArea {...props} />);
      await flushEffects();

      expect(container.firstChild).toMatchSnapshot();
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
      const { permutationName, ...props } = permutation;

      test(`a11y (${theme}) ${permutationName}`, async () => {
        const { container } = render(<ScrollArea {...props} />);
        await flushEffects();

        expect(await axe.run(container)).toHaveNoViolations();
      });
    });
  });
});
