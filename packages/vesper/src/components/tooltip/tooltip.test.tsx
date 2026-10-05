import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react";
import axe from "axe-core";
import { createRef, type ReactNode } from "react";
import {
  afterEach,
  assert,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import { userEvent } from "vitest/browser";

import { TextButton } from "@/components/text-button/text-button";
import { Tooltip } from "@/components/tooltip/tooltip";
import { Typography } from "@/components/typography/typography";
import "@/styles/test.css";

/**
 * children that are not a single react element, which can't be rendered as
 * the trigger itself, so are always wrapped in a button trigger (even when
 * `wrapWithButton` is not set)
 */
const NON_ELEMENT_CHILDREN: {
  name: string;
  children: ReactNode;
  textContent: string;
}[] = [
  { name: "nullable", children: undefined, textContent: "" },
  {
    name: "plain text",
    children: "plain text trigger",
    textContent: "plain text trigger",
  },
  {
    name: "fragment",
    children: (
      <>
        <Typography>trigger</Typography>
      </>
    ),
    textContent: "trigger",
  },
  {
    name: "multiple element",
    children: [
      <Typography key="first">first</Typography>,
      <Typography key="second">second</Typography>,
    ],
    textContent: "firstsecond",
  },
];

const A11Y_PERMUTATIONS: {
  name: string;
  wrapWithButton?: boolean;
  children: ReactNode;
}[] = [
  {
    name: "default trigger",
    children: <TextButton variant="contrast">tooltip trigger</TextButton>,
  },
  {
    name: "wrapWithButton",
    wrapWithButton: true,
    children: (
      <Typography style={{ color: "var(--vesper-stone-900)" }}>
        tooltip trigger
      </Typography>
    ),
  },
];

afterEach(cleanup);

describe("tooltip [unit]", () => {
  test("no interaction", () => {
    render(
      <Tooltip content="Tooltip text">
        <TextButton>tooltip trigger</TextButton>
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
        <TextButton>tooltip trigger</TextButton>
      </Tooltip>,
    );

    const trigger = result.container.firstChild;
    assert.instanceOf(trigger, HTMLElement);
    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });

    expect(document.querySelector(".vesper-tooltip")).not.toBeNull();
  });

  test("side prop", async () => {
    render(
      <Tooltip open side="left" content="Tooltip text">
        <TextButton>tooltip trigger</TextButton>
      </Tooltip>,
    );

    const tooltip = document.querySelector(".vesper-tooltip");
    expect(tooltip).toHaveAttribute("data-side", "left");
  });

  test("alignment prop", async () => {
    render(
      <Tooltip open align="end" content="Tooltip text">
        <TextButton>tooltip trigger</TextButton>
      </Tooltip>,
    );

    const tooltip = document.querySelector(".vesper-tooltip");
    expect(tooltip).toHaveAttribute("data-align", "end");
  });

  test("custom max width", async () => {
    render(
      <Tooltip open maxWidth={360} content="Tooltip text">
        <TextButton>tooltip trigger</TextButton>
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
        <TextButton>tooltip trigger</TextButton>
      </Tooltip>,
    );

    const trigger = result.container.firstChild;
    assert.instanceOf(trigger, HTMLElement);
    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });
  });

  test("renders the popup with tooltip semantics", () => {
    render(
      <Tooltip open content="Tooltip text">
        <TextButton>trigger</TextButton>
      </Tooltip>,
    );

    const tooltip = document.querySelector(".vesper-tooltip")!;
    expect(tooltip).toHaveAttribute("role", "tooltip");
    expect(tooltip.id).not.toBe("");
  });

  test("associates the trigger with the popup while open", () => {
    const result = render(
      <Tooltip open content="Tooltip text">
        <TextButton>trigger</TextButton>
      </Tooltip>,
    );

    const trigger = result.container.firstChild;
    assert.instanceOf(trigger, HTMLElement);
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
        <TextButton>trigger</TextButton>
      </Tooltip>,
    );

    const trigger = result.container.firstChild;
    assert.instanceOf(trigger, HTMLElement);
    expect(trigger).not.toHaveAttribute("aria-describedby");

    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });

    const tooltip = document.querySelector(".vesper-tooltip")!;
    expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
  });

  test("defaultOpen prop", () => {
    render(
      <Tooltip defaultOpen content="Tooltip text">
        <TextButton>trigger</TextButton>
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
        <TextButton>trigger</TextButton>
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
        <TextButton>trigger</TextButton>
      </Tooltip>,
    );

    const trigger = result.container.firstChild;
    assert.instanceOf(trigger, HTMLElement);
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
        <TextButton>trigger</TextButton>
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
              <TextButton>trigger</TextButton>
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
        <TextButton>trigger</TextButton>
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
          <TextButton>trigger</TextButton>
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

  describe("content rendered as the trigger itself (default)", () => {
    test("renders the child as the trigger", () => {
      const result = render(
        <Tooltip content="Tooltip text">
          <TextButton>trigger</TextButton>
        </Tooltip>,
      );

      const trigger = within(result.container).getByRole("button");

      expect(result.container.firstChild).toBe(trigger);
      expect(trigger).toHaveClass("vesper-text-button");
      expect(trigger).toHaveAttribute("data-base-ui-tooltip-trigger");
    });

    test("renders the child as the trigger when wrapWithButton is false", () => {
      const result = render(
        <Tooltip wrapWithButton={false} content="Tooltip text">
          <TextButton>trigger</TextButton>
        </Tooltip>,
      );

      const trigger = within(result.container).getByRole("button");

      expect(result.container.firstChild).toBe(trigger);
      expect(trigger).toHaveClass("vesper-text-button");
      expect(trigger).toHaveAttribute("data-base-ui-tooltip-trigger");
    });

    test("opens the tooltip when hovering the child", async () => {
      const handleOpenChange = vi.fn();

      const result = render(
        <Tooltip
          delayDuration={0}
          onOpenChange={handleOpenChange}
          content="Tooltip text"
        >
          <TextButton>trigger</TextButton>
        </Tooltip>,
      );

      const trigger = within(result.container).getByRole("button");
      expect(trigger).not.toHaveAttribute("aria-describedby");

      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        expect(handleOpenChange).toHaveBeenCalledWith(true);
      });

      const tooltip = document.querySelector(".vesper-tooltip");
      assert.instanceOf(tooltip, HTMLElement);
      expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
    });

    test("merges props with the child's props", async () => {
      const onClick = vi.fn();
      const onChildClick = vi.fn();

      const result = render(
        <Tooltip
          content="Tooltip text"
          className="tooltip-class"
          aria-label="More info"
          onClick={onClick}
        >
          <TextButton className="child-class" onClick={onChildClick}>
            trigger
          </TextButton>
        </Tooltip>,
      );

      const trigger = within(result.container).getByRole("button");
      expect(trigger).toHaveClass(
        "vesper-text-button",
        "tooltip-class",
        "child-class",
      );
      expect(trigger).toHaveAttribute("aria-label", "More info");

      await userEvent.click(trigger);
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onChildClick).toHaveBeenCalledTimes(1);
    });

    test("forwards ref to the child", () => {
      const ref = createRef<HTMLButtonElement>();
      const childRef = createRef<HTMLButtonElement>();

      const result = render(
        <Tooltip content="Tooltip text" ref={ref}>
          <TextButton ref={childRef}>trigger</TextButton>
        </Tooltip>,
      );

      const trigger = within(result.container).getByRole("button");
      expect(ref.current).toBe(trigger);
      expect(childRef.current).toBe(trigger);
    });

    NON_ELEMENT_CHILDREN.forEach(({ name, children, textContent }) => {
      test(`falls back to rendering ${name} children inside a button trigger`, () => {
        const result = render(
          <Tooltip open content="Tooltip text">
            {children}
          </Tooltip>,
        );

        const trigger = result.container.firstChild;
        assert.instanceOf(trigger, HTMLButtonElement);
        expect(trigger).toHaveAttribute("type", "button");
        expect(trigger.textContent).toBe(textContent);

        const tooltip = document.querySelector(".vesper-tooltip");
        assert.instanceOf(tooltip, HTMLElement);
        expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
      });
    });
  });

  describe("content rendered inside a button trigger via wrapWithButton", () => {
    test("renders a button trigger wrapping its children", () => {
      const result = render(
        <Tooltip wrapWithButton content="Tooltip text">
          <Typography data-testid="child">trigger</Typography>
        </Tooltip>,
      );

      const trigger = result.container.firstChild;
      const child = result.getByTestId("child");

      assert.instanceOf(trigger, HTMLButtonElement);
      expect(trigger).toHaveAttribute("type", "button");
      expect(trigger).toHaveAttribute("data-base-ui-tooltip-trigger");
      expect(trigger).toContainElement(child);
      expect(child).not.toHaveAttribute("data-base-ui-tooltip-trigger");
    });

    test("opens the tooltip when hovering the button trigger", async () => {
      const handleOpenChange = vi.fn();

      const result = render(
        <Tooltip
          wrapWithButton
          delayDuration={0}
          onOpenChange={handleOpenChange}
          content="Tooltip text"
        >
          <Typography>trigger</Typography>
        </Tooltip>,
      );

      const trigger = result.container.firstChild;
      assert.instanceOf(trigger, HTMLButtonElement);
      expect(trigger).not.toHaveAttribute("aria-describedby");

      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        expect(handleOpenChange).toHaveBeenCalledWith(true);
      });

      const tooltip = document.querySelector(".vesper-tooltip");
      assert.instanceOf(tooltip, HTMLElement);
      expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
    });

    test("forwards props to the button trigger", async () => {
      const onClick = vi.fn();

      const result = render(
        <Tooltip
          wrapWithButton
          content="Tooltip text"
          className="custom-class"
          aria-label="More info"
          data-testid="trigger"
          onClick={onClick}
        >
          <Typography data-testid="child">?</Typography>
        </Tooltip>,
      );

      const trigger = result.getByTestId("trigger");
      const child = result.getByTestId("child");

      assert.instanceOf(trigger, HTMLButtonElement);
      expect(trigger).toHaveClass("custom-class");
      expect(trigger).toHaveAttribute("aria-label", "More info");
      expect(child).not.toHaveClass("custom-class");
      expect(child).not.toHaveAttribute("aria-label");

      await userEvent.click(trigger);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    test("forwards ref to the button trigger", () => {
      const ref = createRef<HTMLButtonElement>();

      const result = render(
        <Tooltip wrapWithButton content="Tooltip text" ref={ref}>
          <Typography>trigger</Typography>
        </Tooltip>,
      );

      assert.instanceOf(ref.current, HTMLButtonElement);
      expect(ref.current).toBe(result.container.firstChild);
    });

    test("portals into the closest dialog ancestor", async () => {
      const result = render(
        <dialog open data-testid="dialog">
          <Tooltip wrapWithButton open content="Tooltip text">
            <Typography>trigger</Typography>
          </Tooltip>
        </dialog>,
      );

      const dialog = result.getByTestId("dialog");

      await waitFor(() => {
        expect(dialog.querySelector(".vesper-tooltip")).not.toBeNull();
      });
    });

    NON_ELEMENT_CHILDREN.forEach(({ name, children, textContent }) => {
      test(`renders ${name} children inside the button trigger`, () => {
        const result = render(
          <Tooltip wrapWithButton open content="Tooltip text">
            {children}
          </Tooltip>,
        );

        const trigger = result.container.firstChild;
        assert.instanceOf(trigger, HTMLButtonElement);
        expect(trigger).toHaveAttribute("type", "button");
        expect(trigger.textContent).toBe(textContent);

        const tooltip = document.querySelector(".vesper-tooltip");
        assert.instanceOf(tooltip, HTMLElement);
        expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
      });
    });
  });
});

describe("tooltip [snapshot]", () => {
  test("open", async () => {
    render(
      <Tooltip open content="Tooltip text">
        <TextButton>tooltip trigger</TextButton>
      </Tooltip>,
    );

    expect(document.querySelector(".vesper-tooltip")).toMatchSnapshot();
  });

  test("closed", async () => {
    const result = render(
      <Tooltip open={false} content="Tooltip text">
        <TextButton>tooltip trigger</TextButton>
      </Tooltip>,
    );

    expect(result.container).toMatchSnapshot();
  });

  test("closed (wrapWithButton)", async () => {
    const result = render(
      <Tooltip wrapWithButton open={false} content="Tooltip text">
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

    A11Y_PERMUTATIONS.forEach(({ name, wrapWithButton, children }) => {
      test(`a11y (${name})`, async () => {
        const result = render(
          <Tooltip wrapWithButton={wrapWithButton} open content="Tooltip text">
            {children}
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
});
