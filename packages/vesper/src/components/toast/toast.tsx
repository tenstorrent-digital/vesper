import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/button/button";
import { Typography } from "@/components/typography/typography";
import { Close } from "@/components/icons/icons";
import { cn } from "@/utils/cn";
import { useToasts, dismissToast, type ToastData, destroyToast } from "./store";
import { animateToastEnter, animateToastExit } from "./animations";

export { type ToastOptions, addToast } from "./store";

const TOAST_DEFAULT_TIMEOUT = 5000;

function Toast({
  options: { buttons, content, dismissable, timeout = TOAST_DEFAULT_TIMEOUT },
  state,
  id,
}: ToastData) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);

  const [observedHeight, setObservedHeight] = useState(0);

  useEffect(() => {
    if (!toastRef.current) return;

    const observer = new ResizeObserver((entries) => {
      setObservedHeight(entries[0]?.borderBoxSize[0]?.blockSize || 0);
    });
    observer.observe(toastRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (timeout === false) return;
    const t = setTimeout(() => dismissToast(id), timeout);
    return () => clearTimeout(t);
  }, [timeout, id]);

  useEffect(() => {
    switch (state) {
      case "active":
        animateToastEnter(wrapperRef.current);
        break;
      case "dismissed":
        animateToastExit(wrapperRef.current)?.finished.then(() =>
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
      style={{ height: state === "active" ? observedHeight : 0 }}
      className="vesper-toast-wrapper"
      aria-hidden={state === "dismissed"}
      role="status"
      aria-live="polite"
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
          {dismissable && (
            <button
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

              return (
                <Button key={index} size="xs" {...button} variant={variant} />
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
