import { render, cleanup, waitFor } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test, vi } from "vitest";
import axe from "axe-core";

import { Tooltip } from "@/components/tooltip/tooltip";
import { Typography } from "@/components/typography/typography";

import "@/styles/test.css";
import { userEvent } from "vitest/browser";

afterEach(cleanup);

describe("tooltip [unit]", () => {
  test("no interaction", () => {
    const result = render(
      <Tooltip text="Tooltip text">
        <Typography style={{ color: "var(--vesper-stone-900)" }}>
          tooltip trigger
        </Typography>
      </Tooltip>,
    );

    const tooltip = result.container.querySelector(".vesper-tooltip");
    expect(tooltip).toBeNull();
  });

  test("with interaction", async () => {
    const result = render(
      <Tooltip delayDuration={0} text="Tooltip text">
        <Typography style={{ color: "var(--vesper-stone-900)" }}>
          tooltip trigger
        </Typography>
      </Tooltip>,
    );

    await userEvent.hover(result.container.firstChild as HTMLElement);

    const tooltip = result.container.querySelector(".vesper-tooltip");
    expect(tooltip).not.toBeNull();
  });

  test("side prop", async () => {
    const result = render(
      <Tooltip open side="left" text="Tooltip text">
        <Typography style={{ color: "var(--vesper-stone-900)" }}>
          tooltip trigger
        </Typography>
      </Tooltip>,
    );

    const tooltip = result.container.querySelector(".vesper-tooltip");
    expect(tooltip).toHaveAttribute("data-side", "left");
  });

  test("alignment prop", async () => {
    const result = render(
      <Tooltip open align="end" text="Tooltip text">
        <Typography style={{ color: "var(--vesper-stone-900)" }}>
          tooltip trigger
        </Typography>
      </Tooltip>,
    );

    const tooltip = result.container.querySelector(".vesper-tooltip");
    expect(tooltip).toHaveAttribute("data-align", "end");
  });

  test("custom max width", async () => {
    const result = render(
      <Tooltip open maxWidth={360} text="Tooltip text">
        <Typography style={{ color: "var(--vesper-stone-900)" }}>
          tooltip trigger
        </Typography>
      </Tooltip>,
    );

    const tooltip = result.container.querySelector(".vesper-tooltip");
    expect(tooltip).toHaveStyle("max-width: 360px;");
  });

  test("onOpenChange callback", async () => {
    const handleOpenChange = vi.fn();

    const result = render(
      <Tooltip onOpenChange={handleOpenChange} text="Tooltip text">
        <Typography style={{ color: "var(--vesper-stone-900)" }}>
          tooltip trigger
        </Typography>
      </Tooltip>,
    );

    await userEvent.hover(result.container.firstChild as HTMLElement);
    await waitFor(() => expect(handleOpenChange).toHaveBeenCalled());
  });

  test("empty tooltip text", () => {
    const result = render(
      <Tooltip text="">
        <Typography>trigger</Typography>
      </Tooltip>,
    );

    expect(result.container.querySelector(".vesper-tooltip")).toBeNull();
    expect(result.container.textContent).toBe("trigger");
  });

  test("nullable children", () => {
    const result = render(<Tooltip text="Tooltip text" />);

    expect(result.container.innerHTML).toBe("");
  });

  test("non-element children", () => {
    const result = render(
      <Tooltip open text="Tooltip text">
        plain text trigger
      </Tooltip>,
    );

    const span = result.container.querySelector("span");
    expect(span).not.toBeNull();
    expect(span?.textContent).toBe("plain text trigger");
  });

  test("defaultOpen prop", () => {
    const result = render(
      <Tooltip defaultOpen text="Tooltip text">
        <Typography>trigger</Typography>
      </Tooltip>,
    );

    const tooltip = result.container.querySelector(".vesper-tooltip");
    expect(tooltip).not.toBeNull();
  });

  test("unhover", async () => {
    const result = render(
      <Tooltip delayDuration={0} text="Tooltip text">
        <Typography>trigger</Typography>
      </Tooltip>,
    );

    const trigger = result.container.firstChild as HTMLElement;
    await userEvent.hover(trigger);
    await waitFor(() =>
      expect(result.container.querySelector(".vesper-tooltip")).not.toBeNull(),
    );

    await userEvent.unhover(trigger);
    await waitFor(() =>
      expect(result.container.querySelector(".vesper-tooltip")).toBeNull(),
    );
  });
});

describe("tooltip [snapshot]", () => {
  test("open", async () => {
    const result = render(
      <Tooltip open text="Tooltip text">
        <Typography style={{ color: "var(--vesper-stone-900)" }}>
          tooltip trigger
        </Typography>
      </Tooltip>,
    );

    expect(result.container).toMatchSnapshot();
  });

  test("closed", async () => {
    const result = render(
      <Tooltip open={false} text="Tooltip text">
        <Typography style={{ color: "var(--vesper-stone-900)" }}>
          tooltip trigger
        </Typography>
      </Tooltip>,
    );

    expect(result.container).toMatchSnapshot();
  });
});

describe("tooltip [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    test(`wcag2aaa (${theme})`, async () => {
      const result = render(
        <Tooltip open text="Tooltip text">
          <Typography style={{ color: "var(--vesper-stone-900)" }}>
            tooltip trigger
          </Typography>
        </Tooltip>,
      );

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
