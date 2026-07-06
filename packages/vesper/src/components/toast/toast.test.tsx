import { render, cleanup, fireEvent, screen } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test, vi } from "vitest";
import axe from "axe-core";

import { Toasts, addToast } from "@/components/toast/toast";
import {
  destroyAllToasts,
  TOAST_VARIANTS,
  type ToastVariant,
} from "@/components/toast/store";

import "@/styles/test.css";

/**
 * Flush pending animation promises (duration: 0 via reduced-motion mock).
 * Uses requestAnimationFrame which is unaffected by vi.useFakeTimers().
 */
const flush = () => new Promise((r) => requestAnimationFrame(r));

beforeEach(() => {
  destroyAllToasts();
});

afterEach(() => {
  cleanup();
  destroyAllToasts();
});

describe("toast [unit]", () => {
  describe("rendering", () => {
    test("renders toasts container as a portal in document.body", () => {
      render(<Toasts />);

      const container = document.querySelector(".vesper-toasts-container");
      expect(container).not.toBeNull();
      expect(container?.parentElement).toBe(document.body);
    });

    test("container has region role", () => {
      render(<Toasts />);

      const container = document.querySelector(".vesper-toasts-container");
      expect(container).toHaveAttribute("role", "region");
    });

    test("container has default aria-label", () => {
      render(<Toasts />);

      const container = document.querySelector(".vesper-toasts-container");
      expect(container).toHaveAttribute("aria-label", "Notifications");
    });

    test("container supports custom aria-label", () => {
      render(<Toasts ariaLabel="Toast messages" />);

      const container = document.querySelector(".vesper-toasts-container");
      expect(container).toHaveAttribute("aria-label", "Toast messages");
    });

    test("renders empty when no toasts are added", () => {
      render(<Toasts />);

      const container = document.querySelector(".vesper-toasts-container");
      expect(container?.children).toHaveLength(0);
    });

    test("renders a toast when addToast is called", async () => {
      render(<Toasts />);

      addToast({ content: "Hello world" });
      await flush();

      expect(document.querySelector(".vesper-toast")).not.toBeNull();
    });

    test("renders toast content text", async () => {
      render(<Toasts />);

      addToast({ content: "Operation completed" });
      await flush();

      expect(screen.getByText("Operation completed")).not.toBeNull();
    });

    test("renders multiple toasts", async () => {
      render(<Toasts />);

      addToast({ content: "First toast" });
      addToast({ content: "Second toast" });
      addToast({ content: "Third toast" });
      await flush();

      const toasts = document.querySelectorAll(".vesper-toast");
      expect(toasts).toHaveLength(3);
    });

    test("renders close button with aria-label", async () => {
      render(<Toasts />);

      addToast({ content: "Dismissible toast" });
      await flush();

      const closeButton = document.querySelector(".vesper-toast-close-button");
      expect(closeButton).not.toBeNull();
      expect(closeButton).toHaveAttribute("aria-label", "Dismiss");
    });
  });

  describe("variants", () => {
    test("default variant applies correct class and no icon", async () => {
      render(<Toasts />);

      addToast({ content: "Default toast", variant: "default" });
      await flush();

      const textEl = screen.getByText("Default toast");
      const toast = textEl.closest(".vesper-toast");
      expect(toast).toHaveClass("vesper-toast-default");
      expect(toast?.querySelector(".vesper-toast-icon")).toBeNull();
    });

    test("loading variant renders spinner icon", async () => {
      render(<Toasts />);

      addToast({ content: "Loading...", variant: "loading" });
      await flush();

      const textEl = screen.getByText("Loading...");
      const toast = textEl.closest(".vesper-toast");
      expect(toast).toHaveClass("vesper-toast-loading");
      expect(toast?.querySelector(".vesper-toast-icon")).not.toBeNull();
    });

    test("success variant renders success icon", async () => {
      render(<Toasts />);

      addToast({ content: "Done!", variant: "success" });
      await flush();

      const textEl = screen.getByText("Done!");
      const toast = textEl.closest(".vesper-toast");
      expect(toast).toHaveClass("vesper-toast-success");
      expect(toast?.querySelector(".vesper-toast-icon")).not.toBeNull();
    });

    test("warning variant renders warning icon", async () => {
      render(<Toasts />);

      addToast({ content: "Warning!", variant: "warning" });
      await flush();

      const textEl = screen.getByText("Warning!");
      const toast = textEl.closest(".vesper-toast");
      expect(toast).toHaveClass("vesper-toast-warning");
      expect(toast?.querySelector(".vesper-toast-icon")).not.toBeNull();
    });

    test("danger variant renders error icon", async () => {
      render(<Toasts />);

      addToast({ content: "Error!", variant: "danger" });
      await flush();

      const textEl = screen.getByText("Error!");
      const toast = textEl.closest(".vesper-toast");
      expect(toast).toHaveClass("vesper-toast-danger");
      expect(toast?.querySelector(".vesper-toast-icon")).not.toBeNull();
    });
  });

  describe("role attribute", () => {
    test("defaults to status role", async () => {
      render(<Toasts />);

      addToast({ content: "Status message" });
      await flush();

      const content = screen.getByText("Status message");
      expect(content).toHaveAttribute("role", "status");
    });

    test("supports alert role", async () => {
      render(<Toasts />);

      addToast({ content: "Alert message", role: "alert" });
      await flush();

      const content = screen.getByText("Alert message");
      expect(content).toHaveAttribute("role", "alert");
    });
  });

  describe("buttons", () => {
    test("renders no buttons section when buttons array is empty", async () => {
      render(<Toasts />);

      addToast({ content: "No buttons", buttons: [] });
      await flush();

      const textEl = screen.getByText("No buttons");
      const toast = textEl.closest(".vesper-toast");
      expect(toast?.querySelector(".vesper-toast-buttons")).toBeNull();
    });

    test("renders buttons when provided", async () => {
      render(<Toasts />);

      addToast({
        content: "With buttons",
        buttons: [{ children: "Undo" }, { children: "Retry" }],
      });
      await flush();

      const textEl = screen.getByText("With buttons");
      const toast = textEl.closest(".vesper-toast");
      const buttonsContainer = toast?.querySelector(".vesper-toast-buttons");
      expect(buttonsContainer).not.toBeNull();

      const buttons = buttonsContainer?.querySelectorAll("button");
      expect(buttons).toHaveLength(2);
    });

    test("last button defaults to contrast variant, others to ghost", async () => {
      render(<Toasts />);

      addToast({
        content: "With buttons",
        buttons: [{ children: "Cancel" }, { children: "Confirm" }],
      });
      await flush();

      const textEl = screen.getByText("With buttons");
      const toast = textEl.closest(".vesper-toast");
      const buttons = toast?.querySelectorAll(".vesper-toast-buttons button");
      expect(buttons?.[0]).toHaveClass("vesper-button-ghost");
      expect(buttons?.[1]).toHaveClass("vesper-button-contrast");
    });

    test("button variant can be overridden", async () => {
      render(<Toasts />);

      addToast({
        content: "With danger button",
        buttons: [{ children: "Delete", variant: "danger" }],
      });
      await flush();

      const textEl = screen.getByText("With danger button");
      const toast = textEl.closest(".vesper-toast");
      const button = toast?.querySelector(".vesper-toast-buttons button");
      expect(button).toHaveClass("vesper-button-danger");
    });

    test("buttons are rendered with xs size", async () => {
      render(<Toasts />);

      addToast({
        content: "With button",
        buttons: [{ children: "Action" }],
      });
      await flush();

      const textEl = screen.getByText("With button");
      const toast = textEl.closest(".vesper-toast");
      const button = toast?.querySelector(".vesper-toast-buttons button");
      expect(button).toHaveClass("vesper-button-xs");
    });

    test("button onClick handler fires", async () => {
      const onClick = vi.fn();
      render(<Toasts />);

      addToast({
        content: "Clickable button",
        buttons: [{ children: "Click me", onClick }],
      });
      await flush();

      const button = screen.getByText("Click me");
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe("dismissing", () => {
    test("clicking close button dismisses the toast", async () => {
      render(<Toasts />);

      addToast({ content: "Dismiss me" });
      await flush();

      const textEl = screen.getByText("Dismiss me");
      const toast = textEl.closest(".vesper-toast");
      const closeButton = toast?.querySelector(".vesper-toast-close-button");
      fireEvent.click(closeButton!);
      await flush();

      expect(screen.queryByText("Dismiss me")).toBeNull();
    });

    test("Escape key when no toast has focus", async () => {
      render(<Toasts />);

      addToast({ content: "First" });
      addToast({ content: "Second" });
      await flush();

      fireEvent.keyDown(window, { key: "Escape" });
      await flush();

      expect(screen.queryByText("First")).toBeNull();
      expect(screen.getByText("Second")).not.toBeNull();
    });

    test("Escape key when a toast has focus", async () => {
      render(<Toasts />);

      addToast({ content: "First" });
      addToast({ content: "Second" });
      await flush();

      const secondToast = screen
        .getByText("Second")
        .closest(".vesper-toast") as HTMLElement;
      secondToast.focus();

      fireEvent.keyDown(secondToast, { key: "Escape" });
      await flush();

      expect(screen.getByText("First")).not.toBeNull();
      expect(screen.queryByText("Second")).toBeNull();
    });

    test("Escape key does nothing when no toasts exist", () => {
      render(<Toasts />);

      fireEvent.keyDown(window, { key: "Escape" });
      expect(document.querySelectorAll(".vesper-toast")).toHaveLength(0);
    });

    test("multiple Escape presses dismiss toasts one by one (no focus)", async () => {
      render(<Toasts />);

      addToast({ content: "Toast A" });
      addToast({ content: "Toast B" });
      await flush();

      fireEvent.keyDown(window, { key: "Escape" });
      await flush();
      expect(screen.queryByText("Toast A")).toBeNull();
      expect(screen.getByText("Toast B")).not.toBeNull();

      fireEvent.keyDown(window, { key: "Escape" });
      await flush();
      expect(screen.queryByText("Toast B")).toBeNull();
    });
  });

  describe("tab focus", () => {
    test("Tab moves focus to the first non-dismissed toast", async () => {
      render(<Toasts />);

      addToast({ content: "First toast" });
      addToast({ content: "Second toast" });
      await flush();

      fireEvent.keyDown(window, { key: "Tab" });

      const firstToast = screen
        .getByText("First toast")
        .closest(".vesper-toast");
      expect(document.activeElement).toBe(firstToast);
    });

    test("Tab does nothing when no toasts are present", () => {
      render(<Toasts />);

      fireEvent.keyDown(window, { key: "Tab" });

      expect(document.activeElement).toBe(document.body);
    });

    test("Tab does nothing when focus is already inside the toast container", async () => {
      render(<Toasts />);

      addToast({ content: "Focused toast" });
      await flush();

      const toast = screen
        .getByText("Focused toast")
        .closest(".vesper-toast") as HTMLElement;
      toast.focus();

      fireEvent.keyDown(window, { key: "Tab" });

      expect(document.activeElement).toBe(toast);
    });

    test("Shift+Tab does not move focus to the first toast", async () => {
      render(<Toasts />);

      addToast({ content: "Should not focus" });
      await flush();

      fireEvent.keyDown(window, { key: "Tab", shiftKey: true });

      const toast = screen
        .getByText("Should not focus")
        .closest(".vesper-toast");
      expect(document.activeElement).not.toBe(toast);
    });

    test("Tab skips dismissed toasts and focuses the first non-dismissed one", async () => {
      render(<Toasts />);

      const first = addToast({ content: "Dismissed toast" });
      addToast({ content: "Active toast" });
      await flush();

      first.dismiss();
      await flush();

      fireEvent.keyDown(window, { key: "Tab" });

      const activeToast = screen
        .getByText("Active toast")
        .closest(".vesper-toast");
      expect(document.activeElement).toBe(activeToast);
    });
  });

  describe("timeout", () => {
    test("timeout defaults to false (toast persists indefinitely)", async () => {
      vi.useFakeTimers();

      render(<Toasts />);
      addToast({ content: "Persistent toast" });

      await vi.advanceTimersByTimeAsync(60000);

      expect(screen.getByText("Persistent toast")).not.toBeNull();

      vi.useRealTimers();
    });

    test("toast auto-dismisses after timeout", async () => {
      vi.useFakeTimers();

      render(<Toasts />);
      addToast({ content: "Auto dismiss", timeout: 3000 });

      await vi.advanceTimersByTimeAsync(2999);
      expect(screen.getByText("Auto dismiss")).not.toBeNull();

      await vi.advanceTimersByTimeAsync(1);
      expect(screen.queryByText("Auto dismiss")).toBeNull();

      vi.useRealTimers();
    });

    test("timeout pauses on pointer enter", async () => {
      vi.useFakeTimers();

      render(<Toasts />);
      addToast({ content: "Hover to pause", timeout: 3000 });
      await vi.advanceTimersByTimeAsync(0);

      const textEl = screen.getByText("Hover to pause");
      const wrapper = textEl.closest(".vesper-toast-wrapper");
      fireEvent.pointerEnter(wrapper!);

      await vi.advanceTimersByTimeAsync(10000);

      expect(screen.getByText("Hover to pause")).not.toBeNull();

      vi.useRealTimers();
    });

    test("timeout resumes on pointer leave", async () => {
      vi.useFakeTimers();

      render(<Toasts />);
      addToast({ content: "Hover then leave", timeout: 3000 });
      await vi.advanceTimersByTimeAsync(0);

      const textEl = screen.getByText("Hover then leave");
      const wrapper = textEl.closest(".vesper-toast-wrapper");
      fireEvent.pointerEnter(wrapper!);

      await vi.advanceTimersByTimeAsync(10000);
      expect(screen.getByText("Hover then leave")).not.toBeNull();

      fireEvent.pointerLeave(wrapper!);

      await vi.advanceTimersByTimeAsync(2999);
      expect(screen.getByText("Hover then leave")).not.toBeNull();

      await vi.advanceTimersByTimeAsync(1);
      expect(screen.queryByText("Hover then leave")).toBeNull();

      vi.useRealTimers();
    });

    test("timeout pauses on focus", async () => {
      vi.useFakeTimers();

      render(<Toasts />);
      addToast({ content: "Focus to pause", timeout: 3000 });
      await vi.advanceTimersByTimeAsync(0);

      const textEl = screen.getByText("Focus to pause");
      const wrapper = textEl.closest(".vesper-toast-wrapper");
      fireEvent.focus(wrapper!);

      await vi.advanceTimersByTimeAsync(10000);

      expect(screen.getByText("Focus to pause")).not.toBeNull();

      vi.useRealTimers();
    });

    test("timeout resumes on blur (to outside element)", async () => {
      vi.useFakeTimers();

      render(<Toasts />);
      addToast({ content: "Focus then blur", timeout: 3000 });
      await vi.advanceTimersByTimeAsync(0);

      const textEl = screen.getByText("Focus then blur");
      const wrapper = textEl.closest(".vesper-toast-wrapper");
      fireEvent.focus(wrapper!);

      await vi.advanceTimersByTimeAsync(10000);
      expect(screen.getByText("Focus then blur")).not.toBeNull();

      fireEvent.blur(wrapper!, { relatedTarget: document.body });

      await vi.advanceTimersByTimeAsync(2999);
      expect(screen.getByText("Focus then blur")).not.toBeNull();

      await vi.advanceTimersByTimeAsync(1);
      expect(screen.queryByText("Focus then blur")).toBeNull();

      vi.useRealTimers();
    });

    test("blur to child element does not resume timeout", async () => {
      vi.useFakeTimers();

      render(<Toasts />);
      addToast({
        content: "Internal focus",
        timeout: 3000,
        buttons: [{ children: "Action" }],
      });
      await vi.advanceTimersByTimeAsync(0);

      const textEl = screen.getByText("Internal focus");
      const wrapper = textEl.closest(".vesper-toast-wrapper");
      const button = screen.getByText("Action");

      fireEvent.focus(wrapper!);
      fireEvent.blur(wrapper!, { relatedTarget: button });

      await vi.advanceTimersByTimeAsync(10000);

      expect(screen.getByText("Internal focus")).not.toBeNull();

      vi.useRealTimers();
    });
  });

  describe("addToast return value", () => {
    test("dismiss() method dismisses the toast", async () => {
      render(<Toasts />);

      const handle = addToast({ content: "Programmatic dismiss" });
      await flush();
      expect(screen.getByText("Programmatic dismiss")).not.toBeNull();

      handle.dismiss();
      await flush();

      expect(screen.queryByText("Programmatic dismiss")).toBeNull();
    });

    test("update() method updates toast content", async () => {
      render(<Toasts />);

      const handle = addToast({ content: "Loading...", variant: "loading" });
      await flush();
      expect(screen.getByText("Loading...")).not.toBeNull();

      handle.update({ content: "Done!", variant: "success" });
      await flush();

      const textEl = screen.getByText("Done!");
      const toast = textEl.closest(".vesper-toast");
      expect(toast).toHaveClass("vesper-toast-success");
      expect(screen.queryByText("Loading...")).toBeNull();
    });

    test("update() can change role", async () => {
      render(<Toasts />);

      const handle = addToast({ content: "Updatable", role: "status" });
      await flush();
      expect(screen.getByText("Updatable")).toHaveAttribute("role", "status");

      handle.update({ role: "alert" });
      await flush();
      expect(screen.getByText("Updatable")).toHaveAttribute("role", "alert");
    });

    test("update() can add buttons", async () => {
      render(<Toasts />);

      const handle = addToast({ content: "No buttons yet" });
      await flush();

      const textEl = screen.getByText("No buttons yet");
      const toast = textEl.closest(".vesper-toast");
      expect(toast?.querySelector(".vesper-toast-buttons")).toBeNull();

      handle.update({ buttons: [{ children: "New Button" }] });
      await flush();

      expect(screen.getByText("New Button")).not.toBeNull();
    });

    test("update() can add timeout to a persistent toast", async () => {
      vi.useFakeTimers();

      render(<Toasts />);
      const handle = addToast({ content: "Was persistent" });
      await vi.advanceTimersByTimeAsync(0);

      handle.update({ timeout: 2000 });
      await vi.advanceTimersByTimeAsync(2000);

      expect(screen.queryByText("Was persistent")).toBeNull();

      vi.useRealTimers();
    });
  });

  describe("state transitions", () => {
    test("toast reaches active state after enter animation", async () => {
      render(<Toasts />);

      addToast({ content: "Activating toast" });
      await flush();

      const textEl = screen.getByText("Activating toast");
      const toast = textEl.closest(".vesper-toast");
      expect(toast).toHaveClass("vesper-toast-active");
    });

    test("dismissed toast is removed from DOM after exit animation", async () => {
      render(<Toasts />);

      const handle = addToast({ content: "Goodbye" });
      await flush();

      expect(screen.getByText("Goodbye")).not.toBeNull();

      handle.dismiss();
      await flush();

      expect(screen.queryByText("Goodbye")).toBeNull();
    });
  });
});

describe("toast [snapshot]", () => {
  test("empty container", () => {
    render(<Toasts />);

    const container = document.querySelector(".vesper-toasts-container");
    expect(container).toMatchSnapshot();
  });

  TOAST_VARIANTS.forEach((variant) => {
    test(`variant: ${variant}`, async () => {
      render(<Toasts />);

      addToast({ content: `${variant} toast message`, variant });
      await flush();

      const wrapper = document.querySelector(".vesper-toast-wrapper");
      expect(wrapper).toMatchSnapshot();
    });
  });

  test("with buttons", async () => {
    render(<Toasts />);

    addToast({
      content: "Toast with buttons",
      buttons: [{ children: "Cancel" }, { children: "Confirm" }],
    });
    await flush();

    const wrapper = document.querySelector(".vesper-toast-wrapper");
    expect(wrapper).toMatchSnapshot();
  });

  test("with alert role", async () => {
    render(<Toasts />);

    addToast({
      content: "Critical alert",
      variant: "danger",
      role: "alert",
    });
    await flush();

    const wrapper = document.querySelector(".vesper-toast-wrapper");
    expect(wrapper).toMatchSnapshot();
  });

  test("multiple toasts", async () => {
    render(<Toasts />);

    addToast({ content: "First", variant: "default" });
    addToast({ content: "Second", variant: "success" });
    addToast({ content: "Third", variant: "danger" });
    await flush();

    const container = document.querySelector(".vesper-toasts-container");
    expect(container).toMatchSnapshot();
  });
});

/**
 * Some toast variants have known color contrast issues.
 * These are marked as test.todo following the same pattern as other component tests.
 */
const TOAST_A11Y_FAILING_PERMUTATIONS: {
  variant: ToastVariant;
  theme: string;
}[] = [
  { variant: "success", theme: "light" },
  { variant: "success", theme: "dark" },
  { variant: "warning", theme: "light" },
  { variant: "danger", theme: "light" },
  { variant: "danger", theme: "dark" },
];

describe("toast [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    test(`empty container (${theme})`, async () => {
      render(<Toasts />);

      expect(await axe.run(document.body)).toHaveNoViolations();
    });

    TOAST_VARIANTS.forEach((variant) => {
      const label = `variant: ${variant} (${theme})`;

      const testFn = async () => {
        render(<Toasts />);

        addToast({ content: `${variant} toast`, variant });
        await flush();

        expect(await axe.run(document.body)).toHaveNoViolations();
      };

      const failsA11y = TOAST_A11Y_FAILING_PERMUTATIONS.some(
        (p) => p.variant === variant && p.theme === theme,
      );

      if (failsA11y) test.todo(label, testFn);
      else test(label, testFn);
    });

    const alertLabel = `with alert role (${theme})`;
    const alertTestFn = async () => {
      render(<Toasts />);

      addToast({
        content: "Important alert",
        variant: "danger",
        role: "alert",
      });
      await flush();

      expect(await axe.run(document.body)).toHaveNoViolations();
    };

    // danger variant has color contrast issues in both themes
    test.todo(alertLabel, alertTestFn);

    test(`with buttons (${theme})`, async () => {
      render(<Toasts />);

      addToast({
        content: "Action required",
        buttons: [{ children: "Undo" }, { children: "Dismiss" }],
      });
      await flush();

      expect(await axe.run(document.body)).toHaveNoViolations();
    });
  });
});
