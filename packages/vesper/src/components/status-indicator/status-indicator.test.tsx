import { render, within, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import {
  StatusIndicator,
  type StatusIndicatorProps,
  STATUS_INDICATOR_STATES,
  STATUS_INDICATOR_VARIANTS,
} from "@/components/status-indicator/status-indicator";

import "@/styles/test.css";

const STATUS_INDICATOR_PERMUTATIONS = STATUS_INDICATOR_VARIANTS.flatMap(
  (variant) =>
    STATUS_INDICATOR_STATES.flatMap(
      (state): (StatusIndicatorProps & { name: string })[] => [
        {
          name: `${state}, ${variant}`,
          label: state,
          state,
          variant,
          animated: false,
        },
        {
          name: `${state}, ${variant}, animated`,
          label: state,
          state,
          variant,
          animated: true,
        },
      ],
    ),
);

afterEach(cleanup);

describe("status-indicator [unit]", () => {
  test("renders a div by default", () => {
    const { container } = render(
      <StatusIndicator label="Ready" state="ready" />,
    );
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  STATUS_INDICATOR_STATES.forEach((state) => {
    test(`${state} state class on dot`, () => {
      const { container } = render(
        <StatusIndicator label={state} state={state} />,
      );

      const dot = container.querySelector(".vesper-status-indicator-dot");
      expect(dot).toHaveClass(`vesper-status-indicator-dot-${state}`);
    });
  });

  STATUS_INDICATOR_VARIANTS.forEach((variant) => {
    test(`${variant} variant class`, () => {
      const { container } = render(
        <StatusIndicator label="Test" state="ready" variant={variant} />,
      );

      expect(container.firstChild).toHaveClass(
        `vesper-status-indicator-${variant}`,
      );
    });
  });

  test("default variant applied when not specified", () => {
    const { container } = render(
      <StatusIndicator label="Test" state="ready" />,
    );

    expect(container.firstChild).toHaveClass("vesper-status-indicator-default");
  });

  test("animated class on dot when animated is true", () => {
    const { container } = render(
      <StatusIndicator label="Progress" state="progress" animated />,
    );

    const dot = container.querySelector(".vesper-status-indicator-dot");
    expect(dot).toHaveClass("vesper-status-indicator-dot-animated");
  });

  test("no animated class on dot when animated is false", () => {
    const { container } = render(
      <StatusIndicator label="Progress" state="progress" animated={false} />,
    );

    const dot = container.querySelector(".vesper-status-indicator-dot");
    expect(dot).not.toHaveClass("vesper-status-indicator-dot-animated");
  });

  test("no animated class on dot by default", () => {
    const { container } = render(
      <StatusIndicator label="Progress" state="progress" />,
    );

    const dot = container.querySelector(".vesper-status-indicator-dot");
    expect(dot).not.toHaveClass("vesper-status-indicator-dot-animated");
  });

  test("renders label text", () => {
    const { container } = render(
      <StatusIndicator label="My Status" state="ready" />,
    );

    const view = within(container);
    expect(view.getByText("My Status")).toBeDefined();
  });

  test("label has correct class", () => {
    const { container } = render(
      <StatusIndicator label="Ready" state="ready" />,
    );

    const label = container.querySelector(".vesper-status-indicator-label");
    expect(label).not.toBeNull();
    expect(label?.textContent).toBe("Ready");
  });

  test("polymorphism", () => {
    const { container } = render(
      <StatusIndicator as="a" href="/status" label="Link" state="ready" />,
    );

    const view = within(container);
    const link = view.getByRole("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/status");
  });

  test("additional prop passthrough", () => {
    const { container } = render(
      <StatusIndicator label="Test" state="ready" aria-label="custom label" />,
    );

    expect(container.firstChild).toHaveAttribute("aria-label", "custom label");
  });

  test("custom className", () => {
    const { container } = render(
      <StatusIndicator
        label="Test"
        state="ready"
        variant="badge"
        className="custom-class"
      />,
    );

    const el = container.firstChild;
    expect(el).toHaveClass("vesper-status-indicator");
    expect(el).toHaveClass("vesper-status-indicator-badge");
    expect(el).toHaveClass("custom-class");
  });
});

describe("status-indicator [snapshot]", () => {
  STATUS_INDICATOR_PERMUTATIONS.forEach((permutation) => {
    const { name, ...props } = permutation;

    test(name, () => {
      const { container } = render(<StatusIndicator {...props} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

describe("status-indicator [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    STATUS_INDICATOR_PERMUTATIONS.forEach((permutation) => {
      const { name, ...props } = permutation;

      test(`wcag2aaa (${name}, ${theme})`, async () => {
        const { container } = render(<StatusIndicator {...props} />);

        expect(
          await axe.run(container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });
    });
  });
});
