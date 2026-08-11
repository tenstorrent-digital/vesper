import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { Tooltip } from "@/components/tooltip/tooltip";
import { Typography } from "@/components/typography/typography";

import "@/styles/test.css";

afterEach(cleanup);

describe("tooltip [unit]", () => {
  test("no interaction", () => {
    render(
      <Tooltip content="Tooltip text">
        <Typography style={{ color: "var(--vesper-stone-900)" }}>
          tooltip trigger
        </Typography>
      </Tooltip>,
    );

    expect(document.querySelector(".vesper-tooltip")).toBeNull();
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
    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });

    expect(document.querySelector(".vesper-tooltip")).not.toBeNull();
  });

  test("side prop", async () => {
    render(
      <Tooltip open side="left" content="Tooltip text">
        <Typography style={{ color: "var(--vesper-stone-900)" }}>
          tooltip trigger
        </Typography>
      </Tooltip>,
    );

    const tooltip = document.querySelector(".vesper-tooltip");
    expect(tooltip).toHaveAttribute("data-side", "left");
  });

  test("alignment prop", async () => {
    render(
      <Tooltip open align="end" content="Tooltip text">
        <Typography style={{ color: "var(--vesper-stone-900)" }}>
          tooltip trigger
        </Typography>
      </Tooltip>,
    );

    const tooltip = document.querySelector(".vesper-tooltip");
    expect(tooltip).toHaveAttribute("data-align", "end");
  });

  test("custom max width", async () => {
    render(
      <Tooltip open maxWidth={360} content="Tooltip text">
        <Typography style={{ color: "var(--vesper-stone-900)" }}>
          tooltip trigger
        </Typography>
      </Tooltip>,
    );

    const tooltip = document.querySelector(".vesper-tooltip");
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
    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });
  });

  test("renders the popup with tooltip semantics", () => {
    render(
      <Tooltip open content="Tooltip text">
        <Typography>trigger</Typography>
      </Tooltip>,
    );

    const tooltip = document.querySelector(".vesper-tooltip")!;
    expect(tooltip).toHaveAttribute("role", "tooltip");
    expect(tooltip.id).not.toBe("");
  });

  test("associates the trigger with the popup while open", () => {
    const result = render(
      <Tooltip open content="Tooltip text">
        <Typography>trigger</Typography>
      </Tooltip>,
    );

    const trigger = result.container.firstChild as HTMLElement;
    const tooltip = document.querySelector(".vesper-tooltip")!;

    expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
  });

  test("does not describe the trigger while closed", async () => {
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
    expect(trigger).not.toHaveAttribute("aria-describedby");

    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });

    const tooltip = document.querySelector(".vesper-tooltip")!;
    expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
  });

  test("nullable children", () => {
    render(<Tooltip open content="Tooltip text" />);

    expect(document.querySelector(".vesper-tooltip")).toBeNull();
  });

  test("non-element children do not render tooltip", () => {
    const result = render(
      <Tooltip open content="Tooltip text">
        plain text trigger
      </Tooltip>,
    );

    expect(document.querySelector(".vesper-tooltip")).toBeNull();
    expect(result.container.innerHTML).toBe("plain text trigger");
  });

  test("fragment children do not render tooltip", () => {
    const result = render(
      <Tooltip open content="Tooltip text">
        <>
          <Typography>trigger</Typography>
        </>
      </Tooltip>,
    );

    expect(document.querySelector(".vesper-tooltip")).toBeNull();
    expect(result.container.textContent).toBe("trigger");
  });

  test("multiple children do not render tooltip", () => {
    const result = render(
      <Tooltip open content="Tooltip text">
        <Typography>first</Typography>
        <Typography>second</Typography>
      </Tooltip>,
    );

    expect(document.querySelector(".vesper-tooltip")).toBeNull();
    expect(result.container.textContent).toBe("firstsecond");
  });

  test("defaultOpen prop", () => {
    render(
      <Tooltip defaultOpen content="Tooltip text">
        <Typography>trigger</Typography>
      </Tooltip>,
    );

    expect(document.querySelector(".vesper-tooltip")).not.toBeNull();
  });

  test("renders non-string content", () => {
    render(
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

    const tooltip = document.querySelector(".vesper-tooltip");
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
    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });

  test("portals tooltip content into document.body", async () => {
    render(
      <Tooltip open content="Tooltip text">
        <Typography>trigger</Typography>
      </Tooltip>,
    );

    await waitFor(() => {
      expect(document.querySelector(".vesper-tooltip")).not.toBeNull();
    });

    const tooltip = document.querySelector(".vesper-tooltip")!;
    expect(tooltip.closest("dialog")).toBeNull();
    expect(document.body.contains(tooltip)).toBe(true);
  });

  test("portals into the closest dialog ancestor", async () => {
    const result = render(
      <dialog open data-testid="dialog">
        <div>
          <div>
            <Tooltip open content="Tooltip text">
              <Typography>trigger</Typography>
            </Tooltip>
          </div>
        </div>
      </dialog>,
    );

    const dialog = result.getByTestId("dialog");

    await waitFor(() => {
      expect(dialog.querySelector(".vesper-tooltip")).not.toBeNull();
    });

    const tooltip = document.querySelector(".vesper-tooltip")!;
    expect(dialog.contains(tooltip)).toBe(true);
  });

  test("portals into the container prop", async () => {
    const container = document.createElement("div");
    container.setAttribute("data-testid", "container");
    document.body.append(container);

    render(
      <Tooltip open container={container} content="Tooltip text">
        <Typography>trigger</Typography>
      </Tooltip>,
    );

    await waitFor(() => {
      expect(container.querySelector(".vesper-tooltip")).not.toBeNull();
    });

    container.remove();
  });

  test("container prop takes precedence over the closest dialog ancestor", async () => {
    const container = document.createElement("div");
    document.body.append(container);

    const result = render(
      <dialog open data-testid="dialog">
        <Tooltip open container={container} content="Tooltip text">
          <Typography>trigger</Typography>
        </Tooltip>
      </dialog>,
    );

    await waitFor(() => {
      expect(container.querySelector(".vesper-tooltip")).not.toBeNull();
    });

    const dialog = result.getByTestId("dialog");
    expect(dialog.querySelector(".vesper-tooltip")).toBeNull();

    container.remove();
  });
});

describe("tooltip [snapshot]", () => {
  test("open", async () => {
    render(
      <Tooltip open content="Tooltip text">
        <Typography style={{ color: "var(--vesper-stone-900)" }}>
          tooltip trigger
        </Typography>
      </Tooltip>,
    );

    expect(document.querySelector(".vesper-tooltip")).toMatchSnapshot();
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
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    test(`a11y (${theme})`, async () => {
      const result = render(
        <Tooltip open content="Tooltip text">
          <Typography style={{ color: "var(--vesper-stone-900)" }}>
            tooltip trigger
          </Typography>
        </Tooltip>,
      );

      await waitFor(() => {
        expect(document.querySelector(".vesper-tooltip")).not.toBeNull();
      });

      // the tooltip content is portaled outside of the render container, so
      // a11y is checked at the document level
      //
      // the page-level `region` rule is disabled here: it flags content that
      // isn't contained by a landmark, which is an artifact of rendering a
      // component in isolation rather than a tooltip accessibility issue
      expect(
        await axe.run(result.container.ownerDocument, {
          rules: { region: { enabled: false } },
        }),
      ).toHaveNoViolations();
    });
  });
});
