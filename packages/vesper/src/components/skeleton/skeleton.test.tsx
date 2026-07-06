import { render, cleanup } from "@testing-library/react";
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

  describe("dimensions", () => {
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

    test("string size prop", () => {
      const { container } = render(<Skeleton show size="50%" />);
      const el = container.firstElementChild as HTMLElement;
      expect(el.style.width).toBe("50%");
      expect(el.style.height).toBe("50%");
    });

    test("string width prop", () => {
      const { container } = render(<Skeleton show width="100%" />);
      const el = container.firstElementChild as HTMLElement;
      expect(el.style.width).toBe("100%");
    });

    test("string height prop", () => {
      const { container } = render(<Skeleton show height="2rem" />);
      const el = container.firstElementChild as HTMLElement;
      expect(el.style.height).toBe("2rem");
    });

    test("no inline width or height when no dimension props provided", () => {
      const { container } = render(<Skeleton show />);
      const el = container.firstElementChild as HTMLElement;
      expect(el.style.width).toBe("");
      expect(el.style.height).toBe("");
    });
  });

  test("style prop is merged with size styles", () => {
    const { container } = render(
      <Skeleton show size={80} style={{ backgroundColor: "red" }} />,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.width).toBe("80px");
    expect(el.style.backgroundColor).toBe("red");
  });

  test("style prop works without dimension props", () => {
    const { container } = render(
      <Skeleton show style={{ opacity: "0.5", margin: "8px" }} />,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.opacity).toBe("0.5");
    expect(el.style.margin).toBe("8px");
  });

  test("renders children", () => {
    const { container } = render(
      <Skeleton show>
        <span data-testid="child">Content</span>
      </Skeleton>,
    );
    expect(container.querySelector("[data-testid='child']")).not.toBeNull();
  });

  describe("overlay", () => {
    test("renders overlay element", () => {
      const { container } = render(<Skeleton show />);
      expect(
        container.querySelector(".vesper-skeleton-overlay"),
      ).not.toBeNull();
    });

    test("overlay has mask-image style", () => {
      const { container } = render(<Skeleton show />);
      const overlay = container.querySelector(
        ".vesper-skeleton-overlay",
      ) as HTMLElement;
      expect(overlay.style.maskImage).toContain("url");
    });

    test("overlay contains SVG with aria-hidden", () => {
      const { container } = render(<Skeleton show />);
      const svg = container.querySelector(".vesper-skeleton-overlay svg");
      expect(svg).not.toBeNull();
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });

    test("overlay appears after children in DOM", () => {
      const { container } = render(
        <Skeleton show>
          <span data-testid="child">Content</span>
        </Skeleton>,
      );
      const wrapper = container.firstElementChild as HTMLElement;
      const lastChild = wrapper.lastElementChild;
      expect(lastChild).toHaveClass("vesper-skeleton-overlay");
    });
  });

  describe("shape", () => {
    test("defaults to box shape", () => {
      const { container } = render(<Skeleton show />);
      const rect = container.querySelector("rect");
      expect(rect).toHaveAttribute("rx", "var(--vesper-radius-1)");
    });

    test("box shape", () => {
      const { container } = render(<Skeleton show shape="box" />);
      const rect = container.querySelector("rect");
      expect(rect).toHaveAttribute("rx", "var(--vesper-radius-1)");
      expect(rect).not.toHaveAttribute("ry");
    });

    test("circle shape", () => {
      const { container } = render(<Skeleton show shape="circle" />);
      const rect = container.querySelector("rect");
      expect(rect).toHaveAttribute("rx", "50%");
      expect(rect).not.toHaveAttribute("ry");
    });

    test("pill shape", () => {
      const { container } = render(<Skeleton show shape="pill" />);
      const rect = container.querySelector("rect");
      expect(rect).toHaveAttribute("ry", "50%");
      expect(rect).not.toHaveAttribute("rx");
    });
  });

  describe("show/hide behavior", () => {
    test("renders skeleton wrapper when show is true", () => {
      const { container } = render(<Skeleton show />);
      expect(container.firstElementChild).toHaveClass("vesper-skeleton");
      expect(
        container.querySelector(".vesper-skeleton-overlay"),
      ).not.toBeNull();
    });

    test("renders skeleton wrapper when show is undefined", () => {
      const { container } = render(
        <Skeleton>
          <span data-testid="child">Content</span>
        </Skeleton>,
      );
      expect(container.querySelector(".vesper-skeleton")).not.toBeNull();
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

    test("returns nothing when show is initially false and no children", () => {
      const { container } = render(<Skeleton show={false} />);
      expect(container.innerHTML).toBe("");
    });

    test("returns skeleton when show is undefined and no children", () => {
      const { container } = render(<Skeleton />);
      expect(container.querySelector(".vesper-skeleton")).not.toBeNull();
    });

    test("re-shows skeleton after it was hidden", () => {
      const { container, rerender } = render(
        <Skeleton show>
          <span data-testid="child">Content</span>
        </Skeleton>,
      );

      // Hide
      rerender(
        <Skeleton show={false}>
          <span data-testid="child">Content</span>
        </Skeleton>,
      );

      // Verify it's gone
      expect(container.querySelector(".vesper-skeleton")).toBeNull();

      // Re-show
      rerender(
        <Skeleton show>
          <span data-testid="child">Content</span>
        </Skeleton>,
      );

      expect(container.querySelector(".vesper-skeleton")).not.toBeNull();
      expect(
        container.querySelector(".vesper-skeleton-overlay"),
      ).not.toBeNull();
    });
  });
});

describe("skeleton [snapshot]", () => {
  SKELETON_SHAPES.forEach((shape) => {
    test(`shape: ${shape}`, () => {
      const { container } = render(<Skeleton shape={shape} show />);
      expect(container.firstChild).toMatchSnapshot();
    });

    test(`shape: ${shape} with size`, () => {
      const { container } = render(<Skeleton shape={shape} size={100} show />);
      expect(container.firstChild).toMatchSnapshot();
    });

    test(`shape: ${shape} with width and height`, () => {
      const { container } = render(
        <Skeleton shape={shape} width={200} height={50} show />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    test(`shape: ${shape} with children`, () => {
      const { container } = render(
        <Skeleton shape={shape} show>
          <span>Loading content</span>
        </Skeleton>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
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
