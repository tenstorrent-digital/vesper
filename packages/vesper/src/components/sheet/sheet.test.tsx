import { render, cleanup, fireEvent } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Sheet, type SheetProps, useSheet } from "@/components/sheet/sheet";

import "@/styles/test.css";

const TITLE = "Sheet title";
const DESCRIPTION = "This is a description of the sheet content.";

const BUTTONS: SheetProps["buttons"] = [
  { children: "Cancel" },
  { children: "Save" },
];

afterEach(cleanup);

function SheetWithHook(props: Omit<SheetProps, "ref">) {
  const sheet = useSheet();
  return (
    <>
      <button data-testid="open-trigger" onClick={sheet.open}>
        Open
      </button>
      <button data-testid="close-trigger" onClick={sheet.close}>
        Close
      </button>
      <Sheet ref={sheet.ref} {...props} />
    </>
  );
}

describe("sheet [unit]", () => {
  test("renders a dialog element", () => {
    const { container } = render(
      <Sheet title={TITLE} description={DESCRIPTION} />,
    );
    expect(container.firstElementChild?.tagName).toBe("DIALOG");
  });

  test("renders with popover attribute", () => {
    const { container } = render(
      <Sheet title={TITLE} description={DESCRIPTION} />,
    );
    const dialog = container.firstElementChild as HTMLDialogElement;
    expect(dialog).toHaveAttribute("popover");
  });

  test("renders title", () => {
    const { container } = render(
      <Sheet title={TITLE} description={DESCRIPTION} />,
    );
    const title = container.querySelector(".vesper-sheet-title");
    expect(title).not.toBeNull();
    expect(title?.textContent).toBe(TITLE);
  });

  test("renders description", () => {
    const { container } = render(
      <Sheet title={TITLE} description={DESCRIPTION} />,
    );
    const desc = container.querySelector(".vesper-sheet-description");
    expect(desc).not.toBeNull();
    expect(desc?.textContent).toBe(DESCRIPTION);
  });

  test("renders children content", () => {
    const { container } = render(
      <Sheet title={TITLE} description={DESCRIPTION}>
        <p>Sheet body content</p>
      </Sheet>,
    );
    const children = container.querySelector(".vesper-sheet-children");
    expect(children).not.toBeNull();
    expect(children?.textContent).toBe("Sheet body content");
  });

  test("renders close button with aria-label", () => {
    const { container } = render(
      <Sheet title={TITLE} description={DESCRIPTION} />,
    );
    const closeBtn = container.querySelector(
      '[aria-label="Close sheet"]',
    ) as HTMLButtonElement;
    expect(closeBtn).not.toBeNull();
    expect(closeBtn).toHaveAttribute("type", "button");
  });

  test("custom className is merged", () => {
    const { container } = render(
      <Sheet
        title={TITLE}
        description={DESCRIPTION}
        className="custom-class"
      />,
    );
    const dialog = container.firstElementChild;
    expect(dialog).toHaveClass("vesper-sheet");
    expect(dialog).toHaveClass("custom-class");
  });

  test("additional props are passed through", () => {
    const { container } = render(
      <Sheet
        title={TITLE}
        description={DESCRIPTION}
        data-testid="my-sheet"
        id="sheet-1"
      />,
    );
    const dialog = container.firstElementChild;
    expect(dialog).toHaveAttribute("data-testid", "my-sheet");
    expect(dialog).toHaveAttribute("id", "sheet-1");
  });

  describe("side", () => {
    test("defaults to right side", () => {
      const { container } = render(
        <Sheet title={TITLE} description={DESCRIPTION} />,
      );
      const dialog = container.firstElementChild;
      expect(dialog).toHaveClass("vesper-sheet-right");
    });

    test("applies left side class", () => {
      const { container } = render(
        <Sheet title={TITLE} description={DESCRIPTION} side="left" />,
      );
      const dialog = container.firstElementChild;
      expect(dialog).toHaveClass("vesper-sheet-left");
    });

    test("applies right side class", () => {
      const { container } = render(
        <Sheet title={TITLE} description={DESCRIPTION} side="right" />,
      );
      const dialog = container.firstElementChild;
      expect(dialog).toHaveClass("vesper-sheet-right");
    });
  });

  describe("aria attributes", () => {
    test("aria-labelledby references the title", () => {
      const { container } = render(
        <Sheet title={TITLE} description={DESCRIPTION} />,
      );
      const dialog = container.firstElementChild as HTMLDialogElement;
      const titleEl = container.querySelector(".vesper-sheet-title");
      const labelledBy = dialog.getAttribute("aria-labelledby");
      expect(labelledBy).toContain(titleEl?.id);
    });

    test("aria-describedby references the description", () => {
      const { container } = render(
        <Sheet title={TITLE} description={DESCRIPTION} />,
      );
      const dialog = container.firstElementChild as HTMLDialogElement;
      const descEl = container.querySelector(".vesper-sheet-description");
      const describedBy = dialog.getAttribute("aria-describedby");
      expect(describedBy).toContain(descEl?.id);
    });

    test("custom aria-labelledby is merged with title id", () => {
      const { container } = render(
        <Sheet
          title={TITLE}
          description={DESCRIPTION}
          aria-labelledby="custom-label"
        />,
      );
      const dialog = container.firstElementChild as HTMLDialogElement;
      const titleEl = container.querySelector(".vesper-sheet-title");
      const labelledBy = dialog.getAttribute("aria-labelledby");
      expect(labelledBy).toContain("custom-label");
      expect(labelledBy).toContain(titleEl?.id);
    });

    test("custom aria-describedby is merged with description id", () => {
      const { container } = render(
        <Sheet
          title={TITLE}
          description={DESCRIPTION}
          aria-describedby="custom-desc"
        />,
      );
      const dialog = container.firstElementChild as HTMLDialogElement;
      const descEl = container.querySelector(".vesper-sheet-description");
      const describedBy = dialog.getAttribute("aria-describedby");
      expect(describedBy).toContain("custom-desc");
      expect(describedBy).toContain(descEl?.id);
    });
  });

  describe("buttons", () => {
    test("renders buttons when provided", () => {
      const { container } = render(
        <Sheet title={TITLE} description={DESCRIPTION} buttons={BUTTONS} />,
      );
      const buttonsContainer = container.querySelector(".vesper-sheet-buttons");
      expect(buttonsContainer).not.toBeNull();
      const buttons = buttonsContainer?.querySelectorAll("button");
      expect(buttons).toHaveLength(2);
    });

    test("does not render buttons section when buttons is empty", () => {
      const { container } = render(
        <Sheet title={TITLE} description={DESCRIPTION} buttons={[]} />,
      );
      const buttonsContainer = container.querySelector(".vesper-sheet-buttons");
      expect(buttonsContainer).toBeNull();
    });

    test("does not render buttons section when buttons is undefined", () => {
      const { container } = render(
        <Sheet title={TITLE} description={DESCRIPTION} />,
      );
      const buttonsContainer = container.querySelector(".vesper-sheet-buttons");
      expect(buttonsContainer).toBeNull();
    });

    test("last button defaults to contrast variant", () => {
      const { container } = render(
        <Sheet title={TITLE} description={DESCRIPTION} buttons={BUTTONS} />,
      );
      const buttons = container.querySelectorAll(
        ".vesper-sheet-buttons button",
      );
      expect(buttons[1]).toHaveClass("vesper-button-contrast");
    });

    test("non-last buttons default to tertiary variant", () => {
      const { container } = render(
        <Sheet title={TITLE} description={DESCRIPTION} buttons={BUTTONS} />,
      );
      const buttons = container.querySelectorAll(
        ".vesper-sheet-buttons button",
      );
      expect(buttons[0]).toHaveClass("vesper-button-tertiary");
    });

    test("explicit variant overrides default", () => {
      const { container } = render(
        <Sheet
          title={TITLE}
          description={DESCRIPTION}
          buttons={[
            { children: "Delete", variant: "danger" },
            { children: "Cancel", variant: "ghost" },
          ]}
        />,
      );
      const buttons = container.querySelectorAll(
        ".vesper-sheet-buttons button",
      );
      expect(buttons[0]).toHaveClass("vesper-button-danger");
      expect(buttons[1]).toHaveClass("vesper-button-ghost");
    });

    test("single button defaults to contrast variant", () => {
      const { container } = render(
        <Sheet
          title={TITLE}
          description={DESCRIPTION}
          buttons={[{ children: "OK" }]}
        />,
      );
      const buttons = container.querySelectorAll(
        ".vesper-sheet-buttons button",
      );
      expect(buttons[0]).toHaveClass("vesper-button-contrast");
    });

    test("buttons render at lg size", () => {
      const { container } = render(
        <Sheet
          title={TITLE}
          description={DESCRIPTION}
          buttons={[{ children: "OK" }]}
        />,
      );
      const buttons = container.querySelectorAll(
        ".vesper-sheet-buttons button",
      );
      expect(buttons[0]).toHaveClass("vesper-button-lg");
    });
  });

  describe("open and close", () => {
    test("opens/closes via useSheet hook", () => {
      const result = render(
        <SheetWithHook title={TITLE} description={DESCRIPTION} />,
      );
      const dialog = result.container.querySelector(
        "dialog",
      ) as HTMLDialogElement;

      expect(dialog.matches(":popover-open")).toBe(false);

      fireEvent.click(result.getByTestId("open-trigger"));
      expect(dialog.matches(":popover-open")).toBe(true);

      fireEvent.click(result.getByTestId("close-trigger"));
      expect(dialog.matches(":popover-open")).toBe(false);
    });

    test("closes via close button", () => {
      const result = render(
        <SheetWithHook title={TITLE} description={DESCRIPTION} />,
      );
      const dialog = result.container.querySelector(
        "dialog",
      ) as HTMLDialogElement;

      fireEvent.click(result.getByTestId("open-trigger"));
      expect(dialog.matches(":popover-open")).toBe(true);

      const closeBtn = result.container.querySelector(
        '[aria-label="Close sheet"]',
      ) as HTMLButtonElement;
      fireEvent.click(closeBtn);
      expect(dialog.matches(":popover-open")).toBe(false);
    });
  });
});

type SheetSnapshotPermutation = SheetProps & { permutationName: string };

const SHEET_SNAPSHOT_PERMUTATIONS: SheetSnapshotPermutation[] = [
  {
    permutationName: "default (right side)",
    title: TITLE,
    description: DESCRIPTION,
  },
  {
    permutationName: "left side",
    title: TITLE,
    description: DESCRIPTION,
    side: "left",
  },
  {
    permutationName: "with children",
    title: TITLE,
    description: DESCRIPTION,
    children: "Sheet body content",
  },
  {
    permutationName: "with buttons",
    title: TITLE,
    description: DESCRIPTION,
    buttons: BUTTONS,
  },
  {
    permutationName: "left side with buttons and children",
    title: TITLE,
    description: DESCRIPTION,
    side: "left",
    buttons: BUTTONS,
    children: "Sheet body content",
  },
];

describe("sheet [snapshot]", () => {
  SHEET_SNAPSHOT_PERMUTATIONS.forEach(({ permutationName, ...props }) => {
    test(permutationName, () => {
      const { container } = render(<Sheet {...props} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

type SheetA11yPermutation = {
  label: string;
  props: Omit<SheetProps, "ref">;
  children?: React.ReactNode;
};

const SHEET_A11Y_PERMUTATIONS: SheetA11yPermutation[] = [
  {
    label: "default",
    props: { title: TITLE, description: DESCRIPTION },
  },
  {
    label: "with buttons",
    props: { title: TITLE, description: DESCRIPTION, buttons: BUTTONS },
  },
  {
    label: "with children",
    props: { title: TITLE, description: DESCRIPTION },
    children: <p>Sheet body content for accessibility test.</p>,
  },
  {
    label: "left side",
    props: { title: TITLE, description: DESCRIPTION, side: "left" as const },
  },
];

describe("sheet [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    SHEET_A11Y_PERMUTATIONS.forEach(({ label, props, children }) => {
      const testLabel = `a11y - ${label} (${theme})`;

      const testFn = async () => {
        const result = render(
          <SheetWithHook {...props}>{children}</SheetWithHook>,
        );
        fireEvent.click(result.getByTestId("open-trigger"));
        const dialog = result.container.querySelector(
          "dialog",
        ) as HTMLDialogElement;
        expect(dialog.matches(":popover-open")).toBe(true);
        expect(await axe.run(result.container)).toHaveNoViolations();
      };

      test.todo(testLabel, testFn);
    });
  });
});
