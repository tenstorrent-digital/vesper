import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Code, CODE_VARIANTS } from "@/components/code/code";

import "@/styles/test.css";

afterEach(cleanup);

describe("code [unit]", () => {
  test("renders a code element", () => {
    const { container } = render(<Code>snippet</Code>);
    expect(container.firstElementChild?.tagName).toBe("CODE");
  });

  test("applies vesper-code class", () => {
    const { container } = render(<Code>snippet</Code>);
    expect(container.firstElementChild).toHaveClass("vesper-code");
  });

  test("default variant class when no variant prop", () => {
    const { container } = render(<Code>snippet</Code>);
    expect(container.firstElementChild).toHaveClass("vesper-code-default");
  });

  CODE_VARIANTS.forEach((variant) => {
    test(`${variant} variant class`, () => {
      const { container } = render(<Code variant={variant}>snippet</Code>);
      expect(container.firstElementChild).toHaveClass(
        `vesper-code-${variant}`,
      );
    });
  });

  test("custom className is merged", () => {
    const { container } = render(
      <Code className="custom-class">snippet</Code>,
    );
    expect(container.firstElementChild).toHaveClass("vesper-code");
    expect(container.firstElementChild).toHaveClass("custom-class");
  });

  test("renders children", () => {
    const { container } = render(<Code>const x = 1;</Code>);
    expect(container.firstElementChild?.textContent).toBe("const x = 1;");
  });

  test("additional prop passthrough", () => {
    const { container } = render(
      <Code data-testid="code-el" aria-label="code snippet">
        snippet
      </Code>,
    );
    expect(container.firstElementChild).toHaveAttribute(
      "aria-label",
      "code snippet",
    );
    expect(container.firstElementChild).toHaveAttribute(
      "data-testid",
      "code-el",
    );
  });
});

describe("code [snapshot]", () => {
  CODE_VARIANTS.forEach((variant) => {
    test(`variant: ${variant}`, () => {
      const { container } = render(
        <Code variant={variant}>const x = 1;</Code>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  test("with custom className", () => {
    const { container } = render(
      <Code className="custom-class">snippet</Code>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("code [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    CODE_VARIANTS.forEach((variant) => {
      test(`a11y (${variant}, ${theme})`, async () => {
        const { container } = render(
          <Code variant={variant}>const x = 1;</Code>,
        );

        expect(await axe.run(container)).toHaveNoViolations();
      });
    });
  });
});
