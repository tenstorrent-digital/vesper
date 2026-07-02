import { render, cleanup, waitFor, fireEvent } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test, vi } from "vitest";
import axe from "axe-core";

import { Tooltip } from "@/components/tooltip/tooltip";
import { Typography } from "@/components/typography/typography";

import "@/styles/test.css";

afterEach(cleanup);

describe("tooltip [unit]", () => {
  test("no interaction", () => {
    const result = render(
      <Tooltip content="Tooltip text">
        <Typography style={{ color: "var(--vesper-stone-900)" }}>
          tooltip trigger
        </Typography>
      </Tooltip>,
    );

    const tooltip = result.container.querySelector(".vesper-tooltip");
    expect(tooltip).toBeNull();
  });

  test("with interaction", async () => {
    const handleOpenChange = vi.fn();

    const result = render(
      <Tooltip
        delayDuration={0}
        onOpenChange={handleOpenChange}
        content="Tooltip text"
      >
        <Typography style={{ color: "var(--vesper-stone-900)" }}>
          tooltip trigger
        </Typography>
      </Tooltip>,
    );

    const trigger = result.container.firstChild as HTMLElement;
    fireEvent.pointerMove(trigger);

    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });

    const tooltip = result.container.querySelector(".vesper-tooltip");
    expect(tooltip).not.toBeNull();
  });

  test("side prop", async () => {
    const result = render(
      <Tooltip open side="left" content="Tooltip text">
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
      <Tooltip open align="end" content="Tooltip text">
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
      <Tooltip open maxWidth={360} content="Tooltip text">
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
      <Tooltip
        delayDuration={0}
        onOpenChange={handleOpenChange}
        content="Tooltip text"
      >
        <Typography style={{ color: "var(--vesper-stone-900)" }}>
          tooltip trigger
        </Typography>
      </Tooltip>,
    );

    const trigger = result.container.firstChild as HTMLElement;
    fireEvent.pointerMove(trigger);

    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });
  });

  test("empty tooltip content", () => {
    const result = render(
      <Tooltip open content="">
        <Typography>trigger</Typography>
      </Tooltip>,
    );

    expect(result.container.querySelector(".vesper-tooltip")).toBeNull();
    expect(result.container.textContent).toBe("trigger");
  });

  test("nullable children", () => {
    const result = render(<Tooltip open content="Tooltip text" />);

    expect(result.container.innerHTML).toBe("");
  });

  test("non-element children", () => {
    const result = render(
      <Tooltip open content="Tooltip text">
        plain text trigger
      </Tooltip>,
    );

    const span = result.container.querySelector("span");
    expect(span).not.toBeNull();
    expect(span?.textContent).toBe("plain text trigger");
  });

  test("defaultOpen prop", () => {
    const result = render(
      <Tooltip defaultOpen content="Tooltip text">
        <Typography>trigger</Typography>
      </Tooltip>,
    );

    const tooltip = result.container.querySelector(".vesper-tooltip");
    expect(tooltip).not.toBeNull();
  });

  test("renders non-string content", () => {
    const result = render(
      <Tooltip
        open
        content={
          <span>
            Press <kbd>Enter</kbd> to confirm
          </span>
        }
      >
        <Typography>trigger</Typography>
      </Tooltip>,
    );

    const tooltip = result.container.querySelector(".vesper-tooltip");
    expect(tooltip).not.toBeNull();

    const kbd = tooltip?.querySelector("kbd");
    expect(kbd).not.toBeNull();
    expect(kbd?.textContent).toBe("Enter");
  });

  test("dismisses on escape", async () => {
    const handleOpenChange = vi.fn();

    const result = render(
      <Tooltip
        delayDuration={0}
        onOpenChange={handleOpenChange}
        content="Tooltip text"
      >
        <Typography>trigger</Typography>
      </Tooltip>,
    );

    const trigger = result.container.firstChild as HTMLElement;
    fireEvent.pointerMove(trigger);

    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });
});

describe("tooltip [snapshot]", () => {
  test("open", async () => {
    const result = render(
      <Tooltip open content="Tooltip text">
        <Typography style={{ color: "var(--vesper-stone-900)" }}>
          tooltip trigger
        </Typography>
      </Tooltip>,
    );

    expect(result.container.querySelector(".vesper-tooltip")).toMatchSnapshot();
  });

  test("closed", async () => {
    const result = render(
      <Tooltip open={false} content="Tooltip text">
        <Typography style={{ color: "var(--vesper-stone-900)" }}>
          tooltip trigger
        </Typography>
      </Tooltip>,
    );

    expect(result.container).toMatchSnapshot();
  });
});

describe("tooltip [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    const testFn = async () => {
      const result = render(
        <Tooltip open content="Tooltip text">
          <Typography style={{ color: "var(--vesper-stone-900)" }}>
            tooltip trigger
          </Typography>
        </Tooltip>,
      );

      expect(
        await axe.run(result.container, {
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
      test.todo(`a11y (${theme})`, testFn);
    } else {
      test(`a11y (${theme})`, testFn);
    }
  });
});
