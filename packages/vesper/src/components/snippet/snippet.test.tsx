import { cleanup,render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { Snippet, SNIPPET_VARIANTS } from "@/components/snippet/snippet";

import "@/styles/test.css";

afterEach(cleanup);

describe("snippet [unit]", () => {
  test("renders a div", () => {
    const { container } = render(<Snippet />);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  test("applies vesper-snippet class", () => {
    const { container } = render(<Snippet />);
    expect(container.firstElementChild).toHaveClass("vesper-snippet");
  });

  test("default variant class when no variant prop", () => {
    const { container } = render(<Snippet />);
    expect(container.firstElementChild).toHaveClass("vesper-snippet-default");
  });

  SNIPPET_VARIANTS.forEach((variant) => {
    test(`${variant} variant class`, () => {
      const { container } = render(<Snippet variant={variant}>code</Snippet>);
      expect(container.firstElementChild).toHaveClass(
        `vesper-snippet-${variant}`,
      );
    });
  });

  test("custom className is merged", () => {
    const { container } = render(
      <Snippet className="custom-class">code</Snippet>,
    );
    expect(container.firstElementChild).toHaveClass("vesper-snippet");
    expect(container.firstElementChild).toHaveClass("custom-class");
  });

  test("contains a pre element", () => {
    const { container } = render(<Snippet>code</Snippet>);
    expect(container.querySelector("pre")).not.toBeNull();
  });

  test("contains a code element inside pre", () => {
    const { container } = render(<Snippet>code</Snippet>);
    expect(container.querySelector("pre > code")).not.toBeNull();
  });

  test("renders single-line children as one line span", () => {
    const { container } = render(<Snippet>yarn install</Snippet>);
    const lines = container.querySelectorAll(".line");
    expect(lines).toHaveLength(1);
    expect(lines[0]?.textContent).toBe("yarn install");
  });

  test("renders multi-line children as multiple line spans", () => {
    const { container } = render(
      <Snippet>{"yarn install\nyarn build\nyarn test"}</Snippet>,
    );
    const lines = container.querySelectorAll(".line");
    expect(lines).toHaveLength(3);
    expect(lines[0]?.textContent).toBe("yarn install");
    expect(lines[1]?.textContent).toBe("yarn build");
    expect(lines[2]?.textContent).toBe("yarn test");
  });

  test("renders empty string when no children provided", () => {
    const { container } = render(<Snippet />);
    const lines = container.querySelectorAll(".line");
    expect(lines).toHaveLength(1);
    expect(lines[0]?.textContent).toBe("");
  });

  test("renders a copy button", () => {
    const { container } = render(<Snippet>code</Snippet>);
    const button = container.querySelector("button");
    expect(button).not.toBeNull();
    expect(button).toHaveAttribute("aria-label", "Copy code");
  });

  test("copy button uses ghost variant for default snippet", () => {
    const { container } = render(
      <Snippet variant="default">code</Snippet>,
    );
    const button = container.querySelector("button");
    expect(button).toHaveClass("vesper-button-ghost");
  });

  test("copy button uses contrast variant for contrast snippet", () => {
    const { container } = render(
      <Snippet variant="contrast">code</Snippet>,
    );
    const button = container.querySelector("button");
    expect(button).toHaveClass("vesper-button-contrast");
  });

  test("copy button writes children to clipboard", async () => {
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);

    const { container } = render(<Snippet>yarn install</Snippet>);
    const button = container.querySelector("button")!;
    await userEvent.click(button);

    expect(writeText).toHaveBeenCalledWith("yarn install");
    writeText.mockRestore();
  });

  test("additional prop passthrough", () => {
    const { container } = render(
      <Snippet data-testid="snippet-el" aria-label="code snippet">
        code
      </Snippet>,
    );
    expect(container.firstElementChild).toHaveAttribute(
      "aria-label",
      "code snippet",
    );
    expect(container.firstElementChild).toHaveAttribute(
      "data-testid",
      "snippet-el",
    );
  });
});

describe("snippet [snapshot]", () => {
  SNIPPET_VARIANTS.forEach((variant) => {
    test(`variant: ${variant}`, () => {
      const { container } = render(
        <Snippet variant={variant}>yarn install</Snippet>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  test("multi-line content", () => {
    const { container } = render(
      <Snippet>{"yarn install\nyarn build"}</Snippet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("empty content", () => {
    const { container } = render(<Snippet />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("snippet [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    SNIPPET_VARIANTS.forEach((variant) => {
      test(`a11y (${variant}, ${theme})`, async () => {
        const { container } = render(
          <Snippet variant={variant}>yarn install</Snippet>,
        );

        expect(await axe.run(container)).toHaveNoViolations();
      });
    });
  });
});
