import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import axe from "axe-core";
import { createRef } from "react";
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
 * renders a sheet with an `onOpenChange` spy, and returns its `<dialog>` element and close button,
 * along with `setProps` to re-render the sheet with the initial props merged with new ones
 */
function renderSheet(initialProps: Partial<SheetProps> = {}) {
  const onOpenChange = vi.fn();
  const renderWith = (props: Partial<SheetProps>) => (
    <Sheet
      title={TITLE}
      description={DESCRIPTION}
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

  test("opens when defaultOpen is true, and closes via the close button", () => {
    const { dialog, closeButton, onOpenChange } = renderSheet({
      defaultOpen: true,
    });
    expect(dialog.open).toBe(true);

    fireEvent.click(closeButton);
    expect(dialog.open).toBe(false);
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });

  test("closes on Escape", async () => {
    const { dialog, onOpenChange } = renderSheet({ defaultOpen: true });

    await userEvent.keyboard("{Escape}");
    expect(dialog.open).toBe(false);
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });

  test("closes on the cancel event", () => {
    const { dialog, onOpenChange } = renderSheet({ defaultOpen: true });

    // browsers fire `cancel` on the dialog for close requests other than `Escape` (eg. the Android back gesture),
    // and close the dialog unless the event is prevented
    const cancel = new Event("cancel", { cancelable: true });
    fireEvent(dialog, cancel);
    expect(cancel.defaultPrevented).toBe(true);
    expect(dialog.open).toBe(false);
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });

  test("closes on backdrop click, but not on clicks inside the sheet", () => {
    const { dialog, getByText, onOpenChange } = renderSheet({
      defaultOpen: true,
    });

    fireEvent.click(getByText(TITLE));
    expect(dialog.open).toBe(true);

    fireEvent.click(dialog);
    expect(dialog.open).toBe(false);
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });

  test("opens and closes with the open prop", () => {
    const { dialog, setProps } = renderSheet({ open: false });
    expect(dialog.open).toBe(false);

    setProps({ open: true });
    expect(dialog.open).toBe(true);

    setProps({ open: false });
    expect(dialog.open).toBe(false);
  });

  test("calls onOpenChange instead of closing when the open prop is set", async () => {
    const { dialog, closeButton, onOpenChange } = renderSheet({ open: true });

    fireEvent.click(closeButton);
    fireEvent.click(dialog);
    await userEvent.keyboard("{Escape}");
    expect(onOpenChange.mock.calls).toEqual([[false], [false], [false]]);
    expect(dialog.open).toBe(true);
  });

  test("keeps its open state in sync when showModal() is called on the dialog", async () => {
    const { dialog, closeButton, onOpenChange } = renderSheet();

    dialog.showModal();
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
    });

    fireEvent.click(closeButton);
    expect(dialog.open).toBe(false);
  });

  test("lets popups inside the sheet handle Escape first", async () => {
    const { dialog, getByRole, onOpenChange } = renderSheet({
      defaultOpen: true,
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
    expect(dialog.open).toBe(true);

    await userEvent.keyboard("{Escape}");
    expect(dialog.open).toBe(false);
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });

  describe("popover mode", () => {
    test("opens as a popover, and closes on Escape", async () => {
      const { dialog, onOpenChange } = renderSheet({
        defaultOpen: true,
        popover: true,
      });
      expect(dialog.matches(":popover-open")).toBe(true);
      expect(dialog.open).toBe(false);

      await userEvent.keyboard("{Escape}");
      expect(dialog.matches(":popover-open")).toBe(false);
      expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    });

    test("keeps its open state in sync when showPopover() is called on the dialog", async () => {
      const { dialog, closeButton, onOpenChange } = renderSheet({
        popover: true,
      });

      dialog.showPopover();
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
      });

      fireEvent.click(closeButton);
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
      const { container } = render(<Sheet {...props} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

type SheetA11yPermutation = { label: string; props: SheetProps };

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
        const { container } = render(<Sheet {...props} defaultOpen />);
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
        const { container } = render(<Sheet {...props} defaultOpen />);
        expect(await runAxeWcag2aaa(container)).toHaveNoViolations();
      });
    });
  });
});
