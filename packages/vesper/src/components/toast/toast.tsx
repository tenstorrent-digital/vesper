import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/button/button";
import { Typography } from "@/components/typography/typography";
import { Close } from "@/components/icons/icons";
import { cn } from "@/utils/cn";
import {
  useToasts,
  dismissToast,
  type ToastData,
  destroyToast,
  updateToastState,
} from "./store";
import { animateToastEnter, animateToastExit } from "./animations";

export { type ToastOptions, addToast } from "./store";

const TOAST_DEFAULT_TIMEOUT = 5000;

function Toast({
  options: { buttons, content, passive, timeout = TOAST_DEFAULT_TIMEOUT },
  state,
  id,
}: ToastData) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);

  const [hasFocus, setHasFocus] = useState(false);
  const [hasPointer, setHasPointer] = useState(false);

  useEffect(() => {
    if (passive || timeout === false || hasFocus || hasPointer) {
      return;
    }

    const t = setTimeout(() => {
      dismissToast(id);
    }, timeout);

    return () => clearTimeout(t);
  }, [passive, timeout, id, hasFocus, hasPointer]);

  useEffect(() => {
    switch (state) {
      case "entering":
        animateToastEnter(wrapperRef.current, toastRef.current, () =>
          updateToastState(id, "active"),
        );
        break;
      case "dismissed":
        animateToastExit(wrapperRef.current, toastRef.current, () =>
          destroyToast(id),
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
    >
      <div
        ref={toastRef}
        className={cn("vesper-toast", `vesper-toast-${state}`)}
      >
        <div className="vesper-toast-content">
          <Typography
            as="span"
            className="vesper-toast-children"
            variant="copy-sm"
          >
            {content}
          </Typography>
          {(passive || timeout === false) && (
            <button
              type="button"
              aria-label="Dismiss"
              className="vesper-toast-close-button"
              onClick={() => dismissToast(id)}
            >
              <Close />
            </button>
          )}
        </div>
        {!!buttons?.length && (
          <div className="vesper-toast-buttons">
            {buttons.map((button, index) => {
              const variant =
                button.variant ||
                (index === buttons.length - 1 ? "contrast" : "ghost");

              const type = button.type || "button";

              return (
                <Button
                  key={index}
                  {...button}
                  size="xs"
                  type={type}
                  variant={variant}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function Toasts() {
  const toasts = useToasts();

  return createPortal(
    <div className="vesper-toasts-container">
      {toasts.map(({ id, options, state }) => (
        <Toast key={id} id={id} options={options} state={state} />
      ))}
    </div>,
    document.body,
  );
}
