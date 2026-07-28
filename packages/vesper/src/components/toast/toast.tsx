"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/button/button";
import {
  Close,
  ErrorSolid,
  Spinner,
  SuccessSolid,
  WarningSolid,
} from "@/components/icons/icons";
import { Typography } from "@/components/typography/typography";

import { cn } from "@/utils/cn";

import { animateToastEnter, animateToastExit } from "./animations";
import { store, type ToastData, useStore } from "./store";
import { focusOldestToast, getNearestActiveToast, isFocusable } from "./utils";

export { TOAST_VARIANTS, type ToastOptions } from "./store";

export const { addToast } = store;

function Toast({
  options: {
    content,
    action,
    timeout = false,
    variant = "default",
    dismissText = "Dismiss",
  },
  state,
  id,
}: ToastData) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);

  // handle updating announcement text when content changes
  useEffect(() => {
    if (state === "dismissed" || !toastRef.current) return;

    const updateAnnouncement = () => {
      if (!toastRef.current) return;

      const contentText = toastRef.current.querySelector<HTMLDivElement>(
        ".vesper-toast-children",
      )?.innerText;

      const announcement = [contentText, action?.altText]
        .filter(Boolean)
        .join(". ");
      store.setAnnouncement(announcement);
    };
    updateAnnouncement();

    const observer = new MutationObserver(updateAnnouncement);
    observer.observe(toastRef.current, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, [state, action]);

  const [hasFocus, setHasFocus] = useState(false);
  const [hasPointer, setHasPointer] = useState(false);

  // handle timeout if present
  useEffect(() => {
    if (timeout === false || hasFocus || hasPointer) {
      return;
    }

    const t = setTimeout(() => {
      store.dismissToast(id);
    }, timeout);

    return () => clearTimeout(t);
  }, [timeout, id, hasFocus, hasPointer]);

  // handle enter and exit animations
  useEffect(() => {
    switch (state) {
      case "entering":
        animateToastEnter(wrapperRef.current, toastRef.current, () =>
          store.updateToastState(id, "active"),
        );
        break;
      case "dismissed":
        animateToastExit(wrapperRef.current, toastRef.current, () =>
          store.destroyToast(id),
        );
        break;
      default:
        break;
    }
  }, [state, id]);

  // move focus to the nearest active toast if this one was dismissed while focused
  useEffect(() => {
    if (state === "dismissed" && hasFocus && toastRef.current) {
      const ref = toastRef.current;

      /**
       * requestAnimationFrame gives React a chance to flush all pending state updates
       * (e.g., if multiple toasts were dismissed in the same batch), so by the time we
       * query for the nearest active toast, the DOM reflects the true current state
       * */
      requestAnimationFrame(() => {
        const nearestToast = getNearestActiveToast(ref);
        if (nearestToast) nearestToast.focus();
        else ref.blur();
      });
    }
  }, [state, hasFocus]);

  return (
    <div
      ref={wrapperRef}
      className="vesper-toast-wrapper"
      inert={state === "dismissed"}
      onPointerEnter={() => setHasPointer(true)}
      onPointerLeave={() => setHasPointer(false)}
      onFocus={() => setHasFocus(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setHasFocus(false);
        }
      }}
      onKeyDown={(e) => {
        if (e.key !== "Escape") return;
        store.dismissToast(id);
      }}
    >
      <div
        ref={toastRef}
        data-state={state}
        className={cn(
          "vesper-toast",
          `vesper-toast-${state}`,
          `vesper-toast-${variant}`,
        )}
        tabIndex={0}
      >
        <div className="vesper-toast-content">
          {variant === "loading" && (
            <Spinner aria-hidden className="vesper-toast-icon" />
          )}
          {variant === "success" && (
            <SuccessSolid aria-hidden className="vesper-toast-icon" />
          )}
          {variant === "warning" && (
            <WarningSolid aria-hidden className="vesper-toast-icon" />
          )}
          {variant === "danger" && (
            <ErrorSolid aria-hidden className="vesper-toast-icon" />
          )}
          <Typography
            as="span"
            className="vesper-toast-children"
            variant="copy-sm"
          >
            {content}
          </Typography>
          {!action && (
            <button
              type="button"
              aria-label={dismissText}
              className="vesper-toast-close-button"
              onClick={() => store.dismissToast(id)}
            >
              <Close aria-hidden />
            </button>
          )}
        </div>
        {action && (
          <div className="vesper-toast-buttons">
            <Button
              size="xs"
              type="button"
              variant="ghost"
              onClick={() => store.dismissToast(id)}
            >
              {dismissText}
            </Button>
            <Button
              size="xs"
              type="button"
              variant="contrast"
              onClick={action.handler}
            >
              {action.content}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ToastAnnouncer() {
  const { announcement, toasts } = useStore();

  const numToasts = toasts.length;
  useEffect(() => {
    if (numToasts === 0) store.setAnnouncement(null);
  }, [numToasts]);

  return (
    <span className="vesper-toast-announcer" role="status" aria-atomic={false}>
      {announcement}
    </span>
  );
}

export type ToastsShortcut =
  | string
  | {
      key: string;
      alt?: boolean;
      ctrl?: boolean;
      shift?: boolean;
      meta?: boolean;
    };

export interface ToastsProps {
  /** The accessible label for the toast region, announced by screen readers. The keyboard shortcut is automatically appended. Defaults to `"Notifications"`. */
  ariaLabel?: string;
  /** A keyboard shortcut that moves focus to the oldest active toast. Accepts a key name string or an object specifying modifier keys. Defaults to `"F8"`. */
  shortcut?: ToastsShortcut;
  /** The DOM element or document fragment to portal the toast container into. Defaults to the `document.body`. */
  container?: Element | DocumentFragment;
}

/**
 * A toast notification container that renders and manages active toasts with keyboard navigation and screen-reader announcements.
 *
 * @param {string} [props.ariaLabel] - (optional) The accessible label for the toast region. @default Notifications`
 * @param {ToastsShortcut} [props.shortcut] - (optional) Keyboard shortcut that moves focus to the oldest active toast. @default F8`
 * @param {Element | DocumentFragment} [props.container] - (optional) The DOM element to portal toasts into. @default document.body
 *
 * @example
 * <Toasts />
 *
 * @example
 * <Toasts shortcut={{ key: "t", ctrl: true }} ariaLabel="Alerts" />
 */
export function Toasts(props: ToastsProps) {
  const { ariaLabel = "Notifications", shortcut = "F8", container } = props;

  const { toasts } = useStore();
  const ref = useRef<HTMLDivElement>(null);

  const shortcutString =
    typeof shortcut === "string"
      ? `(${shortcut})`
      : `(${[
          shortcut.ctrl && "Ctrl",
          shortcut.alt && "Alt",
          shortcut.shift && "Shift",
          shortcut.meta && "Cmd",
          shortcut.key,
        ]
          .filter(Boolean)
          .join("+")})`;

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (typeof shortcut === "string") {
        if (e.key === shortcut) {
          e.preventDefault();
          focusOldestToast();
        }
        return;
      }

      if (
        e.key === shortcut.key &&
        !!shortcut.alt === e.altKey &&
        !!shortcut.meta === e.metaKey &&
        !!shortcut.ctrl === e.ctrlKey &&
        !!shortcut.shift === e.shiftKey
      ) {
        e.preventDefault();
        focusOldestToast();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [shortcut, toasts]);

  const previouslyFocused = useRef<HTMLElement | null>(null);
  const pointerDown = useRef(false);

  useEffect(() => {
    const handlePointerDown = () => (pointerDown.current = true);
    const handlePointerUp = () => (pointerDown.current = false);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("pointerup", handlePointerUp);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  // makes rendering Toasts SSR-safe
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div
      className="vesper-toasts-container"
      role="region"
      aria-label={`${ariaLabel} ${shortcutString}`}
      ref={ref}
      onFocus={(e) => {
        if (
          document.body.contains(e.relatedTarget) &&
          !ref.current?.contains(e.relatedTarget) &&
          e.relatedTarget instanceof HTMLElement
        ) {
          previouslyFocused.current = e.relatedTarget;
        }
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          const elementToRestore = previouslyFocused.current;
          previouslyFocused.current = null;

          /**
           * If focus is moving to a specific element outside the container
           * (e.g., the user clicked a button), don't interfere.
           * */
          if (e.relatedTarget) return;

          /**
           * If the blur was triggered by a pointer event
           * (e.g., clicking on empty space), don't restore focus.
           * */
          if (pointerDown.current) return;

          /**
           * requestAnimationFrame gives React a chance to flush all pending state updates
           * in case the DOM structure changes and the element we want to restore focus to
           * no longer exists in the dom or otherwise becomes not focusable.
           */
          requestAnimationFrame(() => {
            if (elementToRestore && isFocusable(elementToRestore)) {
              elementToRestore.focus();
            }
          });
        }
      }}
    >
      <ToastAnnouncer />
      {toasts.map(({ id, options, state }) => (
        <Toast key={id} id={id} options={options} state={state} />
      ))}
    </div>,
    container || document.body,
  );
}
