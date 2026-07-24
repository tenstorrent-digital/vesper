import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  store,
  TOAST_VARIANTS,
  type ToastVariant,
} from "@/components/toast/store";
import { addToast, Toasts } from "@/components/toast/toast";

import "@/styles/test.css";

/**
 * Flush pending animation promises (duration: 0 via reduced-motion mock).
 * Uses requestAnimationFrame which is unaffected by vi.useFakeTimers().
 */
const flush = () => new Promise((r) => requestAnimationFrame(r));

/** Wait for all toasts to reach "active" state */
const waitForActiveToasts = (count: number) =>
  waitFor(() => {
    const active = document.querySelectorAll(
      '.vesper-toast[data-state="active"]',
    );
    expect(active).toHaveLength(count);
  });

beforeEach(() => {
  store.destroyAllToasts();
});

afterEach(() => {
  cleanup();
  store.destroyAllToasts();
});

describe("toast [unit]", () => {
  test("renders empty container with no toasts", () => {
    render(<Toasts />);

    const container = document.querySelector(".vesper-toasts-container");
    expect(container).not.toBeNull();
    expect(container).toHaveAttribute("role", "region");
    expect(document.querySelector(".vesper-toast")).toBeNull();
  });

  test("adding a toast renders it", async () => {
    render(<Toasts />);

    addToast({ content: "Hello" });
    await waitForActiveToasts(1);

    const toast = document.querySelector(".vesper-toast");
    expect(toast).not.toBeNull();
    expect(toast?.textContent).toContain("Hello");
  });

  test("toast transitions to active state after entering", async () => {
    render(<Toasts />);

    addToast({ content: "Animating" });
    await waitForActiveToasts(1);

    const toast = document.querySelector(".vesper-toast");
    expect(toast).toHaveAttribute("data-state", "active");
    expect(toast).toHaveClass("vesper-toast-active");
  });

  test("dismiss toast via close button", async () => {
    render(<Toasts />);

    addToast({ content: "Dismissable" });
    await waitForActiveToasts(1);

    const closeButton = document.querySelector(".vesper-toast-close-button");
    expect(closeButton).not.toBeNull();

    fireEvent.click(closeButton!);

    expect(document.querySelector(".vesper-toast")).toHaveAttribute(
      "data-state",
      "dismissed",
    );

    await waitFor(() => {
      expect(document.querySelector(".vesper-toast")).toBeNull();
    });
  });

  test("dismiss toast via Escape key", async () => {
    render(<Toasts />);

    addToast({ content: "Escape me" });
    await waitForActiveToasts(1);

    const wrapper = document.querySelector(".vesper-toast-wrapper");
    fireEvent.keyDown(wrapper!, { key: "Escape" });

    expect(document.querySelector(".vesper-toast")).toHaveAttribute(
      "data-state",
      "dismissed",
    );

    await waitFor(() => {
      expect(document.querySelector(".vesper-toast")).toBeNull();
    });
  });

  test("toast with timeout auto-dismisses", async () => {
    render(<Toasts />);

    addToast({ content: "Auto dismiss", timeout: 50 });
    await waitForActiveToasts(1);

    await waitFor(() => {
      expect(document.querySelector(".vesper-toast")).toBeNull();
    });
  });

  test("toast timeout pauses on pointer hover", async () => {
    render(<Toasts />);

    addToast({ content: "Hover me", timeout: 100 });
    await waitForActiveToasts(1);

    const wrapper = document.querySelector(".vesper-toast-wrapper")!;

    // hover over the toast to pause the timer
    fireEvent.pointerEnter(wrapper);

    // wait longer than the timeout
    await new Promise((r) => setTimeout(r, 200));

    // should still be active because pointer is over it
    expect(document.querySelector(".vesper-toast")).toHaveAttribute(
      "data-state",
      "active",
    );

    // leave the toast to resume the timer
    fireEvent.pointerLeave(wrapper);

    await waitFor(() => {
      expect(document.querySelector(".vesper-toast")).toBeNull();
    });
  });

  test("toast timeout pauses on focus", async () => {
    render(<Toasts />);

    addToast({ content: "Focus me", timeout: 100 });
    await waitForActiveToasts(1);

    const wrapper = document.querySelector(".vesper-toast-wrapper")!;

    // focus the toast to pause the timer
    fireEvent.focus(wrapper);

    // wait longer than the timeout
    await new Promise((r) => setTimeout(r, 200));

    // should still be active because focused
    expect(document.querySelector(".vesper-toast")).toHaveAttribute(
      "data-state",
      "active",
    );

    // blur the toast (relatedTarget outside the wrapper) to resume
    fireEvent.blur(wrapper, { relatedTarget: document.body });

    await waitFor(() => {
      expect(document.querySelector(".vesper-toast")).toBeNull();
    });
  });

  test("multiple toasts render", async () => {
    render(<Toasts />);

    addToast({ content: "First" });
    addToast({ content: "Second" });
    addToast({ content: "Third" });
    await waitForActiveToasts(3);

    const toasts = document.querySelectorAll(".vesper-toast");
    expect(toasts).toHaveLength(3);
  });

  test("programmatic dismiss via returned handle", async () => {
    render(<Toasts />);

    const toast = addToast({ content: "Handle dismiss" });
    await waitForActiveToasts(1);

    expect(document.querySelector(".vesper-toast")).not.toBeNull();

    toast.dismiss();

    await waitFor(() => {
      expect(document.querySelector(".vesper-toast")).toBeNull();
    });
  });

  test("programmatic update via returned handle", async () => {
    render(<Toasts />);

    const toast = addToast({ content: "Original" });
    await waitForActiveToasts(1);

    expect(document.querySelector(".vesper-toast-children")?.textContent).toBe(
      "Original",
    );

    toast.update({ content: "Updated" });

    await waitFor(() => {
      expect(
        document.querySelector(".vesper-toast-children")?.textContent,
      ).toBe("Updated");
    });
  });

  test("toast with action renders action and dismiss buttons", async () => {
    const handler = vi.fn();

    render(<Toasts />);

    addToast({
      content: "With action",
      action: { content: "Undo", handler },
    });
    await waitForActiveToasts(1);

    const buttons = document.querySelectorAll(".vesper-toast-buttons button");
    expect(buttons).toHaveLength(2);

    // dismiss button is "ghost" variant
    expect(buttons[0]).toHaveClass("vesper-button-ghost");
    expect(buttons[0]?.textContent).toContain("Dismiss");

    // action button is "contrast" variant
    expect(buttons[1]).toHaveClass("vesper-button-contrast");
    expect(buttons[1]?.textContent).toContain("Undo");

    fireEvent.click(buttons[1]!);
    expect(handler).toHaveBeenCalled();
  });

  test("toast with action does not show close button", async () => {
    render(<Toasts />);

    addToast({
      content: "No close button",
      action: { content: "Undo", handler: () => {} },
    });
    await waitForActiveToasts(1);

    const closeButton = document.querySelector(".vesper-toast-close-button");
    expect(closeButton).toBeNull();
  });

  test("toast action dismiss button dismisses the toast", async () => {
    render(<Toasts />);

    addToast({
      content: "Dismiss via action",
      action: { content: "Undo", handler: () => {} },
    });
    await waitForActiveToasts(1);

    const buttons = document.querySelectorAll(".vesper-toast-buttons button");
    // click the dismiss button (first button)
    fireEvent.click(buttons[0]!);

    expect(document.querySelector(".vesper-toast")).toHaveAttribute(
      "data-state",
      "dismissed",
    );

    await waitFor(() => {
      expect(document.querySelector(".vesper-toast")).toBeNull();
    });
  });

  test("custom dismissText on close button", async () => {
    render(<Toasts />);

    addToast({
      content: "Custom dismiss",
      dismissText: "Close",
    });
    await waitForActiveToasts(1);

    const closeButton = document.querySelector(".vesper-toast-close-button");
    expect(closeButton).toHaveAttribute("aria-label", "Close");
  });

  test("custom dismissText with action", async () => {
    render(<Toasts />);

    addToast({
      content: "Custom dismiss with action",
      action: { content: "Undo", handler: () => {} },
      dismissText: "Close",
    });
    await waitForActiveToasts(1);

    const buttons = document.querySelectorAll(".vesper-toast-buttons button");
    expect(buttons[0]?.textContent).toContain("Close");
  });

  test("each variant renders correct icon", async () => {
    render(<Toasts />);

    const variantIconMap: Record<ToastVariant, boolean> = {
      default: false,
      loading: true,
      success: true,
      warning: true,
      danger: true,
    };

    for (const variant of TOAST_VARIANTS) {
      store.destroyAllToasts();
      addToast({ content: `${variant} toast`, variant });
      await waitForActiveToasts(1);

      const icon = document.querySelector(".vesper-toast-icon");
      if (variantIconMap[variant]) {
        expect(icon, `${variant} should have an icon`).not.toBeNull();
      } else {
        expect(icon, `${variant} should not have an icon`).toBeNull();
      }
    }
  });

  test("variant classes are applied correctly", async () => {
    render(<Toasts />);

    for (const variant of TOAST_VARIANTS) {
      store.destroyAllToasts();
      addToast({ content: `${variant} toast`, variant });
      await waitForActiveToasts(1);

      const toast = document.querySelector(".vesper-toast");
      expect(toast).toHaveClass(`vesper-toast-${variant}`);
    }
  });

  test("container has region role with correct aria-label", () => {
    render(<Toasts ariaLabel="Alerts" />);

    const container = document.querySelector(".vesper-toasts-container");
    expect(container).toHaveAttribute("role", "region");
    expect(container).toHaveAttribute("aria-label", "Alerts (F8)");
  });

  test("default aria-label includes shortcut", () => {
    render(<Toasts />);

    const container = document.querySelector(".vesper-toasts-container");
    expect(container).toHaveAttribute("aria-label", "Notifications (F8)");
  });

  test("custom shortcut string in aria-label", () => {
    render(<Toasts shortcut="F6" />);

    const container = document.querySelector(".vesper-toasts-container");
    expect(container).toHaveAttribute("aria-label", "Notifications (F6)");
  });

  test("custom shortcut object in aria-label", () => {
    render(<Toasts shortcut={{ key: "T", ctrl: true, shift: true }} />);

    const container = document.querySelector(".vesper-toasts-container");
    expect(container).toHaveAttribute(
      "aria-label",
      "Notifications (Ctrl+Shift+T)",
    );
  });

  test("F8 shortcut focuses oldest toast", async () => {
    render(<Toasts />);

    addToast({ content: "First" });
    addToast({ content: "Second" });
    await waitForActiveToasts(2);

    fireEvent.keyDown(window, { key: "F8" });
    await flush();

    const toasts = document.querySelectorAll(".vesper-toast");
    expect(document.activeElement).toBe(toasts[0]);
  });

  test("custom string shortcut focuses oldest toast", async () => {
    render(<Toasts shortcut="F6" />);

    addToast({ content: "First" });
    await waitForActiveToasts(1);

    fireEvent.keyDown(window, { key: "F6" });
    await flush();

    const toast = document.querySelector(".vesper-toast");
    expect(document.activeElement).toBe(toast);
  });

  test("custom object shortcut focuses oldest toast", async () => {
    render(<Toasts shortcut={{ key: "T", ctrl: true }} />);

    addToast({ content: "First" });
    await waitForActiveToasts(1);

    fireEvent.keyDown(window, { key: "T", ctrlKey: true });
    await flush();

    const toast = document.querySelector(".vesper-toast");
    expect(document.activeElement).toBe(toast);
  });

  test("announcer has role=status", () => {
    render(<Toasts />);

    const announcer = document.querySelector(".vesper-toast-announcer");
    expect(announcer).not.toBeNull();
    expect(announcer).toHaveAttribute("role", "status");
  });

  test("announcer includes action altText in announcement", async () => {
    render(<Toasts />);

    addToast({
      content: "File deleted",
      action: {
        content: "Undo",
        altText: "Go to dashboard to undo",
        handler: () => {},
      },
    });
    await waitForActiveToasts(1);

    const announcer = document.querySelector(".vesper-toast-announcer");
    expect(announcer?.textContent).toContain("File deleted");
    expect(announcer?.textContent).toContain("Go to dashboard to undo");
  });

  test("announcer clears when all toasts are removed", async () => {
    render(<Toasts />);

    const toast = addToast({ content: "Temporary" });
    await waitForActiveToasts(1);

    const announcer = document.querySelector(".vesper-toast-announcer");
    expect(announcer?.textContent).toContain("Temporary");

    toast.dismiss();

    await waitFor(() => {
      expect(document.querySelector(".vesper-toast")).toBeNull();
    });

    await waitFor(() => {
      expect(announcer?.textContent).toBe("");
    });
  });

  test("toast without timeout does not auto-dismiss", async () => {
    render(<Toasts />);

    addToast({ content: "No timeout" });
    await waitForActiveToasts(1);

    // wait a bit to confirm it doesn't dismiss
    await new Promise((r) => setTimeout(r, 200));

    expect(document.querySelector(".vesper-toast")).toHaveAttribute(
      "data-state",
      "active",
    );
  });

  test("toast is portalled to document.body", () => {
    const { container } = render(<Toasts />);

    // the container element should be empty since Toasts portals to body
    expect(container.innerHTML).toBe("");
    expect(
      document.body.querySelector(".vesper-toasts-container"),
    ).not.toBeNull();
  });

  test("focus restores to previously focused element when leaving toast region", async () => {
    const { container } = render(
      <>
        <button data-testid="outside-button">Outside</button>
        <Toasts />
      </>,
    );

    addToast({ content: "Focus test" });
    await waitForActiveToasts(1);

    const outsideButton = container.querySelector(
      "[data-testid='outside-button']",
    ) as HTMLElement;
    outsideButton.focus();
    expect(document.activeElement).toBe(outsideButton);

    // move focus into the toast region — captures previouslyFocused
    const toast = document.querySelector<HTMLElement>(".vesper-toast")!;
    toast.focus();
    expect(document.activeElement).toBe(toast);

    // blur the toast without moving focus to another element inside the region,
    // simulating focus leaving the container (e.g. tabbing past the last element)
    toast.blur();
    await flush();

    expect(document.activeElement).toBe(outsideButton);
  });

  test("focus does not restore to a non-focusable element", async () => {
    const { container } = render(
      <>
        <button data-testid="outside-button">Outside</button>
        <Toasts />
      </>,
    );

    addToast({ content: "Focus test" });
    await waitForActiveToasts(1);

    const outsideButton = container.querySelector(
      "[data-testid='outside-button']",
    ) as HTMLElement;
    outsideButton.focus();

    // move focus into the toast region
    const toast = document.querySelector<HTMLElement>(".vesper-toast")!;
    toast.focus();

    // disable the outside button so it's no longer focusable
    outsideButton.setAttribute("disabled", "");

    // blur the toast — focus should NOT restore to the disabled button
    toast.blur();
    await flush();

    expect(document.activeElement).not.toBe(outsideButton);
  });

  test("dismissing focused toast moves focus to nearest active toast", async () => {
    render(<Toasts />);

    addToast({ content: "First" });
    addToast({ content: "Second" });
    addToast({ content: "Third" });
    await waitForActiveToasts(3);

    const toasts = document.querySelectorAll<HTMLElement>(".vesper-toast");

    // focus the middle toast
    toasts[1]!.focus();
    expect(document.activeElement).toBe(toasts[1]);

    // dismiss the middle toast — focus should move to the previous (first) toast
    store.dismissToast(store.getSnapshot().toasts[1]!.id);
    await flush();

    await waitFor(() => {
      expect(document.activeElement).toBe(
        document.querySelectorAll<HTMLElement>(".vesper-toast")[0],
      );
    });
  });

  test("dismissing first focused toast moves focus to next toast", async () => {
    render(<Toasts />);

    addToast({ content: "First" });
    addToast({ content: "Second" });
    await waitForActiveToasts(2);

    const toasts = document.querySelectorAll<HTMLElement>(".vesper-toast");

    // focus the first toast
    toasts[0]!.focus();
    expect(document.activeElement).toBe(toasts[0]);

    // dismiss the first toast — focus should move to the next (second) toast
    store.dismissToast(store.getSnapshot().toasts[0]!.id);
    await flush();

    await waitFor(() => {
      expect(document.activeElement).toBe(
        document.querySelectorAll<HTMLElement>(".vesper-toast")[0],
      );
    });
  });

  test("dismissing the only focused toast blurs focus", async () => {
    render(<Toasts />);

    addToast({ content: "Only" });
    await waitForActiveToasts(1);

    const toast = document.querySelector<HTMLElement>(".vesper-toast")!;
    toast.focus();
    expect(document.activeElement).toBe(toast);

    store.dismissToast(store.getSnapshot().toasts[0]!.id);
    await flush();

    await waitFor(() => {
      expect(document.querySelector(".vesper-toast")).toBeNull();
    });

    // with no other toasts, activeElement should not be the dismissed toast
    expect(document.activeElement).not.toBe(toast);
  });
});

describe("toast [snapshot]", () => {
  test("empty container", async () => {
    render(<Toasts ariaLabel="Notifications" shortcut="" />);

    const container = document.querySelector(".vesper-toasts-container");
    expect(container).toMatchSnapshot();
  });

  TOAST_VARIANTS.forEach((variant) => {
    test(`variant: ${variant}`, async () => {
      render(<Toasts />);

      addToast({ content: `${variant} toast message`, variant });
      await waitForActiveToasts(1);

      const wrapper = document.querySelector(".vesper-toast-wrapper");
      expect(wrapper).toMatchSnapshot();
    });
  });

  test("with action", async () => {
    render(<Toasts />);

    addToast({
      content: "Toast with action",
      action: { content: "Undo", handler: () => {} },
    });
    await waitForActiveToasts(1);

    const wrapper = document.querySelector(".vesper-toast-wrapper");
    expect(wrapper).toMatchSnapshot();
  });

  test("multiple toasts", async () => {
    render(<Toasts ariaLabel="Notifications" shortcut="" />);

    addToast({ content: "First" });
    addToast({ content: "Second", variant: "success" });
    addToast({ content: "Third", variant: "danger" });
    await waitForActiveToasts(3);

    const container = document.querySelector(".vesper-toasts-container");
    expect(container).toMatchSnapshot();
  });
});

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

        addToast({ content: `${variant} toast message`, variant });
        await waitForActiveToasts(1);

        expect(await axe.run(document.body)).toHaveNoViolations();
      };

      const failsA11y = TOAST_A11Y_FAILING_PERMUTATIONS.some(
        (p) => p.variant === variant && p.theme === theme,
      );

      if (failsA11y) test.todo(label, testFn);
      else test(label, testFn);
    });

    test(`with action (${theme})`, async () => {
      render(<Toasts />);

      addToast({
        content: "Toast with action",
        action: { content: "Undo", handler: () => {} },
      });
      await waitForActiveToasts(1);

      expect(await axe.run(document.body)).toHaveNoViolations();
    });
  });
});
