import { render, cleanup, fireEvent } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test, vi } from "vitest";
import axe from "axe-core";

import {
  Modal,
  type ModalProps,
  MODAL_BUTTONS_ALIGNMENTS,
  useModal,
} from "@/components/modal/modal";

import "@/styles/test.css";

const TITLE = "Are you absolutely sure?";
const DESCRIPTION =
  "This action cannot be undone. This will permanently delete your account from our servers.";

const BUTTONS: ModalProps["buttons"] = [
  { children: "Cancel" },
  { children: "Continue" },
];

afterEach(cleanup);

function ModalWithHook(props: Omit<ModalProps, "ref">) {
  const modal = useModal();
  return (
    <>
      <button data-testid="open-trigger" onClick={modal.open}>
        Open
      </button>
      <button data-testid="close-trigger" onClick={modal.close}>
        Close
      </button>
      <Modal ref={modal.ref} {...props} />
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
    const closeBtn = container.querySelector(".vesper-modal-close-button");
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
    expect(modalContainer).toHaveStyle("width: 600px");
  });

  test("custom width is applied (string)", () => {
    const { container } = render(
      <Modal title={TITLE} description={DESCRIPTION} width="80vw" />,
    );
    const modalContainer = container.querySelector(
      ".vesper-modal-container",
    ) as HTMLElement;
    expect(modalContainer.style.width).toBe("80vw");
  });

  test("default width is 452px", () => {
    const { container } = render(
      <Modal title={TITLE} description={DESCRIPTION} />,
    );
    const modalContainer = container.querySelector(".vesper-modal-container");
    expect(modalContainer).toHaveStyle("width: 452px");
  });

  test("custom maxHeight is applied (number)", () => {
    const { container } = render(
      <Modal title={TITLE} description={DESCRIPTION} maxHeight={800} />,
    );
    const modalContainer = container.querySelector(
      ".vesper-modal-container",
    ) as HTMLElement;
    expect(modalContainer.style.maxHeight).toBe(
      "min(calc(100vh - var(--vesper-spacing-16)), 800px)",
    );
  });

  test("custom maxHeight is applied (string)", () => {
    const { container } = render(
      <Modal title={TITLE} description={DESCRIPTION} maxHeight="90vh" />,
    );
    const modalContainer = container.querySelector(
      ".vesper-modal-container",
    ) as HTMLElement;
    expect(modalContainer.style.maxHeight).toBe(
      "min(calc(100vh - var(--vesper-spacing-16)), 90vh)",
    );
  });

  describe("aria attributes", () => {
    test("aria-labelledby references the title", () => {
      const { container } = render(
        <Modal title={TITLE} description={DESCRIPTION} />,
      );
      const dialog = container.firstElementChild as HTMLDialogElement;
      const titleEl = container.querySelector(".vesper-modal-title");
      const labelledBy = dialog.getAttribute("aria-labelledby");
      expect(labelledBy).toContain(titleEl?.id);
    });

    test("aria-describedby references the description", () => {
      const { container } = render(
        <Modal title={TITLE} description={DESCRIPTION} />,
      );
      const dialog = container.firstElementChild as HTMLDialogElement;
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
      const dialog = container.firstElementChild as HTMLDialogElement;
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
      const dialog = container.firstElementChild as HTMLDialogElement;
      const descEl = container.querySelector(".vesper-modal-description");
      const describedBy = dialog.getAttribute("aria-describedby");
      expect(describedBy).toContain("custom-desc");
      expect(describedBy).toContain(descEl?.id);
    });
  });

  describe("buttons", () => {
    test("renders buttons when provided", () => {
      const { container } = render(
        <Modal title={TITLE} description={DESCRIPTION} buttons={BUTTONS} />,
      );
      const buttonsContainer = container.querySelector(".vesper-modal-buttons");
      expect(buttonsContainer).not.toBeNull();
      const buttons = buttonsContainer?.querySelectorAll("button");
      expect(buttons).toHaveLength(2);
    });

    test("does not render buttons section when buttons is empty", () => {
      const { container } = render(
        <Modal title={TITLE} description={DESCRIPTION} buttons={[]} />,
      );
      const buttonsContainer = container.querySelector(".vesper-modal-buttons");
      expect(buttonsContainer).toBeNull();
    });

    test("does not render buttons section when buttons is undefined", () => {
      const { container } = render(
        <Modal title={TITLE} description={DESCRIPTION} />,
      );
      const buttonsContainer = container.querySelector(".vesper-modal-buttons");
      expect(buttonsContainer).toBeNull();
    });

    test("last button defaults to primary variant", () => {
      const { container } = render(
        <Modal title={TITLE} description={DESCRIPTION} buttons={BUTTONS} />,
      );
      const buttons = container.querySelectorAll(
        ".vesper-modal-buttons button",
      );
      expect(buttons[1]).toHaveClass("vesper-button-primary");
    });

    test("non-last buttons default to tertiary variant", () => {
      const { container } = render(
        <Modal title={TITLE} description={DESCRIPTION} buttons={BUTTONS} />,
      );
      const buttons = container.querySelectorAll(
        ".vesper-modal-buttons button",
      );
      expect(buttons[0]).toHaveClass("vesper-button-tertiary");
    });

    test("explicit variant overrides default", () => {
      const { container } = render(
        <Modal
          title={TITLE}
          description={DESCRIPTION}
          buttons={[
            { children: "Delete", variant: "danger" },
            { children: "Cancel", variant: "ghost" },
          ]}
        />,
      );
      const buttons = container.querySelectorAll(
        ".vesper-modal-buttons button",
      );
      expect(buttons[0]).toHaveClass("vesper-button-danger");
      expect(buttons[1]).toHaveClass("vesper-button-ghost");
    });

    test("single button defaults to primary", () => {
      const { container } = render(
        <Modal
          title={TITLE}
          description={DESCRIPTION}
          buttons={[{ children: "OK" }]}
        />,
      );
      const buttons = container.querySelectorAll(
        ".vesper-modal-buttons button",
      );
      expect(buttons[0]).toHaveClass("vesper-button-primary");
    });

    describe.each(MODAL_BUTTONS_ALIGNMENTS)(
      "buttonsAlignment: %s",
      (alignment) => {
        test(`applies ${alignment} alignment class`, () => {
          const { container } = render(
            <Modal
              title={TITLE}
              description={DESCRIPTION}
              buttons={BUTTONS}
              buttonsAlignment={alignment}
            />,
          );
          const buttonsContainer = container.querySelector(
            ".vesper-modal-buttons",
          );
          expect(buttonsContainer).toHaveClass(
            `vesper-modal-buttons-${alignment}`,
          );
        });
      },
    );

    test("default buttonsAlignment is end", () => {
      const { container } = render(
        <Modal title={TITLE} description={DESCRIPTION} buttons={BUTTONS} />,
      );
      const buttonsContainer = container.querySelector(".vesper-modal-buttons");
      expect(buttonsContainer).toHaveClass("vesper-modal-buttons-end");
    });
  });

  describe("open and close", () => {
    test("opens/closes via useModal hook", () => {
      const result = render(
        <ModalWithHook title={TITLE} description={DESCRIPTION} />,
      );
      const dialog = result.container.querySelector(
        "dialog",
      ) as HTMLDialogElement;

      fireEvent.click(result.getByTestId("open-trigger"));
      expect(dialog.open).toBe(true);

      fireEvent.click(result.getByTestId("close-trigger"));
      expect(dialog.open).toBe(false);
    });

    test("closes via close button", () => {
      const result = render(
        <ModalWithHook title={TITLE} description={DESCRIPTION} />,
      );
      const dialog = result.container.querySelector(
        "dialog",
      ) as HTMLDialogElement;

      fireEvent.click(result.getByTestId("open-trigger"));
      expect(dialog.open).toBe(true);

      const closeBtn = result.container.querySelector(
        ".vesper-modal-close-button",
      ) as HTMLButtonElement;
      fireEvent.click(closeBtn);
      expect(dialog.open).toBe(false);
    });
  });

  describe("closeOnClickOutside", () => {
    test("does not close on backdrop click by default", () => {
      const result = render(
        <ModalWithHook title={TITLE} description={DESCRIPTION} />,
      );
      const dialog = result.container.querySelector(
        "dialog",
      ) as HTMLDialogElement;

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
      const dialog = result.container.querySelector(
        "dialog",
      ) as HTMLDialogElement;

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
      const dialog = result.container.querySelector(
        "dialog",
      ) as HTMLDialogElement;

      fireEvent.click(result.getByTestId("open-trigger"));
      expect(dialog.open).toBe(true);

      const content = result.container.querySelector(
        ".vesper-modal-container",
      ) as HTMLElement;
      fireEvent.click(content);
      expect(dialog.open).toBe(true);
    });
  });

  describe("form mode", () => {
    test("renders a form when form prop is provided", () => {
      const { container } = render(
        <Modal
          title={TITLE}
          description={DESCRIPTION}
          form={{ id: "test-form", method: "post" }}
        />,
      );
      const form = container.querySelector("form");
      expect(form).not.toBeNull();
      expect(form).toHaveClass("vesper-modal-container");
    });

    test("form receives form props", () => {
      const { container } = render(
        <Modal
          title={TITLE}
          description={DESCRIPTION}
          form={{
            id: "test-form",
            method: "post",
            action: "/submit",
            name: "my-form",
          }}
        />,
      );
      const form = container.querySelector("form");
      expect(form).toHaveAttribute("id", "test-form");
      expect(form).toHaveAttribute("method", "post");
      expect(form).toHaveAttribute("action", "/submit");
      expect(form).toHaveAttribute("name", "my-form");
    });

    test("renders a div when form prop is not provided", () => {
      const { container } = render(
        <Modal title={TITLE} description={DESCRIPTION} />,
      );
      const modalContainer = container.querySelector(".vesper-modal-container");
      expect(modalContainer?.tagName).toBe("DIV");
    });

    test("form onSubmit callback fires", () => {
      const onSubmit = vi.fn((e) => e.preventDefault());
      const result = render(
        <ModalWithHook
          title={TITLE}
          description={DESCRIPTION}
          form={{ id: "test-form", onSubmit }}
          buttons={[{ children: "Submit", type: "submit" }]}
        />,
      );

      fireEvent.click(result.getByTestId("open-trigger"));

      const form = result.container.querySelector("form") as HTMLFormElement;
      fireEvent.submit(form);
      expect(onSubmit).toHaveBeenCalled();
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
    permutationName: "with buttons (end alignment)",
    title: TITLE,
    description: DESCRIPTION,
    buttons: BUTTONS,
    buttonsAlignment: "end",
  },
  {
    permutationName: "with buttons (start alignment)",
    title: TITLE,
    description: DESCRIPTION,
    buttons: BUTTONS,
    buttonsAlignment: "start",
  },
  {
    permutationName: "with buttons (fill alignment)",
    title: TITLE,
    description: DESCRIPTION,
    buttons: BUTTONS,
    buttonsAlignment: "fill",
  },
  {
    permutationName: "with buttons (between alignment)",
    title: TITLE,
    description: DESCRIPTION,
    buttons: BUTTONS,
    buttonsAlignment: "between",
  },
  {
    permutationName: "with form",
    title: TITLE,
    description: DESCRIPTION,
    form: { id: "modal-form", method: "post" },
    buttons: BUTTONS,
  },
  {
    permutationName: "custom width and maxHeight",
    title: TITLE,
    description: DESCRIPTION,
    width: 600,
    maxHeight: 800,
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
    label: "with buttons",
    props: { title: TITLE, description: DESCRIPTION, buttons: BUTTONS },
  },
  {
    label: "with children",
    props: { title: TITLE, description: DESCRIPTION },
    children: <p>Modal body content for accessibility test.</p>,
  },
  {
    label: "with form",
    props: {
      title: TITLE,
      description: DESCRIPTION,
      form: { id: "a11y-form" },
      buttons: BUTTONS,
    },
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

      test.todo(testLabel, async () => {
        const result = render(
          <ModalWithHook {...props}>{children}</ModalWithHook>,
        );
        fireEvent.click(result.getByTestId("open-trigger"));
        const dialog = result.container.querySelector(
          "dialog",
        ) as HTMLDialogElement;
        expect(dialog.open).toBe(true);
        expect(await axe.run(result.container)).toHaveNoViolations();
      });
    });
  });
});
