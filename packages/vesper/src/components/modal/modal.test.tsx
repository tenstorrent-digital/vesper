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

import { Modal, type ModalProps } from "@/components/modal/modal";
import { Select } from "@/components/select/select";
import {
  emulateHighContrast,
  runAxeWcag2aaa,
} from "@/test-utils/high-contrast";
import "@/styles/test.css";

const TITLE = "Are you absolutely sure?";
const DESCRIPTION =
  "This action cannot be undone. This will permanently delete your account from our servers.";

afterEach(cleanup);

/**
 * renders a modal with a fixed `open` prop and an `onOpenChange` spy, and returns its `<dialog>` element and close button,
 * along with `setProps` to re-render the modal with the initial props merged with new ones
 */
function renderModal(initialProps: Partial<ModalProps> = {}) {
  const onOpenChange = vi.fn();
  const renderWith = (props: Partial<ModalProps>) => (
    <Modal
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
    closeButton: result.getByLabelText("Close modal"),
    onOpenChange,
    setProps: (props: Partial<ModalProps>) =>
      result.rerender(renderWith(props)),
  };
}

/**
 * a modal that keeps its open state in React state, the way consumers are expected to use it
 */
function StatefulModal(props: Omit<ModalProps, "open" | "onOpenChange">) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Open
      </button>
      <Modal {...props} open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}

describe("modal [unit]", () => {
  test("labels and describes the dialog with its title and description", () => {
    const { dialog, getByText } = renderModal({
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
    const { dialog } = renderModal({ ref, className: "custom", id: "modal" });
    expect(ref.current).toBe(dialog);
    expect(dialog).toHaveClass("vesper-modal", "custom");
    expect(dialog).toHaveAttribute("id", "modal");
  });

  test("opens and closes with the open prop, without calling onOpenChange", async () => {
    const { dialog, onOpenChange, setProps } = renderModal();
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
    const { dialog, closeButton, onOpenChange } = renderModal({
      open: true,
      closeOnClickOutside: true,
    });

    fireEvent.click(closeButton);
    fireEvent.click(dialog);
    await userEvent.keyboard("{Escape}");
    expect(onOpenChange.mock.calls).toEqual([[false], [false], [false]]);
    expect(dialog.open).toBe(true);
  });

  test("closes when the user dismisses it, if onOpenChange updates the open prop", async () => {
    const { container, getByLabelText, getByText } = render(
      <StatefulModal title={TITLE} description={DESCRIPTION} />,
    );
    const dialog = container.querySelector("dialog");
    assert.instanceOf(dialog, HTMLDialogElement);

    fireEvent.click(getByText("Open"));
    expect(dialog.open).toBe(true);
    fireEvent.click(getByLabelText("Close modal"));
    expect(dialog.open).toBe(false);

    fireEvent.click(getByText("Open"));
    expect(dialog.open).toBe(true);
    await userEvent.keyboard("{Escape}");
    expect(dialog.open).toBe(false);
  });

  test("calls onOpenChange on backdrop click only when closeOnClickOutside is true", () => {
    const { dialog, getByText, onOpenChange, setProps } = renderModal({
      open: true,
    });

    fireEvent.click(dialog);
    expect(onOpenChange).not.toHaveBeenCalled();

    setProps({ closeOnClickOutside: true });
    fireEvent.click(getByText(TITLE));
    expect(onOpenChange).not.toHaveBeenCalled();

    fireEvent.click(dialog);
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });

  test("calls onOpenChange when the browser closes the dialog without asking first", async () => {
    const { dialog, getByText, onOpenChange } = renderModal({
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

  test("cannot be dismissed while dismissible is false", async () => {
    const { dialog, closeButton, getByText, onOpenChange, setProps } =
      renderModal({
        open: true,
        closeOnClickOutside: true,
        dismissible: false,
      });

    expect(closeButton).toBeDisabled();
    fireEvent.click(dialog);

    // after a user interaction, browsers only honour `preventDefault()` on the first `cancel` event that `Escape` triggers,
    // so click inside the modal, then press `Escape` several times and check that the modal is still open
    await userEvent.click(getByText(TITLE));
    await userEvent.keyboard("{Escape}");
    await userEvent.keyboard("{Escape}");
    await userEvent.keyboard("{Escape}");
    expect(dialog.open).toBe(true);
    expect(onOpenChange).not.toHaveBeenCalled();

    setProps({ dismissible: true });
    await userEvent.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });

  test("calls onOpenChange on the cancel event, unless dismissible is false", () => {
    const { dialog, onOpenChange, setProps } = renderModal({
      open: true,
      dismissible: false,
    });

    // browsers fire `cancel` on the dialog for close requests other than `Escape` (eg. the Android back gesture),
    // and close the dialog unless the event is prevented
    const blockedCancel = new Event("cancel", { cancelable: true });
    fireEvent(dialog, blockedCancel);
    expect(blockedCancel.defaultPrevented).toBe(true);
    expect(onOpenChange).not.toHaveBeenCalled();

    setProps({ dismissible: true });
    const cancel = new Event("cancel", { cancelable: true });
    fireEvent(dialog, cancel);
    expect(cancel.defaultPrevented).toBe(true);
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });

  test("fires the cancel event on Escape, even while dismissible is false", async () => {
    const onCancel = vi.fn();
    const { onOpenChange, setProps } = renderModal({
      open: true,
      dismissible: false,
      onCancel,
    });

    await userEvent.keyboard("{Escape}");
    expect(onCancel).toHaveBeenCalledOnce();
    expect(onOpenChange).not.toHaveBeenCalled();

    setProps({ dismissible: true });
    await userEvent.keyboard("{Escape}");
    expect(onCancel).toHaveBeenCalledTimes(2);
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });

  test("doesn't call onOpenChange when onCancel prevents the cancel event", async () => {
    const { dialog, getByText, onOpenChange } = renderModal({
      open: true,
      onCancel: (e) => e.preventDefault(),
    });

    // after a user interaction, browsers only honour `preventDefault()` on the first `cancel` event that `Escape` triggers,
    // so click inside the modal, then press `Escape` several times and check that the modal is still open
    await userEvent.click(getByText(TITLE));
    await userEvent.keyboard("{Escape}");
    await userEvent.keyboard("{Escape}");
    await userEvent.keyboard("{Escape}");

    // close requests other than `Escape` (eg. the Android back gesture) fire `cancel` on the dialog too
    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    expect(dialog.open).toBe(true);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test("lets popups inside the modal handle Escape first", async () => {
    const { getByRole, onOpenChange } = renderModal({
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
});

type ModalSnapshotPermutation = Omit<ModalProps, "open" | "onOpenChange"> & {
  permutationName: string;
};

const MODAL_SNAPSHOT_PERMUTATIONS: ModalSnapshotPermutation[] = [
  {
    permutationName: "default",
    title: TITLE,
    description: DESCRIPTION,
  },
  {
    permutationName: "with children",
    title: TITLE,
    description: DESCRIPTION,
    children: "Some body content",
  },
  {
    permutationName: "custom width",
    title: TITLE,
    description: DESCRIPTION,
    width: 600,
  },
];

describe("modal [snapshot]", () => {
  MODAL_SNAPSHOT_PERMUTATIONS.forEach(({ permutationName, ...props }) => {
    test(permutationName, () => {
      const { container } = render(
        <Modal {...props} open={false} onOpenChange={vi.fn()} />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

type ModalA11yPermutation = {
  label: string;
  props: Omit<ModalProps, "open" | "onOpenChange">;
};

const MODAL_A11Y_PERMUTATIONS: ModalA11yPermutation[] = [
  {
    label: "default",
    props: { title: TITLE, description: DESCRIPTION },
  },
  {
    label: "with children",
    props: {
      title: TITLE,
      description: DESCRIPTION,
      children: <p>Modal body content for accessibility test.</p>,
    },
  },
];

describe("modal [a11y]", () => {
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

    MODAL_A11Y_PERMUTATIONS.forEach(({ label, props }) => {
      test(`a11y - ${label} (${theme})`, async () => {
        const { container } = render(
          <Modal {...props} open onOpenChange={vi.fn()} />,
        );
        expect(await axe.run(container)).toHaveNoViolations();
      });
    });
  });
});

describe("modal [a11y, high contrast]", () => {
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

    MODAL_A11Y_PERMUTATIONS.forEach(({ label, props }) => {
      test(`wcag2aaa - ${label} (${theme})`, async () => {
        const { container } = render(
          <Modal {...props} open onOpenChange={vi.fn()} />,
        );
        expect(await runAxeWcag2aaa(container)).toHaveNoViolations();
      });
    });
  });
});
