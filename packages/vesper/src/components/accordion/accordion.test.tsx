import { render, within, cleanup, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import axe from "axe-core";

import { Accordion } from "@/components/accordion/accordion";

import "@/styles/test.css";

const TITLE = "This is a title";
const CHILDREN =
  "If you do too much it's going to lose its effectiveness. Look around. Look at what we have. Beauty is everywhere you only have to look to see it.";

afterEach(cleanup);

describe("accordion [unit]", () => {
  it("opens when the trigger is clicked in a closed state", async () => {
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

  it("closes when the trigger is clicked in an opened state", async () => {
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

  it("merges custom className with component classes", () => {
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
  it("renders correctly when closed", () => {
    // instead of rendering text content for snapshot tests, we render a div with a fixed height, because subpixel rendering differences between local machines and CI machines affects the output of radix's computed css values such as --radix-collapsible-content-height
    const result = render(
      <Accordion title={TITLE} open={false}>
        <div style={{ height: 200 }} />
      </Accordion>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  it("renders correctly when open", () => {
    // instead of rendering text content for snapshot tests, we render a div with a fixed height, because subpixel rendering differences between local machines and CI machines affects the output of radix's computed css values such as --radix-collapsible-content-height
    const result = render(
      <Accordion title={TITLE} open>
        <div style={{ height: 200 }} />
      </Accordion>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });
});

describe("accordion [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    describe(`${theme} mode`, () => {
      beforeEach(() => {
        document.documentElement.setAttribute("data-vesper-theme", theme);
      });

      afterEach(() => {
        document.documentElement.removeAttribute("data-vesper-theme");
      });

      it("renders without wcag2aaa violations when open", async () => {
        const result = render(
          <Accordion title={TITLE} open>
            {CHILDREN}
          </Accordion>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      it("renders without wcag2aaa violations when closed", async () => {
        const result = render(
          <Accordion title={TITLE} open={false}>
            {CHILDREN}
          </Accordion>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });
    });
  });
});
