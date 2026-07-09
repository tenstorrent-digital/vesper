import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/button/button";
import { Typography } from "@/components/typography/typography";
import {
  Close,
  ErrorSolid,
  Spinner,
  SuccessSolid,
  WarningSolid,
} from "@/components/icons/icons";
import { cn } from "@/utils/cn";
import { type ToastData, store, useStore } from "./store";
import { animateToastEnter, animateToastExit } from "./animations";

export { type ToastOptions } from "./store";

export const { addToast } = store;

function Toast({
  options: { content, buttons = [], timeout = false, variant = "default" },
  state,
  id,
}: ToastData) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === "dismissed" || !toastRef.current) return;

    const updateAnnouncement = () => {
      if (!toastRef.current) return;

      const contentText = toastRef.current.querySelector<HTMLDivElement>(
        ".vesper-toast-children",
      )?.innerText;

      const announcement = [
        contentText,
        ...buttons.map((button) => button.altText),
      ].join(". ");
      store.setAnnouncement(announcement);
    };
    updateAnnouncement();

    const observer = new MutationObserver(updateAnnouncement);
    observer.observe(toastRef.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [state, buttons]);

  const [hasFocus, setHasFocus] = useState(false);
  const [hasPointer, setHasPointer] = useState(false);

  useEffect(() => {
    if (timeout === false || hasFocus || hasPointer) {
      return;
    }

    const t = setTimeout(() => {
      store.dismissToast(id);
    }, timeout);

    return () => clearTimeout(t);
  }, [timeout, id, hasFocus, hasPointer]);

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

  return (
    <div
      ref={wrapperRef}
      className="vesper-toast-wrapper"
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
          <button
            type="button"
            aria-label="Dismiss"
            className="vesper-toast-close-button"
            onClick={() => store.dismissToast(id)}
          >
            <Close aria-hidden />
          </button>
        </div>
        {!!buttons?.length && (
          <div className="vesper-toast-buttons">
            {buttons.map(({ altText, content, handler, variant }, index) => {
              const renderedVariant =
                variant ||
                (index === buttons.length - 1 ? "contrast" : "ghost");

              return (
                <Button
                  key={index}
                  size="xs"
                  type="button"
                  variant={renderedVariant}
                  data-vesper-modal-button-alt-text={altText}
                  onClick={(e) => {
                    e.preventDefault();
                    handler();
                  }}
                >
                  {content}
                </Button>
              );
            })}
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

export function Toasts({
  ariaLabel = "Notifications",
  shortcut = "F8",
}: {
  ariaLabel?: string;
  shortcut?:
    | string
    | {
        key: string;
        alt?: boolean;
        ctrl?: boolean;
        shift?: boolean;
        meta?: boolean;
      };
}) {
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
    const focusOldestToast = () => {
      document
        .querySelector<HTMLDivElement>(
          ".vesper-toast:not(.vesper-toast-dismissed)",
        )
        ?.focus();
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (typeof shortcut === "string") {
        if (e.key === shortcut) {
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
        focusOldestToast();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [shortcut]);

  return createPortal(
    <div
      className="vesper-toasts-container"
      role="region"
      aria-label={`${ariaLabel} ${shortcutString}`}
      ref={ref}
    >
      <ToastAnnouncer />
      {toasts.map(({ id, options, state }) => (
        <Toast key={id} id={id} options={options} state={state} />
      ))}
    </div>,
    document.body,
  );
}
