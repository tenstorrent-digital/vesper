import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import axe from "axe-core";
import { createRef, useState } from "react";
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

import { Button } from "@/components/button/button";
import { Select } from "@/components/select/select";
import { Sheet, type SheetProps } from "@/components/sheet/sheet";
import {
  emulateHighContrast,
  runAxeWcag2aaa,
} from "@/test-utils/high-contrast";
import "@/styles/test.css";

const TITLE = "Sheet title";
const DESCRIPTION = "This is a description of the sheet content.";

afterEach(cleanup);

/**
 * renders a sheet with a fixed `open` prop and an `onOpenChange` spy, and returns its `<dialog>` element and close button,
 * along with `setProps` to re-render the sheet with the initial props merged with new ones
 */
function renderSheet(initialProps: Partial<SheetProps> = {}) {
  const onOpenChange = vi.fn();
  const renderWith = (props: Partial<SheetProps>) => (
    <Sheet
      title={TITLE}
      description={DESCRIPTION}
      open={false}
      onOpenChange={onOpenChange}
      {...initialProps}
      {...props}
    />
  );

  const result = render(renderWith({}));
  const dialog = result.container.querySelector("dialog");
  assert.instanceOf(dialog, HTMLDialogElement);

  return {
    ...result,
    dialog,
    closeButton: result.getByLabelText("Close sheet"),
    onOpenChange,
    setProps: (props: Partial<SheetProps>) =>
      result.rerender(renderWith(props)),
  };
}

/**
 * a sheet that keeps its open state in React state, the way consumers are expected to use it
 */
function StatefulSheet(props: Omit<SheetProps, "open" | "onOpenChange">) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Open
      </button>
      <Sheet {...props} open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}

describe("sheet [unit]", () => {
  test("labels and describes the dialog with its title and description", () => {
    const { dialog, getByText } = renderSheet({
      "aria-labelledby": "custom-label",
      "aria-describedby": "custom-description",
    });
    expect(dialog).toHaveAttribute(
      "aria-labelledby",
      `custom-label ${getByText(TITLE).id}`,
    );
    expect(dialog).toHaveAttribute(
      "aria-describedby",
      `custom-description ${getByText(DESCRIPTION).id}`,
    );
  });

  test("forwards ref and additional props to the dialog element", () => {
    const ref = createRef<HTMLDialogElement>();
    const { dialog } = renderSheet({ ref, className: "custom", id: "sheet" });
    expect(ref.current).toBe(dialog);
    expect(dialog).toHaveClass("vesper-sheet", "custom");
    expect(dialog).toHaveAttribute("id", "sheet");
  });

  test("opens and closes with the open prop, without calling onOpenChange", async () => {
    const { dialog, onOpenChange, setProps } = renderSheet();
    expect(dialog.open).toBe(false);

    setProps({ open: true });
    expect(dialog.open).toBe(true);

    // the `close` event fires after the dialog closes, so wait for it before checking that `onOpenChange` wasn't called
    const closed = new Promise((resolve) => {
      dialog.addEventListener("close", resolve, { once: true });
    });
    setProps({ open: false });
    expect(dialog.open).toBe(false);
    await closed;
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test("calls onOpenChange instead of closing when the user dismisses it", async () => {
    const { dialog, closeButton, onOpenChange } = renderSheet({ open: true });

    fireEvent.click(closeButton);
    fireEvent.click(dialog);
    await userEvent.keyboard("{Escape}");
    expect(onOpenChange.mock.calls).toEqual([[false], [false], [false]]);
    expect(dialog.open).toBe(true);
  });

  test("closes when the user dismisses it, if onOpenChange updates the open prop", async () => {
    const { container, getByLabelText, getByText } = render(
      <StatefulSheet title={TITLE} description={DESCRIPTION} />,
    );
    const dialog = container.querySelector("dialog");
    assert.instanceOf(dialog, HTMLDialogElement);

    fireEvent.click(getByText("Open"));
    expect(dialog.open).toBe(true);
    fireEvent.click(getByLabelText("Close sheet"));
    expect(dialog.open).toBe(false);

    fireEvent.click(getByText("Open"));
    expect(dialog.open).toBe(true);
    await userEvent.keyboard("{Escape}");
    expect(dialog.open).toBe(false);
  });

  test("calls onOpenChange on backdrop click, but not on clicks inside the sheet", () => {
    const { dialog, getByText, onOpenChange } = renderSheet({ open: true });

    fireEvent.click(getByText(TITLE));
    expect(onOpenChange).not.toHaveBeenCalled();

    fireEvent.click(dialog);
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });

  test("calls onOpenChange when the browser closes the dialog without asking first", async () => {
    const { dialog, getByText, onOpenChange } = renderSheet({
      open: true,
      children: (
        <form method="dialog">
          <button type="submit">Submit</button>
        </form>
      ),
    });

    // submitting a `<form method="dialog">` closes the dialog without firing `cancel`
    fireEvent.click(getByText("Submit"));
    expect(dialog.open).toBe(false);
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    });
  });

  test("calls onOpenChange on the cancel event", () => {
    const { dialog, onOpenChange } = renderSheet({ open: true });

    // browsers fire `cancel` on the dialog for close requests other than `Escape` (eg. the Android back gesture),
    // and close the dialog unless the event is prevented
    const cancel = new Event("cancel", { cancelable: true });
    fireEvent(dialog, cancel);
    expect(cancel.defaultPrevented).toBe(true);
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });

  test("fires the cancel event on Escape", async () => {
    const onCancel = vi.fn();
    const { onOpenChange } = renderSheet({ open: true, onCancel });

    await userEvent.keyboard("{Escape}");
    expect(onCancel).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });

  test("doesn't call onOpenChange when onCancel prevents the cancel event", async () => {
    const { dialog, getByText, onOpenChange } = renderSheet({
      open: true,
      onCancel: (e) => e.preventDefault(),
    });

    // after a user interaction, browsers only honour `preventDefault()` on the first `cancel` event that `Escape` triggers,
    // so click inside the sheet, then press `Escape` several times and check that the sheet is still open
    await userEvent.click(getByText(TITLE));
    await userEvent.keyboard("{Escape}");
    await userEvent.keyboard("{Escape}");
    await userEvent.keyboard("{Escape}");

    // close requests other than `Escape` (eg. the Android back gesture) fire `cancel` on the dialog too
    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    expect(dialog.open).toBe(true);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test("lets popups inside the sheet handle Escape first", async () => {
    const { getByRole, onOpenChange } = renderSheet({
      open: true,
      children: <Select aria-label="Fruit" options={["Apple", "Banana"]} />,
    });

    const trigger = getByRole("combobox");
    await userEvent.click(trigger);
    await waitFor(() => {
      expect(trigger).toHaveAttribute("data-popup-open");
    });

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(trigger).not.toHaveAttribute("data-popup-open");
    });
    expect(onOpenChange).not.toHaveBeenCalled();

    await userEvent.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });

  describe("popover mode", () => {
    test("opens and closes as a popover with the open prop, without calling onOpenChange", async () => {
      const { dialog, onOpenChange, setProps } = renderSheet({ popover: true });

      // popovers fire a `toggle` event after they open or close, so wait for each one before checking that `onOpenChange` wasn't called
      const nextToggle = () =>
        new Promise((resolve) => {
          dialog.addEventListener("toggle", resolve, { once: true });
        });

      const shown = nextToggle();
      setProps({ open: true });
      expect(dialog.matches(":popover-open")).toBe(true);
      expect(dialog.open).toBe(false);
      await shown;

      const hidden = nextToggle();
      setProps({ open: false });
      expect(dialog.matches(":popover-open")).toBe(false);
      await hidden;
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    test("calls onOpenChange on Escape", async () => {
      const { dialog, onOpenChange } = renderSheet({
        open: true,
        popover: true,
      });

      await userEvent.keyboard("{Escape}");
      expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
      expect(dialog.matches(":popover-open")).toBe(true);
    });

    test("fires the cancel event on Escape, which onCancel can prevent", async () => {
      const onCancel = vi.fn();
      const { onOpenChange, setProps } = renderSheet({
        open: true,
        popover: true,
        onCancel: (e) => {
          onCancel();
          e.preventDefault();
        },
      });

      await userEvent.keyboard("{Escape}");
      expect(onCancel).toHaveBeenCalledOnce();
      expect(onOpenChange).not.toHaveBeenCalled();

      setProps({ onCancel });
      await userEvent.keyboard("{Escape}");
      expect(onCancel).toHaveBeenCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    });

    test("calls onOpenChange when the browser hides the popover without asking first", async () => {
      const { dialog, getByText, onOpenChange } = renderSheet({
        id: "sheet",
        open: true,
        popover: true,
        children: (
          <button
            type="button"
            popoverTarget="sheet"
            popoverTargetAction="hide"
          >
            Hide
          </button>
        ),
      });

      fireEvent.click(getByText("Hide"));
      expect(dialog.matches(":popover-open")).toBe(false);
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
      });
    });
  });
});

type SheetSnapshotPermutation = Omit<SheetProps, "open" | "onOpenChange"> & {
  permutationName: string;
};

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
    permutationName: "popover mode (right side)",
    title: TITLE,
    description: DESCRIPTION,
    popover: true,
  },
  {
    permutationName: "popover mode (left side with children)",
    title: TITLE,
    description: DESCRIPTION,
    side: "left",
    popover: true,
    children: "Sheet body content",
  },
];

describe("sheet [snapshot]", () => {
  SHEET_SNAPSHOT_PERMUTATIONS.forEach(({ permutationName, ...props }) => {
    test(permutationName, () => {
      const { container } = render(
        <Sheet {...props} open={false} onOpenChange={vi.fn()} />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

type SheetA11yPermutation = {
  label: string;
  props: Omit<SheetProps, "open" | "onOpenChange">;
};

const SHEET_A11Y_PERMUTATIONS: SheetA11yPermutation[] = [
  {
    label: "default",
    props: { title: TITLE, description: DESCRIPTION },
  },
  {
    label: "with children",
    props: {
      title: TITLE,
      description: DESCRIPTION,
      children: (
        <>
          <p>Sheet body content for accessibility test.</p>
          <Button>Save</Button>
        </>
      ),
    },
  },
  {
    label: "left side",
    props: { title: TITLE, description: DESCRIPTION, side: "left" },
  },
  {
    label: "popover mode",
    props: { title: TITLE, description: DESCRIPTION, popover: true },
  },
];

describe("sheet [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty(
        "background",
        "var(--vesper-color-stone-0)",
      );
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    SHEET_A11Y_PERMUTATIONS.forEach(({ label, props }) => {
      test(`a11y - ${label} (${theme})`, async () => {
        const { container } = render(
          <Sheet {...props} open onOpenChange={vi.fn()} />,
        );
        expect(await axe.run(container)).toHaveNoViolations();
      });
    });
  });
});

describe("sheet [a11y, high contrast]", () => {
  emulateHighContrast();

  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty(
        "background",
        "var(--vesper-color-stone-0)",
      );
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    SHEET_A11Y_PERMUTATIONS.forEach(({ label, props }) => {
      test(`wcag2aaa - ${label} (${theme})`, async () => {
        const { container } = render(
          <Sheet {...props} open onOpenChange={vi.fn()} />,
        );
        expect(await runAxeWcag2aaa(container)).toHaveNoViolations();
      });
    });
  });
});
