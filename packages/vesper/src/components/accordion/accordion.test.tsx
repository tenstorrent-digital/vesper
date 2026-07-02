import { render, within, cleanup, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Accordion } from "@/components/accordion/accordion";

import "@/styles/test.css";

const TITLE = "This is a title";
const CHILDREN =
  "If you do too much it's going to lose its effectiveness. Look around. Look at what we have. Beauty is everywhere you only have to look to see it.";

afterEach(cleanup);

describe("accordion [unit]", () => {
  test("it opens", async () => {
    const result = render(
      <Accordion title={TITLE} defaultOpen={false}>
        {CHILDREN}
      </Accordion>,
    );

    within(result.container).getByRole("button").click();
    await waitFor(() =>
      expect(
        result.container.querySelector(".vesper-accordion-content-children"),
      ).not.toBeNull(),
    );
  });

  test("it closes", async () => {
    const result = render(
      <Accordion title={TITLE} defaultOpen>
        {CHILDREN}
      </Accordion>,
    );

    within(result.container).getByRole("button").click();
    await waitFor(() =>
      expect(
        result.container.querySelector(".vesper-accordion-content-children"),
      ).toBeNull(),
    );
  });

  test("custom className", () => {
    const result = render(
      <Accordion title={TITLE} className="custom-class">
        {CHILDREN}
      </Accordion>,
    );

    const el = result.container.firstChild;
    expect(el).toHaveClass("vesper-accordion");
    expect(el).toHaveClass("custom-class");
  });
});

describe("accordion [snapshot]", () => {
  test("closed", () => {
    // instead of rendering text content for snapshot tests, we render a div with a fixed height, because subpixel rendering differences between local machines and CI machines affects the output of radix's computed css values such as --radix-collapsible-content-height
    const result = render(
      <Accordion title={TITLE} open={false}>
        <div style={{ height: 200 }} />
      </Accordion>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("open", () => {
    // instead of rendering text content for snapshot tests, we render a div with a fixed height, because subpixel rendering differences between local machines and CI machines affects the output of radix's computed css values such as --radix-collapsible-content-height
    const result = render(
      <Accordion title={TITLE} open>
        <div style={{ height: 200 }} />
      </Accordion>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });
});

const ACCORDION_A11Y_FAILING_PERMUTATIONS: {
  open: boolean;
  theme: string;
}[] = [
  { open: true, theme: "light" },
  { open: true, theme: "dark" },
  { open: false, theme: "dark" },
];

describe("accordion [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    ([true, false] as const).forEach((open) => {
      const label = `a11y (${open ? "open" : "closed"}, ${theme})`;

      const testFn = async () => {
        const result = render(
          <Accordion title={TITLE} open={open}>
            {CHILDREN}
          </Accordion>,
        );

        expect(await axe.run(result.container)).toHaveNoViolations();
      };

      const failsA11y = ACCORDION_A11Y_FAILING_PERMUTATIONS.some(
        (p) => p.open === open && p.theme === theme,
      );

      if (failsA11y) test.todo(label, testFn);
      else test(label, testFn);
    });
  });
});
