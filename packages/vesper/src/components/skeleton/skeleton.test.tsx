import { render, cleanup, fireEvent } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import {
  Skeleton,
  SKELETON_SHAPES,
  type SkeletonShape,
} from "@/components/skeleton/skeleton";

import "@/styles/test.css";

afterEach(cleanup);

describe("skeleton [unit]", () => {
  test("renders a div", () => {
    const { container } = render(<Skeleton show />);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  test("applies vesper-skeleton class", () => {
    const { container } = render(<Skeleton show />);
    expect(container.firstElementChild).toHaveClass("vesper-skeleton");
  });

  test("custom className is merged", () => {
    const { container } = render(<Skeleton show className="custom-class" />);
    expect(container.firstElementChild).toHaveClass("vesper-skeleton");
    expect(container.firstElementChild).toHaveClass("custom-class");
  });

  test("additional prop passthrough", () => {
    const { container } = render(
      <Skeleton show data-testid="skeleton" aria-label="loading" />,
    );
    expect(container.firstElementChild).toHaveAttribute(
      "aria-label",
      "loading",
    );
  });

  test("size prop sets width and height", () => {
    const { container } = render(<Skeleton show size={100} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.width).toBe("100px");
    expect(el.style.height).toBe("100px");
  });

  test("width prop sets width", () => {
    const { container } = render(<Skeleton show width={200} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.width).toBe("200px");
  });

  test("height prop sets height", () => {
    const { container } = render(<Skeleton show height={150} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.height).toBe("150px");
  });

  test("size prop overrides width and height", () => {
    const { container } = render(
      <Skeleton show size={80} width={200} height={150} />,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.width).toBe("80px");
    expect(el.style.height).toBe("80px");
  });

  test("style prop is merged with size styles", () => {
    const { container } = render(
      <Skeleton show size={80} style={{ backgroundColor: "red" }} />,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.width).toBe("80px");
    expect(el.style.backgroundColor).toBe("red");
  });

  test("renders children", () => {
    const { container } = render(
      <Skeleton show>
        <span data-testid="child">Content</span>
      </Skeleton>,
    );
    expect(container.querySelector("[data-testid='child']")).not.toBeNull();
  });

  test("renders overlay element", () => {
    const { container } = render(<Skeleton show />);
    expect(container.querySelector(".vesper-skeleton-overlay")).not.toBeNull();
  });

  describe("shape", () => {
    test("defaults to box shape", () => {
      const { container } = render(<Skeleton show />);
      const rect = container.querySelector("rect");
      expect(rect).toHaveAttribute("rx", "var(--vesper-radius-1)");
    });

    test("box shape applies rx with radius token", () => {
      const { container } = render(<Skeleton show shape="box" />);
      const rect = container.querySelector("rect");
      expect(rect).toHaveAttribute("rx", "var(--vesper-radius-1)");
    });

    test("circle shape applies 50% rx", () => {
      const { container } = render(<Skeleton show shape="circle" />);
      const rect = container.querySelector("rect");
      expect(rect).toHaveAttribute("rx", "50%");
    });

    test("pill shape applies 50% ry", () => {
      const { container } = render(<Skeleton show shape="pill" />);
      const rect = container.querySelector("rect");
      expect(rect).toHaveAttribute("ry", "50%");
    });

    test("pill shape does not apply rx", () => {
      const { container } = render(<Skeleton show shape="pill" />);
      const rect = container.querySelector("rect");
      expect(rect).not.toHaveAttribute("rx");
    });
  });

  test("renders skeleton wrapper when show is true", () => {
    const { container } = render(<Skeleton show />);
    expect(container.firstElementChild).toHaveClass("vesper-skeleton");
    expect(container.querySelector(".vesper-skeleton-overlay")).not.toBeNull();
  });

  test("does not apply hidden class when show is true", () => {
    const { container } = render(<Skeleton show />);
    expect(container.firstElementChild).not.toHaveClass(
      "vesper-skeleton-hidden",
    );
  });

  test("returns only children when show is undefined", () => {
    const { container } = render(
      <Skeleton>
        <span data-testid="child">Content</span>
      </Skeleton>,
    );
    expect(container.querySelector(".vesper-skeleton")).toBeNull();
    expect(container.querySelector("[data-testid='child']")).not.toBeNull();
  });

  test("returns only children when show is initially false", () => {
    const { container } = render(
      <Skeleton show={false}>
        <span data-testid="child">Content</span>
      </Skeleton>,
    );
    expect(container.querySelector(".vesper-skeleton")).toBeNull();
    expect(container.querySelector("[data-testid='child']")).not.toBeNull();
  });

  test("applies hidden class when show moves from true to false", () => {
    const { container, rerender } = render(
      <Skeleton show>
        <span>Content</span>
      </Skeleton>,
    );

    rerender(
      <Skeleton show={false}>
        <span>Content</span>
      </Skeleton>,
    );

    expect(container.firstElementChild).toHaveClass("vesper-skeleton-hidden");
  });

  test("returns only children after fade animation ends", () => {
    const { container, rerender } = render(
      <Skeleton show>
        <span data-testid="child">Content</span>
      </Skeleton>,
    );

    rerender(
      <Skeleton show={false}>
        <span data-testid="child">Content</span>
      </Skeleton>,
    );

    const skeletonEl = container.firstElementChild as HTMLElement;
    fireEvent.animationEnd(skeletonEl, {
      animationName: "vesper-skeleton-fade",
    });

    expect(container.querySelector(".vesper-skeleton-overlay")).toBeNull();
    expect(container.querySelector("[data-testid='child']")).not.toBeNull();
  });

  test("does not remove overlay after other animations", () => {
    const { container, rerender } = render(
      <Skeleton show>
        <span>Content</span>
      </Skeleton>,
    );

    rerender(
      <Skeleton show={false}>
        <span>Content</span>
      </Skeleton>,
    );

    const skeletonEl = container.firstElementChild as HTMLElement;
    fireEvent.animationEnd(skeletonEl, {
      animationName: "some-other-animation",
    });

    expect(container.querySelector(".vesper-skeleton-overlay")).not.toBeNull();
  });
});

describe("skeleton [snapshot]", () => {
  SKELETON_SHAPES.forEach((shape) => {
    test(`shape: ${shape}`, () => {
      const { container } = render(<Skeleton shape={shape} show />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  test("with size", () => {
    const { container } = render(<Skeleton size={100} show />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("with width and height", () => {
    const { container } = render(<Skeleton width={200} height={50} show />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("with children", () => {
    const { container } = render(
      <Skeleton show>
        <span>Loading content</span>
      </Skeleton>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

const SKELETON_A11Y_PERMUTATIONS: {
  shape: SkeletonShape;
  show: boolean;
}[] = SKELETON_SHAPES.flatMap((shape) => [
  { shape, show: true },
  { shape, show: false },
]);

describe("skeleton [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    SKELETON_A11Y_PERMUTATIONS.forEach(({ shape, show }) => {
      test(`a11y (${shape}, show=${show}, ${theme})`, async () => {
        const { container } = render(<Skeleton shape={shape} show={show} />);

        expect(await axe.run(container)).toHaveNoViolations();
      });
    });
  });
});
