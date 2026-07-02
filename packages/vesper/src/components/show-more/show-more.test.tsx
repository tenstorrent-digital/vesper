import { render, within, cleanup, fireEvent } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test, vi } from "vitest";
import axe from "axe-core";

import { ShowMore } from "@/components/show-more/show-more";

import "@/styles/test.css";

afterEach(cleanup);

describe("show-more [unit]", () => {
  test("renders a div", () => {
    const { container } = render(<ShowMore />);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  test("renders 'Show more' when expanded is false", () => {
    const result = render(<ShowMore expanded={false} />);
    const view = within(result.container);

    expect(view.getByRole("button")).toHaveTextContent("Show more");
  });

  test("renders 'Show less' when expanded is true", () => {
    const result = render(<ShowMore expanded />);
    const view = within(result.container);

    expect(view.getByRole("button")).toHaveTextContent("Show less");
  });

  test("defaults to 'Show more' when expanded is not provided", () => {
    const result = render(<ShowMore />);
    const view = within(result.container);

    expect(view.getByRole("button")).toHaveTextContent("Show more");
  });

  test("calls onClick when button is clicked", () => {
    const handleClick = vi.fn();
    const result = render(<ShowMore onClick={handleClick} />);
    const view = within(result.container);

    fireEvent.click(view.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("renders button as disabled when disabled is true", () => {
    const result = render(<ShowMore disabled />);
    const view = within(result.container);

    expect(view.getByRole("button")).toBeDisabled();
  });

  test("button is not disabled by default", () => {
    const result = render(<ShowMore />);
    const view = within(result.container);

    expect(view.getByRole("button")).not.toBeDisabled();
  });

  test("does not call onClick when disabled", () => {
    const handleClick = vi.fn();
    const result = render(<ShowMore disabled onClick={handleClick} />);
    const view = within(result.container);

    fireEvent.click(view.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  test("custom className", () => {
    const result = render(<ShowMore className="custom-class" />);

    const el = result.container.firstChild;
    expect(el).toHaveClass("vesper-show-more");
    expect(el).toHaveClass("custom-class");
  });

  test("additional prop passthrough", () => {
    const result = render(<ShowMore aria-label="toggle details" />);

    expect(result.container.firstChild).toHaveAttribute(
      "aria-label",
      "toggle details",
    );
  });
});

describe("show-more [snapshot]", () => {
  test("closed state", () => {
    const { container } = render(<ShowMore expanded={false} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("open state", () => {
    const { container } = render(<ShowMore expanded />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("disabled", () => {
    const { container } = render(<ShowMore disabled />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("show-more [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    const closedTestFn = async () => {
      const { container } = render(<ShowMore />);

      expect(
        await axe.run(container, {
          runOnly: [
            "wcag2a",
            "wcag2aa",
            "wcag21a",
            "wcag21aa",
            "wcag22aa",
            "best-practice",
            "wcag2aaa",
          ],
        }),
      ).toHaveNoViolations();
    };

    const openTestFn = async () => {
      const { container } = render(<ShowMore expanded />);

      expect(
        await axe.run(container, {
          runOnly: [
            "wcag2a",
            "wcag2aa",
            "wcag21a",
            "wcag21aa",
            "wcag22aa",
            "best-practice",
            "wcag2aaa",
          ],
        }),
      ).toHaveNoViolations();
    };

    if (theme === "dark") {
      test.todo(`a11y (closed, ${theme})`, closedTestFn);
      test.todo(`a11y (open, ${theme})`, openTestFn);
    } else {
      test(`a11y (closed, ${theme})`, closedTestFn);
      test(`a11y (open, ${theme})`, openTestFn);
    }

    test(`a11y (disabled, ${theme})`, async () => {
      const { container } = render(<ShowMore disabled />);

      expect(
        await axe.run(container, {
          runOnly: [
            "wcag2a",
            "wcag2aa",
            "wcag21a",
            "wcag21aa",
            "wcag22aa",
            "best-practice",
            "wcag2aaa",
          ],
        }),
      ).toHaveNoViolations();
    });
  });
});
