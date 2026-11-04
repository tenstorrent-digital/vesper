import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, assert, beforeEach, describe, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { Modal, type ModalProps, useModal } from "@/components/modal/modal";
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

function ModalWithHook(props: Omit<ModalProps, "ref">) {
  const { ref, open, close } = useModal();
  return (
    <>
      <button data-testid="open-trigger" onClick={open}>
        Open
      </button>
      <button data-testid="close-trigger" onClick={close}>
        Close
      </button>
      <Modal ref={ref} {...props} />
    </>
  );
}

describe("modal [unit]", () => {
  test("renders a dialog element", () => {
    const { container } = render(
      <Modal title={TITLE} description={DESCRIPTION} />,
    );
    expect(container.firstElementChild?.tagName).toBe("DIALOG");
  });

  test("renders title", () => {
    const { container } = render(
      <Modal title={TITLE} description={DESCRIPTION} />,
    );
    const heading = container.querySelector(".vesper-modal-title");
    expect(heading).not.toBeNull();
    expect(heading?.textContent).toBe(TITLE);
  });

  test("renders description", () => {
    const { container } = render(
      <Modal title={TITLE} description={DESCRIPTION} />,
    );
    const desc = container.querySelector(".vesper-modal-description");
    expect(desc).not.toBeNull();
    expect(desc?.textContent).toBe(DESCRIPTION);
  });

  test("renders children content", () => {
    const { container } = render(
      <Modal title={TITLE} description={DESCRIPTION}>
        <p>Modal body content</p>
      </Modal>,
    );
    const content = container.querySelector(".vesper-modal-content");
    expect(content).not.toBeNull();
    expect(content?.textContent).toBe("Modal body content");
  });

  test("does not render content section when no children", () => {
    const { container } = render(
      <Modal title={TITLE} description={DESCRIPTION} />,
    );
    const content = container.querySelector(".vesper-modal-content");
    expect(content).toBeNull();
  });

  test("renders close button with aria-label", () => {
    const { container } = render(
      <Modal title={TITLE} description={DESCRIPTION} />,
    );
    const closeBtn = container.querySelector(
      ".vesper-modal-header .vesper-button",
    );
    expect(closeBtn).not.toBeNull();
    expect(closeBtn).toHaveAttribute("aria-label", "Close modal");
    expect(closeBtn).toHaveAttribute("type", "button");
  });

  test("custom className is merged", () => {
    const { container } = render(
      <Modal
        title={TITLE}
        description={DESCRIPTION}
        className="custom-class"
      />,
    );
    const dialog = container.firstElementChild;
    expect(dialog).toHaveClass("vesper-modal");
    expect(dialog).toHaveClass("custom-class");
  });

  test("additional props are passed through", () => {
    const { container } = render(
      <Modal
        title={TITLE}
        description={DESCRIPTION}
        data-testid="my-modal"
        id="modal-1"
      />,
    );
    const dialog = container.firstElementChild;
    expect(dialog).toHaveAttribute("data-testid", "my-modal");
    expect(dialog).toHaveAttribute("id", "modal-1");
  });

  test("custom width is applied (number)", () => {
    const { container } = render(
      <Modal title={TITLE} description={DESCRIPTION} width={600} />,
    );
    const modalContainer = container.querySelector(".vesper-modal-container");
    assert.instanceOf(modalContainer, HTMLElement);
    expect(modalContainer.style.width).toBe("calc(37.5rem)");
  });

  test("custom width is applied (string)", () => {
    const { container } = render(
      <Modal title={TITLE} description={DESCRIPTION} width="80vw" />,
    );
    const modalContainer = container.querySelector(".vesper-modal-container");
    assert.instanceOf(modalContainer, HTMLElement);
    expect(modalContainer.style.width).toBe("80vw");
  });

  test("default width is 452px", () => {
    const { container } = render(
      <Modal title={TITLE} description={DESCRIPTION} />,
    );
    const modalContainer = container.querySelector(".vesper-modal-container");
    assert.instanceOf(modalContainer, HTMLElement);
    expect(modalContainer.style.width).toBe("calc(28.25rem)");
  });

  describe("aria attributes", () => {
    test("aria-labelledby references the title", () => {
      const { container } = render(
        <Modal title={TITLE} description={DESCRIPTION} />,
      );
      const dialog = container.firstElementChild;
      assert.instanceOf(dialog, HTMLDialogElement);
      const titleEl = container.querySelector(".vesper-modal-title");
      const labelledBy = dialog.getAttribute("aria-labelledby");
      expect(labelledBy).toContain(titleEl?.id);
    });

    test("aria-describedby references the description", () => {
      const { container } = render(
        <Modal title={TITLE} description={DESCRIPTION} />,
      );
      const dialog = container.firstElementChild;
      assert.instanceOf(dialog, HTMLDialogElement);
      const descEl = container.querySelector(".vesper-modal-description");
      const describedBy = dialog.getAttribute("aria-describedby");
      expect(describedBy).toContain(descEl?.id);
    });

    test("custom aria-labelledby is merged with title id", () => {
      const { container } = render(
        <Modal
          title={TITLE}
          description={DESCRIPTION}
          aria-labelledby="custom-label"
        />,
      );
      const dialog = container.firstElementChild;
      assert.instanceOf(dialog, HTMLDialogElement);
      const titleEl = container.querySelector(".vesper-modal-title");
      const labelledBy = dialog.getAttribute("aria-labelledby");
      expect(labelledBy).toContain("custom-label");
      expect(labelledBy).toContain(titleEl?.id);
    });

    test("custom aria-describedby is merged with description id", () => {
      const { container } = render(
        <Modal
          title={TITLE}
          description={DESCRIPTION}
          aria-describedby="custom-desc"
        />,
      );
      const dialog = container.firstElementChild;
      assert.instanceOf(dialog, HTMLDialogElement);
      const descEl = container.querySelector(".vesper-modal-description");
      const describedBy = dialog.getAttribute("aria-describedby");
      expect(describedBy).toContain("custom-desc");
      expect(describedBy).toContain(descEl?.id);
    });
  });

  describe("open and close", () => {
    test("opens/closes via useModal hook", () => {
      const result = render(
        <ModalWithHook title={TITLE} description={DESCRIPTION} />,
      );
      const dialog = result.container.querySelector("dialog");
      assert.instanceOf(dialog, HTMLDialogElement);

      fireEvent.click(result.getByTestId("open-trigger"));
      expect(dialog.open).toBe(true);

      fireEvent.click(result.getByTestId("close-trigger"));
      expect(dialog.open).toBe(false);
    });

    test("closes via close button", () => {
      const result = render(
        <ModalWithHook title={TITLE} description={DESCRIPTION} />,
      );
      const dialog = result.container.querySelector("dialog");
      assert.instanceOf(dialog, HTMLDialogElement);

      fireEvent.click(result.getByTestId("open-trigger"));
      expect(dialog.open).toBe(true);

      const closeBtn = result.container.querySelector(
        ".vesper-modal-header .vesper-button",
      );
      assert.instanceOf(closeBtn, HTMLButtonElement);
      fireEvent.click(closeBtn);
      expect(dialog.open).toBe(false);
    });
  });

  describe("closeOnClickOutside", () => {
    test("does not close on backdrop click by default", () => {
      const result = render(
        <ModalWithHook title={TITLE} description={DESCRIPTION} />,
      );
      const dialog = result.container.querySelector("dialog");
      assert.instanceOf(dialog, HTMLDialogElement);

      fireEvent.click(result.getByTestId("open-trigger"));
      expect(dialog.open).toBe(true);

      fireEvent.click(dialog);
      expect(dialog.open).toBe(true);
    });

    test("closes on backdrop click when closeOnClickOutside is true", () => {
      const result = render(
        <ModalWithHook
          title={TITLE}
          description={DESCRIPTION}
          closeOnClickOutside
        />,
      );
      const dialog = result.container.querySelector("dialog");
      assert.instanceOf(dialog, HTMLDialogElement);

      fireEvent.click(result.getByTestId("open-trigger"));
      expect(dialog.open).toBe(true);

      fireEvent.click(dialog);
      expect(dialog.open).toBe(false);
    });

    test("does not close when clicking inside the modal", () => {
      const result = render(
        <ModalWithHook
          title={TITLE}
          description={DESCRIPTION}
          closeOnClickOutside
        >
          <p>Inner content</p>
        </ModalWithHook>,
      );
      const dialog = result.container.querySelector("dialog");
      assert.instanceOf(dialog, HTMLDialogElement);

      fireEvent.click(result.getByTestId("open-trigger"));
      expect(dialog.open).toBe(true);

      const content = result.container.querySelector(".vesper-modal-container");
      assert.instanceOf(content, HTMLElement);
      fireEvent.click(content);
      expect(dialog.open).toBe(true);
    });
  });

  describe("dismissible", () => {
    test("closes on Escape by default", async () => {
      const result = render(
        <ModalWithHook title={TITLE} description={DESCRIPTION} />,
      );
      const dialog = result.container.querySelector("dialog");
      assert.instanceOf(dialog, HTMLDialogElement);

      await userEvent.click(result.getByTestId("open-trigger"));
      expect(dialog.open).toBe(true);

      await userEvent.keyboard("{Escape}");
      expect(dialog.open).toBe(false);
    });

    test("close button is enabled by default", () => {
      const { container } = render(
        <Modal title={TITLE} description={DESCRIPTION} />,
      );
      const closeBtn = container.querySelector(
        ".vesper-modal-header .vesper-button",
      );
      expect(closeBtn).toBeEnabled();
    });

    test("does not close on Escape when dismissible is false", async () => {
      const result = render(
        <ModalWithHook
          title={TITLE}
          description={DESCRIPTION}
          dismissible={false}
        />,
      );
      const dialog = result.container.querySelector("dialog");
      assert.instanceOf(dialog, HTMLDialogElement);

      await userEvent.click(result.getByTestId("open-trigger"));
      expect(dialog.open).toBe(true);

      // browsers stop honouring `preventDefault()` on the `cancel` event after repeated `Escape` presses,
      // so press it several times and check that the modal is still open
      await userEvent.keyboard("{Escape}");
      await userEvent.keyboard("{Escape}");
      await userEvent.keyboard("{Escape}");
      expect(dialog.open).toBe(true);
    });

    test("does not close on Escape when focus is inside the modal and dismissible is false", async () => {
      const result = render(
        <ModalWithHook
          title={TITLE}
          description={DESCRIPTION}
          dismissible={false}
        >
          <input aria-label="Name" data-testid="modal-input" />
        </ModalWithHook>,
      );
      const dialog = result.container.querySelector("dialog");
      assert.instanceOf(dialog, HTMLDialogElement);

      await userEvent.click(result.getByTestId("open-trigger"));
      await userEvent.click(result.getByTestId("modal-input"));
      expect(result.getByTestId("modal-input")).toHaveFocus();

      await userEvent.keyboard("{Escape}");
      await userEvent.keyboard("{Escape}");
      expect(dialog.open).toBe(true);
    });

    test("prevents the cancel event when dismissible is false", () => {
      const result = render(
        <ModalWithHook
          title={TITLE}
          description={DESCRIPTION}
          dismissible={false}
        />,
      );
      const dialog = result.container.querySelector("dialog");
      assert.instanceOf(dialog, HTMLDialogElement);

      fireEvent.click(result.getByTestId("open-trigger"));

      const event = new Event("cancel", { cancelable: true });
      dialog.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
      expect(dialog.open).toBe(true);
    });

    test("still lets popups inside the modal close on Escape when dismissible is false", async () => {
      const result = render(
        <ModalWithHook
          title={TITLE}
          description={DESCRIPTION}
          dismissible={false}
        >
          <Select aria-label="Fruit" options={["Apple", "Banana"]} />
        </ModalWithHook>,
      );
      const dialog = result.container.querySelector("dialog");
      assert.instanceOf(dialog, HTMLDialogElement);

      await userEvent.click(result.getByTestId("open-trigger"));

      const trigger = result.getByRole("combobox");
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
      expect(dialog.open).toBe(true);
    });

    test("does not close on backdrop click when dismissible is false, even with closeOnClickOutside", () => {
      const result = render(
        <ModalWithHook
          title={TITLE}
          description={DESCRIPTION}
          closeOnClickOutside
          dismissible={false}
        />,
      );
      const dialog = result.container.querySelector("dialog");
      assert.instanceOf(dialog, HTMLDialogElement);

      fireEvent.click(result.getByTestId("open-trigger"));
      expect(dialog.open).toBe(true);

      fireEvent.click(dialog);
      expect(dialog.open).toBe(true);
    });

    test("disables the close button when dismissible is false", () => {
      const result = render(
        <ModalWithHook
          title={TITLE}
          description={DESCRIPTION}
          dismissible={false}
        />,
      );
      const dialog = result.container.querySelector("dialog");
      assert.instanceOf(dialog, HTMLDialogElement);

      fireEvent.click(result.getByTestId("open-trigger"));

      const closeBtn = result.container.querySelector(
        ".vesper-modal-header .vesper-button",
      );
      assert.instanceOf(closeBtn, HTMLButtonElement);
      expect(closeBtn).toBeDisabled();

      fireEvent.click(closeBtn);
      expect(dialog.open).toBe(true);
    });

    test("can still be closed programmatically when dismissible is false", () => {
      const result = render(
        <ModalWithHook
          title={TITLE}
          description={DESCRIPTION}
          dismissible={false}
        />,
      );
      const dialog = result.container.querySelector("dialog");
      assert.instanceOf(dialog, HTMLDialogElement);

      fireEvent.click(result.getByTestId("open-trigger"));
      expect(dialog.open).toBe(true);

      fireEvent.click(result.getByTestId("close-trigger"));
      expect(dialog.open).toBe(false);
    });

    test("can be dismissed again once dismissible is set back to true", async () => {
      const result = render(
        <ModalWithHook
          title={TITLE}
          description={DESCRIPTION}
          closeOnClickOutside
          dismissible={false}
        />,
      );
      const dialog = result.container.querySelector("dialog");
      assert.instanceOf(dialog, HTMLDialogElement);

      await userEvent.click(result.getByTestId("open-trigger"));
      await userEvent.keyboard("{Escape}");
      fireEvent.click(dialog);
      expect(dialog.open).toBe(true);

      result.rerender(
        <ModalWithHook
          title={TITLE}
          description={DESCRIPTION}
          closeOnClickOutside
          dismissible
        />,
      );

      const closeBtn = result.container.querySelector(
        ".vesper-modal-header .vesper-button",
      );
      expect(closeBtn).toBeEnabled();

      // the escape key closes the modal again
      expect(dialog.open).toBe(true);
      await userEvent.keyboard("{Escape}");
      expect(dialog.open).toBe(false);

      // clicking the backdrop closes the modal again
      fireEvent.click(result.getByTestId("open-trigger"));
      fireEvent.click(dialog);
      expect(dialog.open).toBe(false);
    });
  });
});

type ModalSnapshotPermutation = ModalProps & { permutationName: string };

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
      const { container } = render(<Modal {...props} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

type ModalA11yPermutation = {
  label: string;
  props: Omit<ModalProps, "ref">;
  children?: React.ReactNode;
};

const MODAL_A11Y_PERMUTATIONS: ModalA11yPermutation[] = [
  {
    label: "default",
    props: { title: TITLE, description: DESCRIPTION },
  },
  {
    label: "with children",
    props: { title: TITLE, description: DESCRIPTION },
    children: <p>Modal body content for accessibility test.</p>,
  },
];

describe("modal [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    MODAL_A11Y_PERMUTATIONS.forEach(({ label, props, children }) => {
      const testLabel = `a11y - ${label} (${theme})`;

      test(testLabel, async () => {
        const result = render(
          <ModalWithHook {...props}>{children}</ModalWithHook>,
        );
        fireEvent.click(result.getByTestId("open-trigger"));
        const dialog = result.container.querySelector("dialog");
        assert.instanceOf(dialog, HTMLDialogElement);
        expect(dialog.open).toBe(true);
        expect(await axe.run(result.container)).toHaveNoViolations();
      });
    });
  });
});

describe("modal [a11y, high contrast]", () => {
  emulateHighContrast();

  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    MODAL_A11Y_PERMUTATIONS.forEach(({ label, props, children }) => {
      const testLabel = `wcag2aaa - ${label} (${theme})`;

      test(testLabel, async () => {
        const result = render(
          <ModalWithHook {...props}>{children}</ModalWithHook>,
        );
        fireEvent.click(result.getByTestId("open-trigger"));
        const dialog = result.container.querySelector("dialog");
        assert.instanceOf(dialog, HTMLDialogElement);
        expect(dialog.open).toBe(true);
        expect(await runAxeWcag2aaa(result.container)).toHaveNoViolations();
      });
    });
  });
});
